import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';

interface ScannerProps {
  onScan: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, label = "Scan Device ID", placeholder = "Click to focus & scan..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount for handheld scanners
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onScan(inputValue.trim());
      setInputValue('');
    }
  };

  // Camera handling
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isCameraOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Camera error:", err));
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const simulateCameraScan = () => {
    // In a real app, we would use a library like jsQR or zxing here
    // For this demo, we simulate finding a code after a brief delay
    const mockIds = ["DEV-002", "DEV-005", "DEV-008", "DEV-NEW-99"];
    const randomId = mockIds[Math.floor(Math.random() * mockIds.length)];
    onScan(randomId);
    setIsCameraOpen(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <button 
          onClick={() => setIsCameraOpen(!isCameraOpen)}
          type="button"
          className="text-sm text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
        >
          {isCameraOpen ? "Close Camera" : "Use Camera"}
        </button>
      </div>

      {isCameraOpen ? (
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-lg">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-32 border-2 border-cyan-400 rounded-lg animate-pulse bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center text-white/80">
              <span className="text-xs uppercase tracking-widest mb-2 font-medium">Align Barcode</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
             {/* Simulation button because we don't have a real barcode lib loaded */}
             <Button onClick={simulateCameraScan} variant="primary" type="button" className="bg-cyan-600 hover:bg-cyan-700 border-none">
                [DEMO] Simulate Scan
             </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors shadow-sm outline-none"
              placeholder={placeholder}
            />
          </div>
          <Button type="submit" disabled={!inputValue} className="h-full">
            Enter
          </Button>
        </form>
      )}
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <span className="inline-block w-4 h-4 bg-gray-100 border rounded text-center leading-none font-mono">↵</span>
        Press Enter or use a handheld scanner
      </p>
    </div>
  );
};