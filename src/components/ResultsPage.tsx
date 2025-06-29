
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '../context/GameContext';
import { Trophy, Download, Timer, Target, TrendingUp, Medal } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  score: number;
  city: string;
  timeSpent: number;
}

const ResultsPage = () => {
  const { state } = useGame();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Simulate leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      { name: "Raj Kumar", score: 485, city: "Mumbai", timeSpent: 1200 },
      { name: "Priya Sharma", score: 470, city: "Delhi", timeSpent: 1350 },
      { name: "Amit Singh", score: 465, city: "Bangalore", timeSpent: 1100 },
      { name: "Neha Gupta", score: 450, city: "Hyderabad", timeSpent: 1400 },
      { name: "Rohit Mehta", score: 445, city: "Chennai", timeSpent: 1250 },
    ];

    // Add current user to leaderboard
    if (state.employee) {
      const currentUser: LeaderboardEntry = {
        name: state.employee.name,
        score: state.totalScore,
        city: state.employee.city,
        timeSpent: state.responses.reduce((total, response) => total + response.timeSpent, 0)
      };
      
      const updatedLeaderboard = [...mockLeaderboard, currentUser]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
      
      setLeaderboard(updatedLeaderboard);
    }
  }, [state]);

  const totalTimeSpent = state.responses.reduce((total, response) => total + response.timeSpent, 0);
  const averageScore = state.totalScore / 5;
  const userRank = leaderboard.findIndex(entry => entry.name === state.employee?.name) + 1;

  const getPerformanceLevel = (score: number) => {
    if (score >= 400) return { level: "Expert", color: "text-green-600", icon: "🏆" };
    if (score >= 300) return { level: "Advanced", color: "text-blue-600", icon: "🥈" };
    if (score >= 200) return { level: "Intermediate", color: "text-orange-600", icon: "🥉" };
    return { level: "Beginner", color: "text-gray-600", icon: "📚" };
  };

  const performance = getPerformanceLevel(state.totalScore);

  const downloadReport = () => {
    const reportContent = `
SWIGGY RCA Learning Program - Performance Report
================================================

Employee Details:
- Name: ${state.employee?.name}
- Code: ${state.employee?.code}
- Email: ${state.employee?.email}
- City: ${state.employee?.city}
- Zone: ${state.employee?.zone}

Performance Summary:
- Total Score: ${state.totalScore}/500
- Average Score: ${averageScore.toFixed(1)}/100
- Performance Level: ${performance.level}
- Leaderboard Rank: #${userRank}
- Total Time Spent: ${Math.floor(totalTimeSpent / 60)} minutes

Scenario Breakdown:
${state.responses.map((response, index) => `
Scenario ${response.scenarioId}:
- Score: ${response.score}/100
- Time Spent: ${Math.floor(response.timeSpent / 60)} minutes
- Tools Used: ${response.toolsUsed.join(', ')}
- Hypothesis: ${response.hypothesis.substring(0, 100)}...
`).join('')}

Recommendations:
${averageScore >= 80 ? 
  "- Excellent RCA skills! Consider mentoring other team members." :
  averageScore >= 60 ?
  "- Good analytical abilities. Focus on speed and tool utilization." :
  "- Consider additional training on root cause analysis methodologies."
}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RCA_Report_${state.employee?.code}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!state.employee) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">No results to display. Please complete the scenarios first.</p>
    </div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎉 Congratulations! 🎉</h1>
          <p className="text-xl text-gray-600">You've completed the RCA Learning Program</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <Trophy className="w-8 h-8 mr-3" />
                  Your Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{state.totalScore}</div>
                    <div className="text-sm text-gray-600">Total Score</div>
                    <div className="text-xs text-gray-500">out of 500</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">#{userRank}</div>
                    <div className="text-sm text-gray-600">Rank</div>
                    <div className="text-xs text-gray-500">on leaderboard</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{Math.floor(totalTimeSpent / 60)}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                    <div className="text-xs text-gray-500">total time</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${performance.color}`}>{performance.icon}</div>
                    <div className="text-sm text-gray-600">{performance.level}</div>
                    <div className="text-xs text-gray-500">level</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">Scenario Breakdown:</h3>
                  {state.responses.map((response) => (
                    <div key={response.scenarioId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Scenario {response.scenarioId}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{Math.floor(response.timeSpent / 60)}m</span>
                        <span className={`font-bold ${response.score >= 80 ? 'text-green-600' : response.score >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                          {response.score}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={downloadReport}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 font-semibold rounded-lg shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center">
                  <Medal className="w-6 h-6 mr-2" />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.name}-${index}`}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        entry.name === state.employee?.name
                          ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-orange-400 text-orange-900' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{entry.name}</div>
                          <div className="text-xs text-gray-500">{entry.city}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{entry.score}</div>
                        <div className="text-xs text-gray-500">{Math.floor(entry.timeSpent / 60)}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4 pt-6">
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 font-semibold rounded-lg shadow-lg"
          >
            Play Again
          </Button>
          <Button
            onClick={() => window.location.href = '/admin'}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 font-semibold rounded-lg shadow-lg"
          >
            Admin Panel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
