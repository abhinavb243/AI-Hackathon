import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { testComplianceDetection, formatRegulationData, ComplianceFindings } from '@/utils/testComplianceDetection';
import { Loader2 } from 'lucide-react';

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
      
      // Test the compliance detection
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Compliance Findings
                      {results.results?.impact_assessment?.impact_assessment?.findings && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({results.results.impact_assessment.impact_assessment.findings.length} issues found)
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.results?.impact_assessment?.impact_assessment?.findings ? (
                      <ComplianceFindings 
                        findings={results.results.impact_assessment.impact_assessment.findings} 
                      />
                    ) : (
                      <div className="p-4 bg-gray-100 rounded">
                        No findings available
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.results?.implementation_plan ? (
                      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded text-sm">
                        {JSON.stringify(results.results.implementation_plan, null, 2)}
                      </pre>
                    ) : (
                      <div className="p-4 bg-gray-100 rounded">
                        No implementation plan available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.results?.impact_assessment?.impact_assessment?.severity && (
                        <div>
                          <div className="text-sm font-medium">Severity</div>
                          <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${
                            results.results.impact_assessment.impact_assessment.severity === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : results.results.impact_assessment.impact_assessment.severity === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {results.results.impact_assessment.impact_assessment.severity}
                          </div>
                        </div>
                      )}
                      
                      {results.results?.impact_assessment?.impact_assessment?.impact_areas && (
                        <div>
                          <div className="text-sm font-medium">Impact Areas</div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {results.results.impact_assessment.impact_assessment.impact_areas.map((area: string, index: number) => (
                              <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {results.results?.impact_assessment?.impact_assessment?.estimated_cost && (
                        <div>
                          <div className="text-sm font-medium">Estimated Financial Impact</div>
                          <div className="mt-1 text-xl font-bold">
                            ${results.results.impact_assessment.impact_assessment.estimated_cost.toLocaleString()}
                          </div>
                        </div>
                      )}
                      
                      {results.results?.impact_assessment?.impact_assessment?.exposures && (
                        <div>
                          <div className="text-sm font-medium">Exposures</div>
                          <div className="mt-1 space-y-2">
                            {results.results.impact_assessment.impact_assessment.exposures.map((exposure: any, index: number) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                <div className="font-medium">${exposure.financial_impact.toLocaleString()}</div>
                                <div className="text-xs text-gray-600">{exposure.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyEditor; 