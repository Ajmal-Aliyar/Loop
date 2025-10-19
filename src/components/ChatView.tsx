import { useState, useEffect, useRef } from 'react';
import { 
  Smile, 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Link, 
  List,
  Undo,
  Mic,
  Video,
  Paperclip,
  Plus,
  Send,
  User,
  Clock
} from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useMessageStore } from '@/store/messageStore';
import { socketService } from '@/services/socketService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/api/chat/chat.types';

export const ChatView = () => {
  const { selectedChannel } = useChatStore();
  const { messages, loading, sending, fetchMessages, sendMessage } = useMessageStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentMessages = selectedChannel ? messages[selectedChannel.id] || [] : [];

  // Fetch messages when channel changes
  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
      // Subscribe to real-time updates
      socketService.subscribeToRoom(selectedChannel.id);
    }

    return () => {
      if (selectedChannel) {
        socketService.unsubscribeFromRoom(selectedChannel.id);
      }
    };
  }, [selectedChannel, fetchMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChannel || sending) return;

    const messageText = message.trim();
    setMessage('');

    try {
      // Send via socket for real-time
      socketService.sendLivechatMessage(selectedChannel.id, messageText);
      
      // Also send via REST API as backup
      await sendMessage(selectedChannel.id, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setMessage(messageText);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatarColor = (name: string): string => {
    const colors = ['bg-avatar-green', 'bg-avatar-yellow', 'bg-avatar-blue', 'bg-avatar-pink'];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (!selectedChannel) return null;

  return (
    <div className="flex h-full flex-col bg-chat-bg">
      {/* Chat Messages Area */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-muted-foreground">Loading messages...</div>
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-12 text-center">
              <div className={cn("flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold text-white", getAvatarColor(selectedChannel.name))}>
                {selectedChannel.avatar}
              </div>
              <p className="text-sm text-muted-foreground">Start of conversation in #{selectedChannel.name}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMessages.map((msg: ChatMessage, index: number) => {
                const prevMessage = index > 0 ? currentMessages[index - 1] : null;
                const isSameUser = prevMessage && prevMessage.u._id === msg.u._id;
                const showAvatar = !isSameUser;

                return (
                  <div key={msg._id} className={cn("flex gap-3", showAvatar ? "items-start" : "items-end")}>
                    {showAvatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn("text-xs font-bold text-white", getAvatarColor(msg.u.username))}>
                          {msg.u.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8" /> // Spacer for alignment
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {msg.u.name || msg.u.username}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(msg.ts)}
                          </span>
                        </div>
                      )}
                      <div className="text-sm text-foreground break-words">
                        {msg.msg}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border bg-chat-input p-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${selectedChannel.name}`}
              className="min-h-[60px] resize-none bg-background pr-12 text-foreground placeholder:text-muted-foreground"
              disabled={sending}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-2 right-2 h-8 w-8"
              disabled={!message.trim() || sending}
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Formatting Toolbar */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Code className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
