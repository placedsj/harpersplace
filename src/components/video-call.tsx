
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Phone,
  Camera,
  Mic,
  MicOff,
  VideoOff
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
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop media tracks when component unmounts
    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);

  // Simulate call timer
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
  
  const toggleMute = () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
          setIsMuted(prev => !prev);
      }
  };
  const toggleCamera = () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
          setIsCameraOff(prev => !prev);
      }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    onCallEnd();
  };


  return (
    <div className="h-full flex flex-col bg-black">
        <div className="flex-1 relative">
            {/* Remote Video */}
             <div ref={remoteVideoRef} className="w-full h-full object-cover bg-gray-900 flex items-center justify-center">
                 <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">E</div>
             </div>

             {/* Local Video */}
            <div className="absolute bottom-4 right-4 w-1/4 max-w-xs h-auto aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {isCameraOff && <div className="absolute inset-0 bg-black flex items-center justify-center text-white"><VideoOff className="w-8 h-8 opacity-50"/></div>}
            </div>

            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="ml-2">{formatTime(callDuration)}</span>
            </div>
        </div>
        <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
            <Button variant={isMuted ? 'destructive' : 'secondary'} size="icon" onClick={toggleMute} className="rounded-full h-12 w-12">
                {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button variant={isCameraOff ? 'destructive' : 'secondary'} size="icon" onClick={toggleCamera} className="rounded-full h-12 w-12">
                 {isCameraOff ? <VideoOff /> : <Camera />}
            </Button>
            <Button variant="destructive" size="icon" onClick={handleEndCall} className="rounded-full h-16 w-16">
                <Phone className="transform -rotate-135" />
            </Button>
        </div>

        {!hasCameraPermission && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                    Please allow camera access in your browser settings to use this feature. This dialog will close, and you can try starting the call again.
                    </AlertDescription>
                    <div className="mt-4">
                        <Button variant="secondary" onClick={handleEndCall}>Okay</Button>
                    </div>
                </Alert>
            </div>
        )}
    </div>
  );
}
