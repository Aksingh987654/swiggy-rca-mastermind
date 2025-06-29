
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Download, 
  Settings, 
  BarChart3, 
  RefreshCw, 
  Clock, 
  Shield,
  UserCheck,
  FileText,
  TrendingUp
} from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { toast } = useToast();

  const mockData = {
    totalUsers: 47,
    activeGames: 3,
    completedGames: 44,
    averageScore: 342,
    topPerformers: [
      { name: "Raj Kumar", score: 485, city: "Mumbai", completedAt: "2024-01-15 14:30" },
      { name: "Priya Sharma", score: 470, city: "Delhi", completedAt: "2024-01-15 15:45" },
      { name: "Amit Singh", score: 465, city: "Bangalore", completedAt: "2024-01-15 16:20" },
    ],
    recentActivities: [
      { user: "Neha Gupta", action: "Completed Scenario 5", time: "5 mins ago" },
      { user: "Rohit Mehta", action: "Started new game", time: "12 mins ago" },
      { user: "Kavya Patel", action: "Submitted employee details", time: "18 mins ago" },
    ]
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'swiggy2024') {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Panel",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  const downloadCSV = () => {
    const csvContent = `Name,Code,Email,City,Zone,Total Score,Completion Time,Scenario 1,Scenario 2,Scenario 3,Scenario 4,Scenario 5
Raj Kumar,EMP001,raj.kumar@swiggy.in,Mumbai,Zone A,485,20:30,95,98,92,100,100
Priya Sharma,EMP002,priya.sharma@swiggy.in,Delhi,Zone B,470,22:45,90,85,95,100,100
Amit Singh,EMP003,amit.singh@swiggy.in,Bangalore,Zone C,465,18:20,88,92,95,90,100`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RCA_Results_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Downloaded",
      description: "All user data has been exported successfully",
    });
  };

  const resetLeaderboard = () => {
    toast({
      title: "Leaderboard Reset",
      description: "All scores have been cleared",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center justify-center">
              <Shield className="w-8 h-8 mr-3" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 font-semibold rounded-lg shadow-lg"
              >
                Login to Admin Panel
              </Button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              Demo credentials: admin / swiggy2024
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">RCA Learning Admin Panel</h1>
            <p className="text-gray-600">Manage scenarios, users, and track performance</p>
          </div>
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-gray-300"
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{mockData.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Games</p>
                  <p className="text-3xl font-bold text-green-600">{mockData.activeGames}</p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-purple-600">{mockData.completedGames}</p>
                </div>
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-3xl font-bold text-orange-600">{mockData.averageScore}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockData.topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <p className="text-sm text-gray-600">{performer.city}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          {performer.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockData.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">City</th>
                        <th className="text-left p-2">Score</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockData.topPerformers.map((user, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{user.name}</td>
                          <td className="p-2">{user.city}</td>
                          <td className="p-2">
                            <Badge variant="outline">{user.score}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </td>
                          <td className="p-2 text-sm text-gray-600">{user.completedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Scenario Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Scenario 1: Graceful Degradation</h3>
                    <p className="text-sm text-gray-600 mb-2">Completion Rate: 92%</p>
                    <p className="text-sm text-gray-600">Average Score: 78/100</p>
                    <Button size="sm" className="mt-2">Edit Scenario</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Scenario 2: Partner Shortage</h3>
                    <p className="text-sm text-gray-600 mb-2">Completion Rate: 88%</p>
                    <p className="text-sm text-gray-600">Average Score: 72/100</p>
                    <Button size="sm" className="mt-2">Edit Scenario</Button>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Add New Scenario
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  Game Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                    <Input type="number" defaultValue="30" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Concurrent Users</label>
                    <Input type="number" defaultValue="20" className="w-full" />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button onClick={resetLeaderboard} variant="destructive">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Leaderboard
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
