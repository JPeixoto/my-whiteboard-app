"use client";

import React, { useState } from 'react';
import AuthButton from './AuthButton';

const ShareModal = ({ url, close }: { url: string; close: () => void }) => {
  const shareText = "Check out this whiteboard";
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-lg p-4 flex flex-col items-center space-y-4 z-30">
      <h2 className="text-lg font-bold">Share</h2>
      <div className="flex space-x-3 text-sm">
        <a className="px-2 py-1 rounded bg-blue-600 text-white" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer">Twitter</a>
        <a className="px-2 py-1 rounded bg-blue-700 text-white" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">Facebook</a>
        <a className="px-2 py-1 rounded bg-green-600 text-white" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + url)}`} target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="px-2 py-1 rounded bg-blue-800 text-white" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <button className="p-2 rounded-md bg-gray-200 hover:bg-gray-300" onClick={close}>Close</button>
    </div>
  );
};

export default function Topbar({
  roomInput,
  setRoomInput,
  onJoinRoom,
  onClear,
  onExport,
}: {
  roomInput: string;
  setRoomInput: (v: string) => void;
  onJoinRoom: () => void;
  onClear: () => void;
  onExport: () => void;
}) {
  const [showShare, setShowShare] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-900/80 to-gray-800/70 text-white backdrop-blur border-b border-white/10 z-30">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wide">Whiteboard</span>
          <div className="flex items-center space-x-2">
            <input
              aria-label="Room name"
              placeholder="room name"
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="rounded-md px-2 py-1 text-sm bg-white/10 border border-white/20 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button onClick={onJoinRoom} className="rounded-md px-3 py-1 text-sm bg-white/10 border border-white/20 hover:bg-white/20">Join</button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onClear} className="px-3 py-1 rounded-md bg-white/10 border border-white/20 hover:bg-white/20 text-sm" aria-label="Clear Board" title="Clear Board">Clear</button>
          <button onClick={onExport} className="px-3 py-1 rounded-md bg-white/10 border border-white/20 hover:bg-white/20 text-sm" aria-label="Export PNG" title="Export PNG">Export</button>
          <button onClick={() => setShowShare(true)} className="px-3 py-1 rounded-md bg-white/10 border border-white/20 hover:bg-white/20 text-sm" aria-label="Share" title="Share">Share</button>
          <AuthButton />
        </div>
      </div>
      {showShare && <ShareModal url={shareUrl} close={() => setShowShare(false)} />}
    </>
  );
}
