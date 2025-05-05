import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { testComplianceDetection, formatRegulationData, ComplianceFindings } from '@/utils/testComplianceDetection';
import { Loader2, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

const PolicyEditor = () => {
  // Test Compliance State
  const [mockRegulationJson, setMockRegulationJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('test');

  // Default mock regulation data
  const defaultRegulationData = {
    source: "GDPR",
    title: "GDPR 2023 Amendment on Asia-Pacific Data Protection Standards",
    summary: "Updates to GDPR requirements for businesses operating in APAC regions.",
    content: "The European Data Protection Board has updated GDPR guidelines for multinational organizations operating in Asia-Pacific regions.",
    previous_version: "Previous GDPR regulations did not explicitly address alignment with Asia-Pacific regional data protection laws",
    changes: [
      {
        section: "Article 33",
        old_text: "Data breach notification within 72 hours to supervisory authority",
        new_text: "Data breach notification within 72 hours to EU supervisory authority and adherence to local notification timelines (e.g., Singapore PDPA's 72-hour requirement)"
      },
      {
        section: "Article 44",
        old_text: "General principle for transfers to third countries",
        new_text: "General principle for transfers to third countries, with specific requirements for China PIPL compliance including mandatory security assessments"
      }
    ],
    jurisdiction: "EU-GDPR"
  };

  const handleLoadDefaultData = () => {
    setMockRegulationJson(JSON.stringify(defaultRegulationData, null, 2));
  };

  const handleTest = async () => {
    setError(null);
    setLoading(true);
    
    try {
      let regulationData;
      
      try {
        regulationData = JSON.parse(mockRegulationJson);
      } catch (e) {
        throw new Error('Invalid JSON format. Please check your input.');
      }
      
      // Format the regulation data properly
      const formattedRegulation = formatRegulationData(regulationData);
      
      // Make the actual API call to get results
      const result = await testComplianceDetection(formattedRegulation);
      setResults(result);
      
      // Switch to results tab
      setActiveTab('test-results');
    } catch (err: any) {
      setError(err.message || 'An error occurred while testing compliance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render priority badges
  const getPriorityBadge = (priority: string) => {
    const colorClasses = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-green-100 text-green-800"
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs ${colorClasses[priority as keyof typeof colorClasses] || "bg-gray-100"}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Helper function to safely access nested properties
  const getNestedValue = (obj: any, path: string, defaultValue: any = null) => {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : defaultValue;
    }, obj);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Privacy Policy Editor</h1>
        <p className="text-muted-foreground">Test your privacy policy compliance against regulations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="test">Test Compliance</TabsTrigger>
          <TabsTrigger value="test-results" disabled={!results}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="test" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mock Regulation Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Textarea
                  value={mockRegulationJson}
                  onChange={(e) => setMockRegulationJson(e.target.value)}
                  placeholder="Paste your mock regulation data in JSON format here..."
                  className="min-h-[400px] font-mono"
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleLoadDefaultData}>
                  Load Default Data
                </Button>
                
                <Button 
                  onClick={handleTest}
                  disabled={loading || !mockRegulationJson.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Compliance'
                  )}
                </Button>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test-results" className="mt-6">
          {results && (
            <div className="space-y-6">
              {/* Regulation Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Regulation Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {getNestedValue(results, 'data.regulation.title') || 
                         getNestedValue(results, 'data.title') || 
                         'Regulation Analysis'}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {getNestedValue(results, 'data.regulation.description') || 
                         getNestedValue(results, 'status') === 'success' ? 'Compliance analysis completed successfully' : 'Analysis completed with some issues'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Priority</div>
                        <div className="mt-1 font-semibold text-blue-900 flex items-center">
                          <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
                          {getNestedValue(results, 'data.regulation.priority', 'MEDIUM').toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Due Date</div>
                        <div className="mt-1 font-semibold text-blue-900 flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-blue-500" />
                          {getNestedValue(results, 'data.regulation.dueDate') || getNestedValue(results, 'data.final_report.due_date') || 'Not specified'}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Potential Fine</div>
                        <div className="mt-1 font-semibold text-blue-900 flex items-center">
                          <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />
                          {getNestedValue(results, 'data.regulation.potentialFine') || 
                           getNestedValue(results, 'results.impact_assessment.impact_assessment.exposures.0.financial_impact', 'Varies based on violation severity')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Privacy Policy */}
              {getNestedValue(results, 'data.privacy_policy') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Privacy Policy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded whitespace-pre-line font-mono text-sm">
                      {getNestedValue(results, 'data.privacy_policy')}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Key Requirements</h3>
                      <ul className="mt-2 space-y-2">
                        {(getNestedValue(results, 'data.analysis.key_requirements') || 
                          getNestedValue(results, 'data.final_report.key_requirements') || 
                          getNestedValue(results, 'results.implementation_plan.plan.priority_actions') || 
                          []).map((req: any, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span>{typeof req === 'string' ? req : req.title || req.description || JSON.stringify(req)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Policy Updates Needed</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(getNestedValue(results, 'data.analysis.policy_updates') || 
                          getNestedValue(results, 'results.impact_assessment.impact_assessment.impact_areas') || 
                          []).map((update: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {update}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Impact Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Operational Changes</h3>
                      <ul className="mt-2 space-y-2">
                        {(getNestedValue(results, 'data.impact.operational_changes') || 
                          getNestedValue(results, 'steps_completed') || 
                          []).map((change: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-800 mr-2">
                              {index + 1}
                            </div>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Compliance Risks</h3>
                      <ul className="mt-2 space-y-2">
                        {(getNestedValue(results, 'data.impact.compliance_risks') || 
                          getNestedValue(results, 'data.final_report.compliance_risks') || 
                          getNestedValue(results, 'results.impact_assessment.impact_assessment.findings') || 
                          []).map((risk: any, index: number) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                            <span>{typeof risk === 'string' ? risk : risk.title || risk.description || JSON.stringify(risk)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {getNestedValue(results, 'data.impact.resource_impact') && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Resource Impact</h3>
                        <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded">
                          {getNestedValue(results, 'data.impact.resource_impact')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Action Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(getNestedValue(results, 'data.action_plan.action_items') || 
                      getNestedValue(results, 'results.implementation_plan.action_items') || 
                      []).map((item: any, index: number) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium">{item.title}</h3>
                          {getPriorityBadge(item.priority || 'medium')}
                        </div>
                        <p className="mt-2 text-gray-600">{item.description}</p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Assigned to:</span> {item.assigned_to || item.owner || 'Not assigned'}
                          </div>
                          <div>
                            <span className="font-medium">Deadline:</span> {item.deadline || item.due_date || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* If no action items are found, display a message */}
                    {(!getNestedValue(results, 'data.action_plan.action_items') && 
                      !getNestedValue(results, 'results.implementation_plan.action_items')) && (
                      <div className="p-4 bg-gray-100 rounded">
                        <p className="text-gray-600">No specific action items available in the response.</p>
                        <p className="text-gray-600 mt-2">
                          Please review the general recommendations from the compliance analysis.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Final Report */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Report Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {getNestedValue(results, 'data.final_report.title') || 
                         getNestedValue(results, 'message') || 
                         'Compliance Assessment Report'}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Status: {getNestedValue(results, 'status', 'Completed')}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Total Action Items</div>
                        <div className="mt-1 text-2xl font-bold text-blue-900">
                          {getNestedValue(results, 'data.final_report.action_items_count') || 
                           (getNestedValue(results, 'data.action_plan.action_items') || []).length || 
                           (getNestedValue(results, 'results.implementation_plan.action_items') || []).length || 
                           (getNestedValue(results, 'steps_completed') || []).length || 
                           'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">High Priority Actions</div>
                        <div className="mt-1 text-2xl font-bold text-blue-900">
                          {getNestedValue(results, 'data.final_report.high_priority_actions') || 
                           ((getNestedValue(results, 'data.action_plan.action_items') || [])
                             .filter((item: any) => item.priority === 'high')).length || 
                           'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Display the raw JSON response for debugging if needed */}
                    <div className="mt-6 border-t pt-4">
                      <details>
                        <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                          View Raw Response Data
                        </summary>
                        <pre className="mt-2 p-4 bg-gray-50 rounded overflow-auto text-xs">
                          {JSON.stringify(results, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyEditor; 