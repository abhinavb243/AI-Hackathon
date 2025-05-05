import axios from 'axios';
import React from 'react';

interface RegulationData {
  source?: string;
  title?: string;
  summary?: string;
  content?: string;
  previous_version?: string | null;
  changes?: Array<{
    section: string;
    old_text: string;
    new_text: string;
  }>;
  jurisdiction?: string;
}

interface Finding {
  id?: string;
  title: string;
  description: string;
  regulation_section?: string;
  remediation?: string;
  confidence?: number;
  data_catalog_id?: string;
}

interface ComplianceFindingsProps {
  findings: Finding[];
}

/**
 * Test the compliance detection system with mock regulation data
 * @param {RegulationData} mockRegulation - The mock regulation data
 * @param {boolean} useMockCompanyData - Whether to use mock company data (default true)
 * @returns {Promise<any>} - Results of the compliance detection
 */
export const testComplianceDetection = async (mockRegulation: RegulationData, useMockCompanyData = true): Promise<any> => {
  try {
    // First, ensure the regulation is in the correct format
    if (!mockRegulation.source || !mockRegulation.title || !mockRegulation.changes) {
      throw new Error('Invalid regulation format. Must include source, title, and changes.');
    }

    // Call the run-pipeline endpoint with the correct request format
    const response = await axios.post('http://localhost:8000/run-pipeline', {
      regulation: {
        data: mockRegulation, // Put the regulation data inside the regulation object
      },
      source: mockRegulation.source,
      priority: "medium" // Default priority
    });

    return response.data;
  } catch (error) {
    console.error('Error testing compliance pipeline:', error);
    throw error;
  }
};

/**
 * Format a regulation object according to the expected API format
 * @param {RegulationData} data - Raw regulation data
 * @returns {RegulationData} - Properly formatted regulation data
 */
export const formatRegulationData = (data: RegulationData): RegulationData => {
  // Create a properly formatted regulation object
  return {
    source: data.source || 'GDPR',
    title: data.title || 'Untitled Regulation',
    summary: data.summary || 'No summary provided',
    content: data.content || 'No content provided',
    previous_version: data.previous_version || null,
    changes: Array.isArray(data.changes) ? data.changes : [],
    jurisdiction: data.jurisdiction || 'EU-GDPR'
  };
};

/**
 * Create a component to display compliance findings
 * @param {ComplianceFindingsProps} props - Component props with findings array
 * @returns {JSX.Element} - React component showing findings
 */
export const ComplianceFindings: React.FC<ComplianceFindingsProps> = ({ findings }) => {
  if (!findings || findings.length === 0) {
    return <div className="p-4 bg-gray-100 rounded">No compliance issues found.</div>;
  }

  return (
    <div className="space-y-3">
      {findings.map((finding, index) => (
        <div key={finding.id || index} className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="font-medium">{finding.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
          {finding.regulation_section && (
            <div className="mt-2 text-xs">
              <span className="font-semibold">Regulation: </span>
              {finding.regulation_section}
            </div>
          )}
          {finding.remediation && (
            <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
              <span className="font-semibold">Recommended action: </span>
              {finding.remediation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default testComplianceDetection; 