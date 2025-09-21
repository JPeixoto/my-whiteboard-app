'use client';

import React, { useState } from 'react';
import type { Tool, ShapeType } from '@/types/whiteboard';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  clear: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  shape: ShapeType;
  setShape: (shape: ShapeType) => void;
}

const ShapeSelectionBar = ({ setShape, setTool, setShowShapes }: { setShape: (shape: ShapeType) => void, setTool: (tool: Tool) => void, setShowShapes: (show: boolean) => void }) => {
  const handleShapeClick = (selectedShape: ShapeType) => {
    setShape(selectedShape);
    setTool('shape');
    setShowShapes(false);
  };

  const shapeIcons = {
    rectangle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />,
    circle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 110 20 10 10 0 010-20z" />,
    triangle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 22h20L12 2z" />,
  };

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-gray-100 shadow-xl rounded-lg p-2 flex items-center space-x-2">
      <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => handleShapeClick('rectangle')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {shapeIcons.rectangle}
        </svg>
      </button>
      <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => handleShapeClick('circle')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {shapeIcons.circle}
        </svg>
      </button>
      <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => handleShapeClick('triangle')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {shapeIcons.triangle}
        </svg>
      </button>
    </div>
  );
};

const Toolbar: React.FC<ToolbarProps> = ({ tool, setTool, setColor, setStrokeWidth, clear, zoomIn, zoomOut, resetZoom, shape, setShape }) => {
  const [showShapes, setShowShapes] = useState(false);

  const handleToolClick = (selectedTool: Tool) => {
    setTool(selectedTool);
    if (selectedTool === 'pen') {
      setColor('#000000');
      setShowShapes(false);
    } else if (selectedTool === 'eraser') {
      setColor('#ffffff');
      setShowShapes(false);
    } else if (selectedTool === 'shape') {
      setShowShapes(!showShapes);
    } else {
      setShowShapes(false);
    }
  };

  const shapeIcons = {
    rectangle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />,
    circle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 110 20 10 10 0 010-20z" />,
    triangle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 22h20L12 2z" />,
  };

  return (
    <>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-100 shadow-xl rounded-lg p-2 flex items-center space-x-2 z-10">
        <div className="relative group">
          <button
            className={`p-2 rounded-md ${tool === 'pen' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('pen')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Pen
          </div>
        </div>
        <div className="relative group">
          <button
            className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('eraser')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Eraser
          </div>
        </div>
        <div className="relative group">
          <button
            className={`p-2 rounded-md ${tool === 'shape' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('shape')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {shapeIcons[shape]}
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Shape
          </div>
        </div>
        <div className="relative group">
          <button
            className={`p-2 rounded-md ${tool === 'select' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('select')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Select
          </div>
        </div>
        <div className="relative group">
          <button
            className={`p-2 rounded-md ${tool === 'text' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('text')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Text
          </div>
        </div>
        <div className="relative group">
          <input type="color" className="w-8 h-8" onChange={(e) => setColor(e.target.value)} />
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Color Picker
          </div>
        </div>
        <div className="relative group">
          <input type="range" min="1" max="20" defaultValue="5" onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))} />
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Stroke Width
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 rounded-md hover:bg-gray-200" onClick={clear}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Clear
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 rounded-md hover:bg-gray-200" onClick={zoomIn}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Zoom In
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 rounded-md hover:bg-gray-200" onClick={zoomOut}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Zoom Out
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 rounded-md hover:bg-gray-200" onClick={resetZoom}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Reset Zoom
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 rounded-md hover:bg-gray-200" onClick={() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
              const dataURL = canvas.toDataURL('image/png');
              const a = document.createElement('a');
              a.href = dataURL;
              a.download = 'whiteboard.png';
              a.click();
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Export as PNG
          </div>
        </div>
      </div>
      {showShapes && <ShapeSelectionBar setShape={setShape} setTool={setTool} setShowShapes={setShowShapes} />}
    </>
  );
};

export default Toolbar;

