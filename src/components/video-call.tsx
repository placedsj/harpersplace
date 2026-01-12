
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Phone,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface VideoCallProps {
    onCallEnd: () => void;
}

export function VideoCall({ onCallEnd }: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        setHasPermission(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // In a real app, you would now set up the peer connection
        // For demo, we'll just show the local video
        setupPeerConnection(stream);

      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Access Denied',
          description: 'Please enable camera and microphone permissions in your browser.',
        });
      }
  }

  const setupPeerConnection = (stream: MediaStream) => {
    // This is a mock setup. A real implementation would use a signaling server (e.g., WebSockets)
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    peerConnectionRef.current = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };
    
    // Mocking the remote connection for demonstration
    // In a real app, this would be handled via signaling server
    setTimeout(() => {
       if (remoteVideoRef.current) {
           // Show a placeholder for the remote user
       }
    }, 2000);
  };

  useEffect(() => {
    startCall();

    return () => {
      // Cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if(peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleStreamTrack = (stream: MediaStream | null, kind: 'audio' | 'video', enabled: boolean) => {
      if (stream) {
          stream.getTracks().filter(t => t.kind === kind).forEach(t => t.enabled = enabled);
      }
  }
  
  const toggleMute = () => {
      toggleStreamTrack(localStreamRef.current, 'audio', isMuted);
      setIsMuted(prev => !prev);
  };

  const toggleCamera = () => {
      if(isScreenSharing) return; // Don't toggle camera while screen sharing
      toggleStreamTrack(localStreamRef.current, 'video', isCameraOff);
      setIsCameraOff(prev => !prev);
  };
  
  const handleEndCall = () => {
    setIsCallActive(false);
    onCallEnd();
  };

  const toggleScreenSharing = async () => {
      if (!peerConnectionRef.current) return;
      const pc = peerConnectionRef.current;

      if (isScreenSharing) {
          // Stop screen share and revert to camera
          if (screenStreamRef.current) {
              screenStreamRef.current.getTracks().forEach(track => track.stop());
          }
          if (localStreamRef.current) {
              const videoTrack = localStreamRef.current.getVideoTracks()[0];
              const sender = pc.getSenders().find(s => s.track?.kind === 'video');
              if (sender) {
                  sender.replaceTrack(videoTrack);
              }
              toggleStreamTrack(localStreamRef.current, 'video', !isCameraOff);
          }
          setIsScreenSharing(false);
      } else {
          // Start screen share
          try {
              const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
              screenStreamRef.current = stream;
              const screenTrack = stream.getVideoTracks()[0];
              
              const sender = pc.getSenders().find(s => s.track?.kind === 'video');
              if (sender) {
                  sender.replaceTrack(screenTrack);
              }

              // When screen sharing ends (e.g. user clicks "Stop sharing" in browser UI)
              screenTrack.onended = () => {
                  toggleScreenSharing();
              };

              setIsScreenSharing(true);
          } catch(err) {
              console.error("Screen sharing error:", err);
              toast({variant: 'destructive', title: 'Could not start screen sharing.'});
          }
      }
  };


  return (
    <div className="h-full w-full flex flex-col bg-black">
        <div className="flex-1 relative">
            {/* Remote Video */}
             <div className="w-full h-full object-cover bg-gray-900 flex items-center justify-center">
                 <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
                 {/* Placeholder for remote user */}
                 <div className="absolute w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">E</div>
             </div>

             {/* Local Video */}
            <div className="absolute bottom-4 right-4 w-1/4 max-w-xs h-auto aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-2xl">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {(isCameraOff || isScreenSharing) && <div className="absolute inset-0 bg-black flex items-center justify-center text-white">
                    {isScreenSharing ? <ScreenShare className="w-8 h-8 opacity-50"/> : <VideoOff className="w-8 h-8 opacity-50"/>}
                </div>}
            </div>

            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span>{formatTime(callDuration)}</span>
            </div>
        </div>
        <div className="bg-gray-900/80 p-4 flex items-center justify-center gap-4">
            <Button variant={isMuted ? 'secondary' : 'outline'} size="icon" onClick={toggleMute} className="rounded-full h-12 w-12 bg-transparent border-gray-600 hover:bg-gray-700 text-white">
                {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button variant={isCameraOff ? 'secondary' : 'outline'} size="icon" onClick={toggleCamera} className="rounded-full h-12 w-12 bg-transparent border-gray-600 hover:bg-gray-700 text-white" disabled={isScreenSharing}>
                 {isCameraOff ? <VideoOff /> : <Video />}
            </Button>
            <Button variant={isScreenSharing ? 'secondary' : 'outline'} size="icon" onClick={toggleScreenSharing} className="rounded-full h-12 w-12 bg-transparent border-gray-600 hover:bg-gray-700 text-white">
                 {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
            </Button>
            <Button variant="destructive" size="icon" onClick={handleEndCall} className="rounded-full h-14 w-14">
                <Phone className="transform -rotate-135" />
            </Button>
        </div>

        {!hasPermission && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Camera and Mic Access Required</AlertTitle>
                    <AlertDescription>
                    Please allow media permissions in your browser settings to use video calling. This feature requires access to continue.
                    </AlertDescription>
                    <div className="mt-4">
                        <Button variant="secondary" onClick={handleEndCall}>Okay, End Call</Button>
                    </div>
                </Alert>
            </div>
        )}
    </div>
  );
}

    