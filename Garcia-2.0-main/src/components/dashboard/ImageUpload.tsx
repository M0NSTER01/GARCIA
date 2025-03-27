import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { UploadCloud, X, Image as ImageIcon, Loader2, Bug } from 'lucide-react';
import { useStyle } from '@/contexts/StyleContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getRecommendationByImage, isLoading } = useStyle();
  const { user } = useAuth();
  const [showKeyAlert, setShowKeyAlert] = useState(false);

  useEffect(() => {
    // Check if API key is set to the default value
    const checkApiKeyConfig = async () => {
      try {
        // We can't access the API_KEY constant directly, so we'll test if it works
        const result = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY_HERE'
        );
        
        // If this exact error occurs, we know they're still using the placeholder key
        const data = await result.json();
        if (data?.error?.message?.includes('API key not valid')) {
          setShowKeyAlert(true);
        }
      } catch (error) {
        console.error('Error checking API key:', error);
      }
    };
    
    checkApiKeyConfig();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check file type
    if (!file.type.match('image/(jpeg|jpg|png)')) {
      toast.error('Please select a JPEG or PNG image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('Image loaded, size:', result ? result.length : 'unknown', 'type:', file.type);
      
      // Ensure it's a data URL
      if (result && result.startsWith('data:image/')) {
        setSelectedImage(result);
      } else {
        toast.error('The file could not be processed as an image');
        console.error('Invalid image data format:', result ? result.substring(0, 50) + '...' : 'No data');
      }
    };
    
    // Read as data URL which gives us the base64 format
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGetRecommendation = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    console.log('Sending image to API, data length:', selectedImage.length);
    toast.loading('Preparing image for analysis...');

    try {
      // Make sure we pass the image in correct format
      await getRecommendationByImage(selectedImage);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      toast.error('Failed to analyze image. Please try again.');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {showKeyAlert && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">API Key Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>You need to set up your Google Gemini API key to use image analysis.</p>
                  <div className="mt-2">
                    <h4 className="font-medium">Common Issues:</h4>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                      <li>API key is missing or invalid</li>
                      <li>API key has restrictions (needs to be unrestricted)</li>
                      <li>Gemini API is not enabled for your project</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="link"
                      size="sm" 
                      asChild
                      className="p-0 text-blue-600 underline h-auto text-xs mr-4"
                    >
                      <Link to="/test-gemini">Get setup instructions</Link>
                    </Button>
                    <Button
                      variant="link"
                      size="sm" 
                      asChild
                      className="p-0 text-blue-600 underline h-auto text-xs"
                    >
                      <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer">Create API Key</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedImage ? (
          <div className="relative">
            <img 
              src={selectedImage} 
              alt="Uploaded" 
              className="w-full h-auto max-h-[400px] object-contain rounded-md animate-fade-in"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearImage}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="mt-4">
              <Button 
                onClick={handleGetRecommendation} 
                className="w-full bg-garcia-600 hover:bg-garcia-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Analyzing Image...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
              
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <Link to="/test-gemini">
                    <Bug className="h-3 w-3 mr-1" />
                    Test API Connection
                  </Link>
                </Button>
              </div>
              
              {/* Diagnostic link - only visible in development mode */}
              {import.meta.env.DEV && (
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Link to="/test-gemini">
                      <Bug className="h-3 w-3 mr-1" />
                      Diagnose API
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging 
                ? "border-garcia-500 bg-garcia-50" 
                : "border-gray-300 hover:border-garcia-400"
            )}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-garcia-50 rounded-full">
                <UploadCloud className="h-10 w-10 text-garcia-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Upload an Image</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Upload a full-body photo for accurate body type analysis and personalized recommendations
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or JPEG (max. 5MB)
                </p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
