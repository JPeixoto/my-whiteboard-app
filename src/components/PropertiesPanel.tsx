"use client";

import React, { useState } from 'react';
import type { BrushStyle } from '@/types/whiteboard';

const brushLabels: { key: BrushStyle; label: string }[] = [
  { key: 'brush', label: 'Brush' },
  { key: 'calligraphy-brush', label: 'Calligraphy brush' },
  { key: 'calligraphy-pen', label: 'Calligraphy pen' },
  { key: 'airbrush', label: 'Airbrush' },
  { key: 'oil-brush', label: 'Oil brush' },
  { key: 'crayon', label: 'Crayon' },
  { key: 'marker', label: 'Marker' },
  { key: 'natural-pencil', label: 'Natural pencil' },
  { key: 'watercolor-brush', label: 'Watercolor brush' },
];

export default function PropertiesPanel({
  color,
  strokeWidth,
  setColor,
  setStrokeWidth,
  brushStyle,
  setBrushStyle,
}: {
  color: string;
  strokeWidth: number;
  setColor: (c: string) => void;
  setStrokeWidth: (w: number) => void;
  brushStyle: BrushStyle;
  setBrushStyle: (b: BrushStyle) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/85 backdrop-blur shadow-xl rounded-xl p-3 flex flex-col space-y-4 z-10 w-64">
      <div>
        <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Appearance</div>
        <label className="block text-xs text-gray-600 mb-1">Color & Brush</label>
        <div className="relative flex items-center gap-2">
          <input
            aria-label="Stroke color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-0 border rounded"
          />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex-1 flex items-center justify-between px-2 py-2 text-sm border rounded hover:bg-gray-50"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="text-gray-800">{brushLabels.find(b => b.key===brushStyle)?.label || 'Brush'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>
          {open && (
            <div className="absolute z-20 top-full right-0 mt-1 w-56 bg-white/95 backdrop-blur shadow-xl rounded-md p-1 border">
              {brushLabels.map((b) => (
                <button
                  key={b.key}
                  onClick={() => { setBrushStyle(b.key); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 text-left ${brushStyle===b.key ? 'bg-gray-100' : ''}`}
                >
                  <span className="text-sm text-gray-800">{b.label}</span>
                  <span className="w-20 h-4 rounded bg-gray-300"></span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Stroke Width: {strokeWidth}px</label>
        <input
          aria-label="Stroke width"
          type="range"
          min={1}
          max={20}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
          className="w-full"
        />
      </div>
      
    </div>
  );
}
