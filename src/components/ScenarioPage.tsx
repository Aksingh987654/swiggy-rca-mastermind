
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useGame } from '../context/GameContext';
import { useToast } from '@/hooks/use-toast';
import { Timer, CheckCircle, X } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    title: "Graceful Degradation Spike Analysis",
    description: "Your zone experienced a sudden 40% spike in Graceful Degradation (GFD) rate during peak dinner hours (7-9 PM). Customer complaints increased, and several restaurants went offline. The spike affected 3 major micro-markets in your area.",
    affectedMetric: "Graceful Degradation Rate",
    correctAnswer: "High order volume during peak hours caused system overload, leading to automatic restaurant disconnections to maintain platform stability. Root cause likely involves insufficient capacity planning for peak demand.",
    maxScore: 100
  },
  {
    id: 2,
    title: "Delivery Partner Shortage Crisis",
    description: "During a heavy rain evening, 60% of your delivery partners went offline simultaneously. Orders are piling up, restaurants are getting frustrated, and customer wait times have increased to 90+ minutes. Your zone's fulfillment rate dropped to 45%.",
    affectedMetric: "Delivery Partner Availability",
    correctAnswer: "Weather-induced partner unavailability combined with lack of incentive structure for adverse conditions. Need surge pricing and weather-specific partner retention strategies.",
    maxScore: 100
  },
  {
    id: 3,
    title: "Restaurant Onboarding Bottleneck",
    description: "New restaurant onboarding in your zone has slowed down by 70% this month. The sales team reports that restaurants are backing out during the documentation phase. Your growth targets are at risk.",
    affectedMetric: "Restaurant Onboarding Rate",
    correctAnswer: "Complex documentation process and unclear commission structure causing restaurant dropouts. Need simplified onboarding flow and better partner communication.",
    maxScore: 100
  },
  {
    id: 4,
    title: "Customer Retention Drop",
    description: "Your zone shows a 25% decline in repeat customer orders over the past 3 weeks. New customer acquisition is normal, but existing customers are not returning. Customer feedback mentions long delivery times and cold food.",
    affectedMetric: "Customer Retention Rate",
    correctAnswer: "Deteriorating delivery experience due to longer delivery times and food quality issues. Root cause in delivery partner efficiency and restaurant preparation time management.",
    maxScore: 100
  },
  {
    id: 5,
    title: "Payment Failure Surge",
    description: "Payment failures in your zone increased by 80% yesterday, specifically during lunch hours (12-2 PM). Customers are abandoning carts, and successful order conversion has dropped significantly. The issue seems concentrated in specific pin codes.",
    affectedMetric: "Payment Success Rate",
    correctAnswer: "Payment gateway issues or network connectivity problems in specific geographic areas. Requires coordination with payment team and local network providers.",
    maxScore: 100
  }
];

const diagnosticTools = [
  "SQL Dashboards",
  "RCA Sheets", 
  "Rider App Feedback",
  "Zone Calls/Logs"
];

const ScenarioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { toast } = useToast();
  
  const scenarioId = parseInt(id || '1');
  const scenario = scenarios.find(s => s.id === scenarioId);
  
  const [hypothesis, setHypothesis] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [startTime] = useState(Date.now());
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const words = hypothesis.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [hypothesis]);

  const handleAutoSubmit = () => {
    if (hypothesis.trim().length > 0) {
      handleSubmit();
    } else {
      toast({
        title: "Time's Up! ⏰",
        description: "Scenario automatically submitted with no answer.",
        variant: "destructive"
      });
      navigateNext();
    }
  };

  const handleToolSelection = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else if (selectedTools.length < 2) {
      setSelectedTools([...selectedTools, tool]);
    } else {
      toast({
        title: "Tool Limit Reached",
        description: "You can select maximum 2 diagnostic tools",
        variant: "destructive"
      });
    }
  };

  const calculateScore = () => {
    if (!scenario) return 0;
    
    let score = 0;
    const timeSpent = (Date.now() - startTime) / 1000;
    
    // Word count scoring (minimum 2 words)
    if (wordCount >= 2) score += 30;
    else score += Math.floor((wordCount / 2) * 30);
    
    // Accuracy scoring (simple keyword matching)
    const keywords = scenario.correctAnswer.toLowerCase().split(' ');
    const userWords = hypothesis.toLowerCase().split(' ');
    const matchedKeywords = keywords.filter(keyword => 
      userWords.some(userWord => userWord.includes(keyword) || keyword.includes(userWord))
    );
    
    score += Math.min(2, (matchedKeywords.length / keywords.length) * 2);
    
    // Time bonus (faster completion gets bonus)
    if (timeSpent < 600) score += 20; // Under 10 minutes
    else if (timeSpent < 1200) score += 10; // Under 20 minutes
    
    return Math.min(100, Math.floor(score));
  };

  const handleSubmit = () => {
    if (wordCount < 2) {
      toast({
        title: "Insufficient Analysis",
        description: `Please write at least 2 words. Current: ${wordCount} words`,
        variant: "destructive"
      });
      return;
    }

    const score = calculateScore();
    const timeSpent = (Date.now() - startTime) / 1000;
    
    dispatch({
      type: 'ADD_RESPONSE',
      payload: {
        scenarioId,
        hypothesis,
        toolsUsed: selectedTools,
        timeSpent,
        score
      }
    });

    // Show score feedback
    if (score >= 80) {
      toast({
        title: "Excellent Analysis! 🎉",
        description: `Score: ${score}/100 - Outstanding RCA skills!`,
      });
    } else if (score >= 60) {
      toast({
        title: "Good Analysis! 👍",
        description: `Score: ${score}/100 - Well done!`,
      });
    } else {
      toast({
        title: "Keep Learning! 🧠",
        description: `Score: ${score}/100 - Room for improvement`,
      });
    }

    setTimeout(() => navigateNext(), 2000);
  };

  const navigateNext = () => {
    if (scenarioId < 5) {
      navigate(`/scenario/${scenarioId + 1}`);
    } else {
      dispatch({ type: 'CALCULATE_TOTAL_SCORE' });
      navigate('/results');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!scenario) {
    return <div>Scenario not found</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Timer and Progress */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Scenario {scenarioId} of 5</h1>
            <Progress value={(scenarioId / 5) * 100} className="w-64 mt-2" />
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
            <Timer className="w-5 h-5" />
            <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Scenario Card */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">{scenario.title}</CardTitle>
            <p className="text-orange-100">Affected Metric: {scenario.affectedMetric}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-800 leading-relaxed">{scenario.description}</p>
            </div>

            {/* Diagnostic Tools */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Diagnostic Tools (Max 2)</h3>
              <div className="grid grid-cols-2 gap-3">
                {diagnosticTools.map((tool) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <Checkbox
                      id={tool}
                      checked={selectedTools.includes(tool)}
                      onCheckedChange={() => handleToolSelection(tool)}
                      disabled={!selectedTools.includes(tool) && selectedTools.length >= 2}
                    />
                    <label htmlFor={tool} className="text-sm font-medium text-gray-700">
                      {tool}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* RCA Hypothesis Input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Your RCA Hypothesis</h3>
                <span className={`text-sm font-medium ${wordCount >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {wordCount}/50 words minimum
                </span>
              </div>
              <Textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="Analyze the scenario and provide your root cause hypothesis. Include the likely cause, contributing factors, and suggested corrective actions..."
                className="min-h-32 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${wordCount >= 50 ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{width: `${Math.min(100, (wordCount / 50) * 100)}%`}}
                ></div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={wordCount < 50}
              className={`w-full py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 ${
                wordCount >= 50 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {wordCount >= 50 ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Analysis
                </>
              ) : (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Need {50 - wordCount} more words
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioPage;
