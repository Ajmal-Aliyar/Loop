import { Users, Hash, FolderOpen, Smartphone, Monitor, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CreateChannelDialog } from './CreateChannelDialog';
import { useChannelStore } from '@/store/channelStore';

export const HomeView = () => {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  return (
    <div className="h-full overflow-y-auto bg-chat-bg p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Home</h1>
          <p className="mt-2 text-lg text-muted-foreground">Welcome to Thousands</p>
        </div>

        {/* Getting Started Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">3 steps to get you started</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Add users</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Invite and add members to this workspace to start communicating.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" className="w-full" onClick={() => navigate('/users')}>
                  Add users
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Create channels</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create a public channel that new workspace members can join.
                </CardDescription>
              </CardHeader>
              <CardContent onClick={() => setShowAddDialog(true)}>
                <Button variant="default" className="w-full">
                  Create channel
                </Button>
              </CardContent>
            </Card>

            <CreateChannelDialog
                    open={showAddDialog}
                    onOpenChange={setShowAddDialog}
                    onSuccess={() => {
                      // Refresh channels list
                      const fetchChannels = useChannelStore.getState().fetchChannels;
                      if (fetchChannels) fetchChannels();
                    }}
                  />

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Join rooms</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Discover public channels and teams in the workspace directory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" className="w-full">
                  Open directory
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Apps Section */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Mobile apps</CardTitle>
              <CardDescription className="text-muted-foreground">
                Take Rocket.Chat with you with mobile applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Google Play
                </Button>
                <Button variant="secondary" size="sm">
                  App Store
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Desktop apps</CardTitle>
              <CardDescription className="text-muted-foreground">
                Install Rocket.Chat on your preferred desktop platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Windows
                </Button>
                <Button variant="secondary" size="sm">
                  Linux
                </Button>
                <Button variant="secondary" size="sm">
                  Mac
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Documentation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Documentation</CardTitle>
            <CardDescription className="text-muted-foreground">
              Learn how to unlock the myriad possibilities of Rocket.Chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default">
              See documentation
            </Button>
          </CardContent>
        </Card>

        {/* Admin Section */}
        <Card className="bg-muted/50 border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xs">🔒</span>
              <span>Not visible to workspace</span>
            </div>
            <CardDescription className="mt-2 text-foreground">
              Admins may insert content html to be rendered in this white space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Customize content
              </Button>
              <Button variant="ghost" size="sm">
                Show to workspace
              </Button>
              <Button variant="ghost" size="sm">
                Show only this content
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
