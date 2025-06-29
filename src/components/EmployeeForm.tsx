
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGame } from '../context/GameContext';
import { useDatabase } from '../hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { saveEmployee, createGameSession, loading } = useDatabase();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    city: '',
    zone: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.code || !formData.email || !formData.city || !formData.zone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save employee to database
      const savedEmployee = await saveEmployee(formData);
      
      // Create game session
      const gameSession = await createGameSession(savedEmployee.id, state.gameId);
      
      // Update context
      dispatch({ 
        type: 'SET_EMPLOYEE', 
        payload: { 
          employee: savedEmployee, 
          employeeId: savedEmployee.id 
        } 
      });
      dispatch({ type: 'SET_GAME_SESSION', payload: gameSession.id });
      
      setIsSubmitted(true);
      
      setTimeout(() => {
        toast({
          title: "Details Submitted Successfully! ✅",
          description: "Redirecting to your first scenario...",
        });
        setTimeout(() => navigate('/scenario/1'), 1000);
      }, 2000);

    } catch (error) {
      toast({
        title: "Error Saving Data",
        description: "Please try again. If the problem persists, contact support.",
        variant: "destructive"
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Details Submitted Successfully!</h2>
            <p className="text-gray-600">Preparing your RCA scenarios...</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Employee Details</CardTitle>
          <p className="text-orange-100">Please provide your information to continue</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-semibold">Employee Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="code" className="text-gray-700 font-semibold">Employee Code *</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter your employee code"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-700 font-semibold">Official Email ID *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="your.email@swiggy.in"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="city" className="text-gray-700 font-semibold">City Name *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter your city"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="zone" className="text-gray-700 font-semibold">Zone/Area of Responsibility *</Label>
              <Input
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter your zone/area"
                required
              />
            </div>
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving Details...
                </>
              ) : (
                'Submit Details & Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeForm;
