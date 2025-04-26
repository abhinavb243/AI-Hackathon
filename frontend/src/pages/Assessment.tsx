
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Question = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    riskLevel: "low" | "medium" | "high";
  }[];
};

const assessmentQuestions: Question[] = [
  {
    id: "q1",
    text: "How does your organization collect personal data?",
    options: [
      { id: "q1a1", text: "Direct from individuals with explicit consent", riskLevel: "low" },
      { id: "q1a2", text: "Direct and from third parties with consent", riskLevel: "medium" },
      { id: "q1a3", text: "Various sources including third parties without always obtaining explicit consent", riskLevel: "high" },
    ],
  },
  {
    id: "q2",
    text: "How long do you retain personal data?",
    options: [
      { id: "q2a1", text: "Only for as long as necessary with defined retention periods", riskLevel: "low" },
      { id: "q2a2", text: "Varied retention periods based on data type, not always clearly defined", riskLevel: "medium" },
      { id: "q2a3", text: "No defined retention policy or indefinite retention", riskLevel: "high" },
    ],
  },
  {
    id: "q3",
    text: "How do you handle data subject access requests?",
    options: [
      { id: "q3a1", text: "Formal process with dedicated team and tracking system", riskLevel: "low" },
      { id: "q3a2", text: "Basic process but not fully documented or optimized", riskLevel: "medium" },
      { id: "q3a3", text: "No formal process or handled on ad-hoc basis", riskLevel: "high" },
    ],
  },
];

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setProgress(((currentQuestion + 2) / assessmentQuestions.length) * 100);
    } else {
      setAssessmentComplete(true);
      setProgress(100);
      toast.success("Assessment completed successfully!");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setProgress(((currentQuestion) / assessmentQuestions.length) * 100);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setProgress(0);
    setAssessmentComplete(false);
  };

  const getRiskLevelCount = () => {
    const riskCounts = { low: 0, medium: 0, high: 0 };
    
    Object.keys(answers).forEach(questionId => {
      const question = assessmentQuestions.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.id === answers[questionId]);
        if (selectedOption) {
          riskCounts[selectedOption.riskLevel]++;
        }
      }
    });
    
    return riskCounts;
  };

  const currentQ = assessmentQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Privacy Compliance Assessment</h1>
        <p className="text-muted-foreground">
          Answer the questions below to evaluate your organization's privacy compliance posture.
        </p>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Getting Started</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {!assessmentComplete ? (
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1} of {assessmentQuestions.length}</CardTitle>
            <CardDescription>{currentQ.text}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQ.id]} 
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              <div className="space-y-4">
                {currentQ.options.map((option) => (
                  <div key={option.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="font-normal">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>Assessment Complete</CardTitle>
            <CardDescription>
              Here's a summary of your privacy compliance assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Risk Level Summary</h3>
                {(() => {
                  const risks = getRiskLevelCount();
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>High Risk Areas:</span>
                        <span className="font-medium text-privacy-danger">{risks.high}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium Risk Areas:</span>
                        <span className="font-medium text-privacy-warning">{risks.medium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Low Risk Areas:</span>
                        <span className="font-medium text-privacy-success">{risks.low}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Next Steps</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your assessment, we recommend focusing on the following areas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  {getRiskLevelCount().high > 0 && (
                    <li>Address high-risk areas immediately to prevent potential compliance issues.</li>
                  )}
                  {getRiskLevelCount().medium > 0 && (
                    <li>Review and improve medium-risk areas as part of your quarterly compliance program.</li>
                  )}
                  <li>Schedule a comprehensive compliance review with your privacy team or consultant.</li>
                  <li>Consider implementing regular privacy impact assessments for new initiatives.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={assessmentComplete ? handleReset : handlePrevious}
          disabled={!assessmentComplete && currentQuestion === 0}
        >
          {assessmentComplete ? "Start New Assessment" : "Previous"}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!answers[currentQ?.id] && !assessmentComplete}
        >
          {currentQuestion < assessmentQuestions.length - 1 ? "Next Question" : "Complete Assessment"}
        </Button>
      </div>
    </div>
  );
};

export default Assessment;
