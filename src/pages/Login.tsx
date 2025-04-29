
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Mail, UserPlus } from 'lucide-react';

const Login = () => {
  const { login, signup, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/translate" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    const success = await signup(newEmail, newPassword, name);
    setIsSubmitting(false);
    
    if (success) {
      setActiveTab('signin');
      setEmail(newEmail);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center page-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Sign Sync</h1>
          <p className="text-signlang-dark-gray">Audio and Text to Sign Language Translator</p>
        </div>
        
        <Card className="w-full shadow-lg border-signlang-light-purple/20 card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Access the sign language translation tool
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin" className="text-sm flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm flex items-center gap-1">
                <UserPlus className="h-3.5 w-3.5" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-signlang-dark-gray/60" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-signlang-dark-gray/60" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="text-sm text-right">
                    <a href="#" className="text-signlang-blue hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full gradient-bg" 
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-signlang-dark-gray/60" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-signlang-dark-gray/60" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-signlang-dark-gray/60" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-signlang-dark-gray/60" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full gradient-bg" 
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-signlang-dark-gray">
            {activeTab === 'signin' ? 'Demo credentials: demo@example.com / password' : 'Already have an account?'}{' '}
            {activeTab === 'signup' && (
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveTab('signin'); }}
                className="text-signlang-blue font-medium hover:underline"
              >
                Sign in instead
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
