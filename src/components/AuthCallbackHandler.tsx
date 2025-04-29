
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const AuthCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // If there's a hash in the URL, it means we have an access token
        if (window.location.hash) {
          // Remove the '#' character
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          
          if (hashParams.has('access_token') && hashParams.has('refresh_token')) {
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            // Set the session in Supabase
            const { error } = await supabase.auth.setSession({
              access_token: accessToken!,
              refresh_token: refreshToken!
            });

            if (error) {
              console.error("Auth callback error:", error);
              toast.error("Authentication failed. Please try again.");
              navigate('/login');
              return;
            }
            
            // Successfully authenticated
            toast.success("Successfully authenticated!");
            navigate('/translate');
            return;
          }
        }
        
        // Check if we're already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/translate');
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        toast.error("Authentication error. Please try again.");
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-signlang-light-purple/5">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Processing Authentication</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign-in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackHandler;
