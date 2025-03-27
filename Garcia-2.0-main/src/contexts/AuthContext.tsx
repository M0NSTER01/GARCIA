import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { sendVerificationEmail, sendPasswordResetEmail, verifyOTP as verifyEmailOTP } from '@/utils/auth';

type User = {
  id: string;
  username: string;
  email: string;
  age: number;
  gender: string;
  hasCompletedQuiz: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  resendOTP: (email: string, isReset: boolean) => Promise<void>;
};

type SignupData = {
  username: string;
  password: string;
  email: string;
  age: number;
  gender: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user info on mount
    const storedUser = localStorage.getItem('garcia_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('garcia_user');
      }
    }
    setIsLoading(false);
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // User is signed in
        console.log('Auth state changed:', event, session);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user for demonstration
      if (username === 'demo' && password === 'password') {
        const mockUser = {
          id: '1',
          username: 'demo',
          email: 'demo@example.com',
          age: 25,
          gender: 'female',
          hasCompletedQuiz: false
        };
        
        setUser(mockUser);
        localStorage.setItem('garcia_user', JSON.stringify(mockUser));
        toast.success('Welcome back!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user account immediately without verification
      const mockUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        age: userData.age,
        gender: userData.gender,
        hasCompletedQuiz: false
      };
      
      setUser(mockUser);
      localStorage.setItem('garcia_user', JSON.stringify(mockUser));
      
      toast.success('Account created successfully!');
      return;
      
    } catch (error) {
      toast.error('Signup failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string, isReset: boolean) => {
    setIsLoading(true);
    try {
      let result;
      
      // Determine which type of email to send
      if (isReset) {
        result = await sendPasswordResetEmail(email);
      } else {
        result = await sendVerificationEmail(email);
      }
      
      if (result.success) {
        toast.success(`Verification code sent to ${email}`);
        return;
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      toast.error('Failed to resend OTP: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call the verifyOTP function from utils/auth
      const verification = await verifyEmailOTP(email, otp);
      
      if (verification.success) {
        // Retrieve pending user data if this is for signup
        const pendingUserData = localStorage.getItem('garcia_pending_user');
        
        if (pendingUserData) {
          // This is a signup verification
          const userData = JSON.parse(pendingUserData);
          
          // Create user account after successful verification
          const mockUser = {
            id: Date.now().toString(),
            username: userData.username || email.split('@')[0],
            email,
            age: userData.age || 25,
            gender: userData.gender || 'unspecified',
            hasCompletedQuiz: false
          };
          
          setUser(mockUser);
          localStorage.setItem('garcia_user', JSON.stringify(mockUser));
          localStorage.removeItem('garcia_pending_email');
          localStorage.removeItem('garcia_pending_user');
          
          toast.success('Account created successfully!');
        } else {
          // This is just an OTP verification (for password reset)
          toast.success('Verification successful!');
        }
        
        return true;
      } else {
        toast.error('Invalid verification code');
        return false;
      }
    } catch (error) {
      toast.error('Verification failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await sendPasswordResetEmail(email);
      
      if (result.success) {
        toast.success('Password reset email sent. Please check your inbox.');
        
        // Store email for OTP verification
        localStorage.setItem('garcia_reset_email', email);
      } else {
        throw new Error('Failed to send password reset email');
      }
    } catch (error) {
      toast.error('Request failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Verify the OTP first
      const verification = await verifyEmailOTP(email, otp);
      
      if (verification.success) {
        // In a real app, we would update the password on the server
        toast.success('Password has been reset successfully');
        localStorage.removeItem('garcia_reset_email');
        return true;
      } else {
        toast.error('Invalid verification code');
        return false;
      }
    } catch (error) {
      toast.error('Reset failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('garcia_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login,
        signup,
        logout,
        verifyOTP,
        forgotPassword,
        resetPassword,
        resendOTP
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
