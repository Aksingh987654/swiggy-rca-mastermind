
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              Welcome to Swiggy RCA Learning Program
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Master Root Cause Analysis through interactive scenarios designed for Area Managers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
              <Target className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-800">5 Real Scenarios</h3>
              <p className="text-sm text-gray-600 text-center">Practice with actual delivery operations challenges</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
              <Trophy className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Score & Compete</h3>
              <p className="text-sm text-gray-600 text-center">Earn points and climb the leaderboard</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Live Competition</h3>
              <p className="text-sm text-gray-600 text-center">Compete with up to 20 players simultaneously</p>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/employee-form')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            I'm Ready for This Excitement! 🚀
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;
