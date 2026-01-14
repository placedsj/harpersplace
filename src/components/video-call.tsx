
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
  Disc,
  CircleDot,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DialogTitle as VisuallyHiddenTitle } from '@/components/ui/dialog';
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();

  const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        setHasPermission(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
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
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    peerConnectionRef.current = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };
    
    // Simulate remote peer connecting and sending their stream
    setTimeout(() => {
       if (remoteVideoRef.current && localStreamRef.current) {
           remoteVideoRef.current.srcObject = localStreamRef.current;
       }
    }, 2000);
  };

  useEffect(() => {
    startCall();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if(peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if(isScreenSharing) return;
      toggleStreamTrack(localStreamRef.current, 'video', isCameraOff);
      setIsCameraOff(prev => !prev);
  };
  
  const handleEndCall = () => {
    if (isRecording) {
        stopRecording();
    }
    setIsCallActive(false);
    onCallEnd();
  };

  const toggleScreenSharing = async () => {
      if (!peerConnectionRef.current) return;
      const pc = peerConnectionRef.current;

      if (isScreenSharing) {
          if (screenStreamRef.current) {
              screenStreamRef.current.getTracks().forEach(track => track.stop());
          }
          if (localStreamRef.current) {
              const videoTrack = localStreamRef.current.getVideoTracks()[0];
              const sender = pc.getSenders().find(s => s.track?.kind === 'video');
              if (sender && videoTrack) {
                  sender.replaceTrack(videoTrack);
              }
              toggleStreamTrack(localStreamRef.current, 'video', !isCameraOff);
          }
          setIsScreenSharing(false);
      } else {
          try {
              const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
              screenStreamRef.current = stream;
              const screenTrack = stream.getVideoTracks()[0];
              const audioTrack = stream.getAudioTracks()[0];
              
              const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
              if (videoSender && screenTrack) {
                  videoSender.replaceTrack(screenTrack);
              }

              // Also replace audio track if available, to capture system audio
              const audioSender = pc.getSenders().find(s => s.track?.kind === 'audio');
              if(audioSender && audioTrack) {
                  audioSender.replaceTrack(audioTrack);
              }

              screenTrack.onended = () => {
                  if (isScreenSharing) toggleScreenSharing();
              };
              setIsScreenSharing(true);
          } catch(err) {
              console.error("Screen sharing error:", err);
              toast({variant: 'destructive', title: 'Could not start screen sharing.'});
          }
      }
  };

  const startRecording = () => {
      if (!localStreamRef.current && !screenStreamRef.current) {
          toast({ variant: 'destructive', title: 'No stream to record.' });
          return;
      }
      
      const streamToRecord = screenStreamRef.current || remoteVideoRef.current?.srcObject as MediaStream || localStreamRef.current;
      if (!streamToRecord) return;

      mediaRecorderRef.current = new MediaRecorder(streamToRecord, { mimeType: 'video/webm' });
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
          }
      };

      mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'call-recording.webm';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast({
              title: 'Recording Ready',
              description: 'Your call recording has been downloaded.',
          });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({ title: 'Recording Started', description: 'This call is now being recorded.' });
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          toast({
              title: 'Recording Stopped',
              description: 'Preparing your recording for download...',
          });
      }
      setIsRecording(false);
  };


  return (
    <div className="h-full w-full flex flex-col bg-black">
      <VisuallyHiddenTitle className="sr-only">Video Call</VisuallyHiddenTitle>
        <div className="flex-1 relative">
             <div className="w-full h-full object-cover bg-gray-900 flex items-center justify-center">
                 <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
                 <div className="absolute w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">E</div>
             </div>

            <div className="absolute bottom-4 right-4 w-1/4 max-w-xs h-auto aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-2xl">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {(isCameraOff || isScreenSharing) && <div className="absolute inset-0 bg-black flex items-center justify-center text-white">
                    {isScreenSharing ? <ScreenShare className="w-8 h-8 opacity-50"/> : <VideoOff className="w-8 h-8 opacity-50"/>}
                </div>}
            </div>

            <div className="absolute top-4 left-4 text-white text-sm flex items-center gap-4">
                <div className="bg-black/50 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span>{formatTime(callDuration)}</span>
                </div>
                {isRecording && (
                    <div className="bg-black/50 px-3 py-1 rounded-full flex items-center gap-2 text-red-400 font-semibold">
                       <CircleDot className="h-4 w-4 animate-pulse" />
                       <span>REC</span>
                    </div>
                )}
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
            
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant={isRecording ? 'destructive' : 'outline'} size="icon" className="rounded-full h-12 w-12 bg-transparent border-gray-600 hover:bg-gray-700 text-white" onClick={isRecording ? stopRecording : undefined}>
                        <Disc />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Call Recording Consent</AlertDialogTitle>
                    <AlertDialogDescription>
                        This call will be recorded for documentation purposes. The recording will be securely stored and may be used in legal proceedings. All parties must consent to continue.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={startRecording}>Agree & Start Recording</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
