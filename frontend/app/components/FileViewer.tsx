// frontend/app/components/FileViewer.tsx
'use client';

import { X } from 'lucide-react';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileType: string;
}

export default function FileViewer({ isOpen, onClose, fileUrl, fileType = '' }: FileViewerProps) {
  if (!isOpen) return null;

  const renderFile = () => {
    if (fileType.includes('image')) {
      return <img src={fileUrl} alt="Viewed file" className="max-w-full max-h-full object-contain" />;
    } else if (fileType.includes('pdf')) {
      return <iframe src={fileUrl} className="w-full h-full" title="PDF Viewer"></iframe>;
    } else {
      return (
        <div className="p-4 text-center text-slate-400">
          <p>Preview not available for this file type.</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">File Viewer</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* File Content */}
        <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
          {renderFile()}
        </div>
      </div>
    </div>
  );
}
