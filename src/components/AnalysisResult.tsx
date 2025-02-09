import React from 'react';
import { Check, Loader } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface Props {
  isLoading: boolean;
  result?: AnalysisResult;
}

export function AnalysisResult({ isLoading, result }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4 p-8">
        <Loader className="h-8 w-8 text-purple-600 animate-spin" />
        <p className="text-lg font-medium text-gray-700">Analyzing your photo...</p>
        <p className="text-sm text-gray-500">This might take a few seconds</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Check className="h-6 w-6 text-green-500" />
        <h3 className="text-xl font-semibold text-gray-900">Analysis Complete</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Your Body Type</h4>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-purple-900 font-medium capitalize">{result.bodyType.type}</p>
            <p className="text-purple-700 mt-1">{result.bodyType.description}</p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Style Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.bodyType.recommendations).map(([category, items]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 capitalize mb-2">{category}</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}