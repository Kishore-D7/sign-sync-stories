
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/translate" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-signlang-purple/10 to-signlang-blue/10">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Sign Sync</h1>
          <p className="text-signlang-dark-gray">Audio and Text to Sign Language Translator</p>
        </div>
        
        <Card className="w-full shadow-lg border-signlang-light-purple/20 card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access the translation tool
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-signlang-dark-gray/60" />
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
              
              <p className="text-sm mt-4 text-center text-signlang-dark-gray">
                Demo credentials: demo@example.com / password
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-signlang-dark-gray">
            Don't have an account?{' '}
            <a href="#" className="text-signlang-blue font-medium hover:underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
