import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResult } from './components/AnalysisResult';
import type { AnalysisResult as AnalysisResultType } from './types';

// Simulated AI analysis result
const mockAnalysis: AnalysisResultType = {
  bodyType: {
    type: 'hourglass',
    description: 'Your body measurements are well-proportioned with a defined waist. Your shoulders and hips are about the same width.',
    recommendations: {
      tops: [
        'Fitted V-neck tops',
        'Wrap blouses',
        'Belt-cinched tops'
      ],
      bottoms: [
        'High-waisted pants',
        'Pencil skirts',
        'A-line skirts'
      ],
      dresses: [
        'Wrap dresses',
        'Bodycon dresses',
        'Belt-defined waist dresses'
      ],
      accessories: [
        'Statement belts',
        'Medium-length necklaces',
        'Classic handbags'
      ]
    }
  },
  confidence: 0.92
};

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | undefined>();

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Style
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your photo and let our AI analyze your body type to provide personalized
            fashion recommendations tailored just for you.
          </p>
        </div>

        <div className="space-y-12">
          <ImageUpload onUpload={handleUpload} />
          <AnalysisResult isLoading={isAnalyzing} result={result} />
        </div>

        {!isAnalyzing && !result && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Upload Your Photo',
                  description: 'Take or upload a full-body photo in fitted clothing.'
                },
                {
                  title: 'AI Analysis',
                  description: 'Our advanced AI analyzes your body proportions and shape.'
                },
                {
                  title: 'Get Recommendations',
                  description: 'Receive personalized style tips and outfit suggestions.'
                }
              ].map((step, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;