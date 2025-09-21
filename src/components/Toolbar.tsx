'use client';

import React, { useState } from 'react';
import type { Tool, ShapeType } from '@/types/whiteboard';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
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

const Toolbar: React.FC<ToolbarProps> = ({ tool, setTool, shape, setShape }) => {
  const [showShapes, setShowShapes] = useState(false);

  const handleToolClick = (selectedTool: Tool) => {
    setTool(selectedTool);
    if (selectedTool === 'shape') {
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

  // no brush UI here; brush selection lives in PropertiesPanel

  return (
    <>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 backdrop-blur shadow-xl rounded-xl p-2 flex flex-col items-center space-y-2 z-20">
        <div className="relative group">
          <button
            aria-label="Pen (P)"
            title="Pen (P)"
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
            aria-label="Bruh (B)"
            title="Bruh (B)"
            className={`p-2 rounded-md ${tool === 'bruh' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('bruh')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l6-6m0 0l4 4 8-8-4-4-8 8z" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Bruh
          </div>
        </div>
        <div className="relative group">
          <button
            aria-label="Eraser (E)"
            title="Eraser (E)"
            className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('eraser')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3l5 5-9 9H7l-5-5 9-9m5 5L7 21m-4 0h10" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Eraser
          </div>
        </div>
        <div className="relative group">
          <button
            aria-label="Shapes (S)"
            title="Shapes (S)"
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
            aria-label="Select (V)"
            title="Select (V)"
            className={`p-2 rounded-md ${tool === 'select' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('select')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h2a2 2 0 012 2v2M6 20h2a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Select
          </div>
        </div>
        <div className="relative group">
          <button
            aria-label="Text (T)"
            title="Text (T)"
            className={`p-2 rounded-md ${tool === 'text' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            onClick={() => handleToolClick('text')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 6v12m8-12v12M6 18h12" />
            </svg>
          </button>
          <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
            Text
          </div>
        </div>
      </div>
      {showShapes && <div className="absolute top-1/2 left-20 -translate-y-1/2"> <ShapeSelectionBar setShape={setShape} setTool={setTool} setShowShapes={setShowShapes} /> </div>}
    </>
  );
};

export default Toolbar;
