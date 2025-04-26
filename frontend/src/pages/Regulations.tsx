
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type Regulation = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  country: string;
  status: "active" | "pending" | "proposed";
  description: string;
  keyRequirements: string[];
  effectiveDate: string;
};

const regulationsData: Regulation[] = [
  {
    id: "gdpr",
    name: "General Data Protection Regulation",
    shortName: "GDPR",
    region: "Europe",
    country: "European Union",
    status: "active",
    description: "The GDPR is a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area.",
    keyRequirements: [
      "Lawful basis for processing",
      "Data subject rights",
      "Data protection by design",
      "72-hour breach notification",
      "Data Protection Impact Assessment",
      "Data Protection Officer appointment"
    ],
    effectiveDate: "May 25, 2018"
  },
  {
    id: "ccpa",
    name: "California Consumer Privacy Act",
    shortName: "CCPA",
    region: "North America",
    country: "United States (California)",
    status: "active",
    description: "The CCPA enhances privacy rights and consumer protection for residents of California.",
    keyRequirements: [
      "Right to know",
      "Right to delete",
      "Right to opt-out of sale",
      "Right to non-discrimination",
      "Privacy policy requirements",
      "Data inventory obligations"
    ],
    effectiveDate: "January 1, 2020"
  },
  {
    id: "cpra",
    name: "California Privacy Rights Act",
    shortName: "CPRA",
    region: "North America",
    country: "United States (California)",
    status: "active",
    description: "The CPRA amends and expands the CCPA, adding new privacy protections and creating a dedicated enforcement agency.",
    keyRequirements: [
      "Right to correct",
      "Right to limit use of sensitive data",
      "Data minimization",
      "Purpose limitation",
      "Storage limitation",
      "Annual cybersecurity audit"
    ],
    effectiveDate: "January 1, 2023"
  },
  {
    id: "lgpd",
    name: "Lei Geral de Proteção de Dados",
    shortName: "LGPD",
    region: "South America",
    country: "Brazil",
    status: "active",
    description: "The LGPD establishes rules on collecting, handling, storing and sharing of personal data in Brazil.",
    keyRequirements: [
      "Legal bases for processing",
      "Data subject rights",
      "Data Protection Officer requirement",
      "Data breach notification",
      "Data impact assessment",
      "Data processing records"
    ],
    effectiveDate: "August 1, 2021"
  },
  {
    id: "pipeda",
    name: "Personal Information Protection and Electronic Documents Act",
    shortName: "PIPEDA",
    region: "North America",
    country: "Canada",
    status: "active",
    description: "PIPEDA is Canada's federal private-sector privacy law that sets out the ground rules for how businesses must handle personal information.",
    keyRequirements: [
      "Accountability",
      "Identifying purposes",
      "Consent",
      "Limiting collection",
      "Limiting use, disclosure, and retention",
      "Accuracy"
    ],
    effectiveDate: "January 1, 2004"
  },
  {
    id: "cdpa",
    name: "Consumer Data Protection Act",
    shortName: "CDPA",
    region: "North America",
    country: "United States (Virginia)",
    status: "pending",
    description: "The Virginia CDPA establishes a framework for controlling and processing personal data in the State.",
    keyRequirements: [
      "Right to access",
      "Right to correction",
      "Right to deletion",
      "Right to data portability",
      "Right to opt out of targeted advertising",
      "Data protection assessments"
    ],
    effectiveDate: "January 1, 2023"
  },
];

const Regulations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  
  const filteredRegulations = regulationsData.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          reg.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || reg.region.toLowerCase() === selectedRegion.toLowerCase();
    return matchesSearch && matchesRegion;
  });

  const regions = ["all", ...new Set(regulationsData.map(reg => reg.region.toLowerCase()))];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Privacy Regulations Library</h1>
        <p className="text-muted-foreground">
          Explore privacy regulations from around the world and understand their key requirements.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search regulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {regions.map(region => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(region)}
              className="capitalize"
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRegulations.map((regulation) => (
          <Card key={regulation.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{regulation.shortName}</CardTitle>
                  <CardDescription className="mt-1">{regulation.name}</CardDescription>
                </div>
                <Badge variant={
                  regulation.status === "active" ? "outline" :
                  regulation.status === "pending" ? "secondary" : "destructive"
                }>
                  {regulation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="flex-1">
                  <div className="space-y-3">
                    <p className="text-sm">{regulation.description}</p>
                    <div>
                      <p className="text-sm"><strong>Region:</strong> {regulation.region}</p>
                      <p className="text-sm"><strong>Country:</strong> {regulation.country}</p>
                      <p className="text-sm"><strong>Effective Date:</strong> {regulation.effectiveDate}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="requirements" className="flex-1">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {regulation.keyRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
              <div className="mt-auto pt-4">
                <Button variant="outline" className="w-full">View Detailed Guide</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRegulations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No regulations found matching your search.</p>
          <Button 
            variant="link" 
            onClick={() => {setSearchTerm(""); setSelectedRegion("all");}}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Regulations;
