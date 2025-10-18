import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';

const VoiceCall = () => {
  const navigate = useNavigate();
  const { selectedChannel, endCall } = useChatStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Call Info */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarFallback className="bg-avatar-green text-4xl">
              {selectedChannel?.avatar || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-semibold">{selectedChannel?.name || 'Unknown'}</h1>
            <p className="text-lg text-muted-foreground">Voice Call</p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Phone className="h-4 w-4 animate-pulse text-primary" />
            <span className="font-mono text-sm font-medium">{formatDuration(callDuration)}</span>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? 'destructive' : 'secondary'}
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="h-20 w-20 rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>

          <Button
            variant={isSpeakerOn ? 'secondary' : 'outline'}
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2 rounded-lg bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isMuted ? '🔇 Microphone is muted' : '🎤 Microphone is active'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isSpeakerOn ? '🔊 Speaker is on' : '🔇 Speaker is off'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceCall;
