import { useState } from 'react';
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
  Send
} from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const ChatView = () => {
  const { selectedChannel } = useChatStore();
  const [message, setMessage] = useState('');

  if (!selectedChannel) return null;

  return (
    <div className="flex h-full flex-col bg-chat-bg">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-center space-y-2 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-2xl font-bold">
              {selectedChannel.avatar}
            </div>
            <p className="text-sm text-muted-foreground">Start of conversation</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-chat-input p-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${selectedChannel.name}`}
              className="min-h-[60px] resize-none bg-background pr-12 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-2 right-2 h-8 w-8"
              disabled={!message.trim()}
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
