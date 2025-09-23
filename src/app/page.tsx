'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Tool, ShapeType, BrushStyle } from '@/types/whiteboard';
import Topbar from '../components/Topbar';
import PropertiesPanel from '../components/PropertiesPanel';
import BottomBar from '../components/BottomBar';

const Whiteboard = dynamic(() => import('../components/Whiteboard'), { ssr: false });
const Toolbar = dynamic(() => import('../components/Toolbar'), { ssr: false });

export default function Home() {
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [clear, setClear] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [room, setRoom] = useState('room1');
  const [roomInput, setRoomInput] = useState('room1');
  const [shape, setShape] = useState<ShapeType>('rectangle');
  const [brushStyle, setBrushStyle] = useState<BrushStyle>('brush');

  const handleClear = () => {
    setClear(true);
  };

  const handleZoomIn = () => {
    setZoom(prevZoom => prevZoom * 1.2);
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => prevZoom / 1.2);
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleJoinRoom = () => {
    setRoom(roomInput);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Topbar
        roomInput={roomInput}
        setRoomInput={setRoomInput}
        onJoinRoom={handleJoinRoom}
        onClear={handleClear}
        onExport={() => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'whiteboard.png';
            a.click();
          }
        }}
      />
      <Whiteboard
        room={room}
        tool={tool}
        color={color}
        strokeWidth={strokeWidth}
        clear={clear}
        setClear={setClear}
        zoom={zoom}
        setZoom={setZoom}
        shape={shape}
        brushStyle={brushStyle}
      />
      <Toolbar tool={tool} setTool={setTool} shape={shape} setShape={setShape} />
      <PropertiesPanel
        color={color}
        strokeWidth={strokeWidth}
        setColor={setColor}
        setStrokeWidth={setStrokeWidth}
        brushStyle={brushStyle}
        setBrushStyle={setBrushStyle}
        tool={tool}
      />
      <BottomBar zoom={zoom} zoomIn={handleZoomIn} zoomOut={handleZoomOut} resetZoom={handleResetZoom} />
    </main>
  );
}
