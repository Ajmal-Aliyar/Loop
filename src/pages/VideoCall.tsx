import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Maximize2 } from 'lucide-react';

const VideoCall = () => {
  const navigate = useNavigate();
  const { selectedChannel, endCall } = useChatStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      {/* Remote Video (Main) */}
      <div className="relative flex-1">
        {isVideoOn ? (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center">
              <Avatar className="mx-auto h-32 w-32 border-4 border-white/20">
                <AvatarFallback className="bg-avatar-green text-5xl">
                  {selectedChannel?.avatar || 'U'}
                </AvatarFallback>
              </Avatar>
              <p className="mt-4 text-xl font-semibold text-white">
                {selectedChannel?.name || 'Unknown'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-900">
            <div className="text-center">
              <VideoOff className="mx-auto h-16 w-16 text-white/50" />
              <p className="mt-4 text-white/70">Camera is off</p>
            </div>
          </div>
        )}

        {/* Call Duration Overlay */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 backdrop-blur-sm">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="font-mono text-sm font-medium text-white">{formatDuration(callDuration)}</span>
        </div>

        {/* Expand Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute bottom-24 right-4 h-40 w-32 overflow-hidden rounded-lg border-2 border-white/20 bg-gradient-to-br from-primary/40 to-secondary/40 shadow-lg">
        <div className="flex h-full items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-avatar-blue text-2xl">
              You
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Call Controls */}
      <div className="relative z-10 bg-gradient-to-t from-black/90 to-transparent pb-8 pt-12">
        <div className="flex items-center justify-center gap-4 px-4">
          <Button
            variant={isMuted ? 'destructive' : 'secondary'}
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="h-16 w-16 rounded-full shadow-lg"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          <Button
            variant={isVideoOn ? 'secondary' : 'destructive'}
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-white/70">
          {isMuted && '🔇 Muted'} {!isVideoOn && '📹 Camera off'}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
