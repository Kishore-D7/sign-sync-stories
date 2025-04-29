
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  requireAuth = false,
  title = "Sign Sync"
}) => {
  const { isAuthenticated, logout, user } = useAuth();

  // Redirect if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-signlang-purple/5 to-signlang-blue/5">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold gradient-text">{title}</h1>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center mr-2">
                <User className="h-4 w-4 text-signlang-dark-gray mr-1" />
                <span className="text-sm text-signlang-dark-gray">{user?.name || 'User'}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-signlang-dark-gray hover:text-signlang-purple"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm py-4 border-t">
        <div className="container mx-auto px-4">
          <p className="text-sm text-center text-signlang-dark-gray">
            Sign Sync - Audio and Text to Sign Language Translator &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
