import React from 'react';
import { Camera } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StyleAI
            </span>
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-purple-600">How it Works</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Style Guide</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">About</a>
          </nav>
        </div>
      </div>
    </header>
  );
}