'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type VideoCallContextType = {
  isVideoOpen: boolean;
  setIsVideoOpen: (isOpen: boolean) => void;
};

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export function VideoCallProvider({ children }: { children: ReactNode }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <VideoCallContext.Provider value={{ isVideoOpen, setIsVideoOpen }}>
      {children}
    </VideoCallContext.Provider>
  );
}

export function useVideoCall() {
  const context = useContext(VideoCallContext);
  if (context === undefined) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
}
