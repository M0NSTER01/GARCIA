import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export function ImageUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onUpload(file);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="image-upload"
        accept="image/*"
        onChange={handleChange}
      />
      
      {preview ? (
        <div className="relative max-w-md mx-auto">
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg shadow-lg max-h-96 mx-auto"
          />
          <label
            htmlFor="image-upload"
            className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
          >
            <ImageIcon className="h-6 w-6 text-purple-600" />
          </label>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center space-y-4 cursor-pointer"
        >
          <Upload className="h-12 w-12 text-purple-600" />
          <div className="text-lg font-medium text-gray-700">
            Drop your photo here or click to upload
          </div>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG - Max file size 10MB
          </p>
        </label>
      )}
    </div>
  );
}