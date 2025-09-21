"use client";

import React from 'react';

export default function BottomBar({
  zoom,
  zoomIn,
  zoomOut,
  resetZoom,
}: {
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}) {
  const pct = Math.round(zoom * 100);
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur shadow-xl rounded-xl px-3 py-2 flex items-center space-x-2 z-10">
      <button className="p-2 rounded-md hover:bg-gray-200" onClick={zoomOut} aria-label="Zoom out" title="Zoom out">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
        </svg>
      </button>
      <span className="text-sm text-gray-700 w-12 text-center">{pct}%</span>
      <button className="p-2 rounded-md hover:bg-gray-200" onClick={zoomIn} aria-label="Zoom in" title="Zoom in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" />
        </svg>
      </button>
      <button className="p-2 rounded-md hover:bg-gray-200" onClick={resetZoom} aria-label="Reset zoom" title="Reset zoom">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
        </svg>
      </button>
    </div>
  );
}

