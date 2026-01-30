import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Mail, Building2, Globe, Star, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { UserTag, Project } from '@/types/database';

export default function Profile() {
  const { user, profile, role } = useAuth();
  const [tags, setTags] = useState<UserTag[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  async function fetchUserData() {
    setLoading(true);

    // Fetch user tags
    const { data: tagsData } = await supabase
      .from('user_tags')
      .select('*')
      .eq('user_id', user?.id);

    if (tagsData) setTags(tagsData);

    // Fetch user projects (if founder)
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('founder_id', user?.id);

    if (projectsData) setProjects(projectsData);

    setLoading(false);
  }

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-accent text-accent-foreground">Admin</Badge>;
      case 'investor':
        return <Badge className="bg-primary text-primary-foreground">Investor</Badge>;
      case 'founder':
        return <Badge className="bg-primary text-primary-foreground">Innovator</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {getInitials(profile?.full_name)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {profile?.full_name || 'User'}
                </h1>
                {getRoleBadge()}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profile?.email || user.email}
                </div>
                {profile?.organization && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {profile.organization}
                  </div>
                )}
                {profile?.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {profile.website}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-3">{profile?.bio || 'No bio yet.'}</p>
              <div className="flex gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-primary border-primary">
                    {tag.tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border gradient-navy text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span className="font-medium">Reputation Score</span>
              </div>
              <Star className="h-5 w-5 text-warning" />
            </div>
            <p className="text-4xl font-bold mb-2">{profile?.reputation_score || 0}</p>
            <p className="text-sm opacity-80">Top 15% of researchers on the platform</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{profile?.completed_projects || 0}</p>
            <p className="text-sm text-muted-foreground">Completed Projects</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 relative">
            <Badge className="absolute top-4 right-4 bg-success/10 text-success">+2%</Badge>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{profile?.on_time_delivery || 0}%</p>
            <p className="text-sm text-muted-foreground">On-Time Delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No projects yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.sector}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-primary font-medium">
                          ${project.current_funding.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of ${project.funding_goal.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Activity feed coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Settings coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
