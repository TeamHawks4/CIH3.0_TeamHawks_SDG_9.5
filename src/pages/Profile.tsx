import { useState } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { StatsCard } from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Globe,
  Briefcase,
  Award,
  Star,
  Clock,
  DollarSign,
  FileText,
  Edit,
  CheckCircle2,
  TrendingUp,
  Target,
} from "lucide-react";

const mockUser = {
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  role: "Innovator",
  avatar: null,
  bio: "Nanotechnology researcher focused on water purification solutions. 15 years of experience in materials science.",
  website: "https://sarahchen.research",
  organization: "MIT Media Lab",
  sdgFocus: ["SDG 6: Clean Water", "SDG 9: Innovation"],
  reputationScore: 87,
  completedProjects: 12,
  totalFundingReceived: 1250000,
  onTimeDelivery: 94,
};

const mockProjects = [
  {
    title: "Nano-Filter Water Purification",
    status: "active",
    funder: "Clean Water Foundation",
    amount: 150000,
    progress: 66,
    sdgs: ["SDG 6", "SDG 9"],
  },
  {
    title: "Bio-degradable Membrane Research",
    status: "completed",
    funder: "Green Tech Fund",
    amount: 85000,
    progress: 100,
    sdgs: ["SDG 6", "SDG 12"],
  },
  {
    title: "Desalination Efficiency Study",
    status: "completed",
    funder: "Ocean Research Institute",
    amount: 200000,
    progress: 100,
    sdgs: ["SDG 14", "SDG 6"],
  },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar isAuthenticated={true} />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-accent flex items-center justify-center text-accent-foreground text-3xl font-bold">
                {mockUser.name.split(" ").map((n) => n[0]).join("")}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-display font-bold text-foreground">
                        {mockUser.name}
                      </h1>
                      <Badge className="bg-accent/10 text-accent border-0">
                        {mockUser.role}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {mockUser.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {mockUser.organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {mockUser.website}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Profile
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4">{mockUser.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {mockUser.sdgFocus.map((sdg, i) => (
                    <Badge key={i} variant="outline" className="bg-accent/5 border-accent/20 text-accent">
                      <Target className="w-3 h-3 mr-1" />
                      {sdg}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reputation Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-hero rounded-xl p-6 text-primary-foreground col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  <span className="font-semibold">Reputation Score</span>
                </div>
                <Star className="w-5 h-5 text-warning" />
              </div>
              <p className="text-5xl font-display font-bold mb-2">{mockUser.reputationScore}</p>
              <p className="text-sm text-primary-foreground/70">
                Top 15% of researchers on the platform
              </p>
            </div>
            <StatsCard
              label="Completed Projects"
              value={mockUser.completedProjects.toString()}
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <StatsCard
              label="On-Time Delivery"
              value={`${mockUser.onTimeDelivery}%`}
              icon={<Clock className="w-5 h-5" />}
              trend={{ value: 2, isPositive: true }}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="bg-secondary/50 mb-6">
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="space-y-4">
                {mockProjects.map((project, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl border border-border p-5 card-hover"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{project.title}</h3>
                          <Badge
                            className={
                              project.status === "active"
                                ? "bg-success/10 text-success border-0"
                                : "bg-muted text-muted-foreground border-0"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Funded by {project.funder}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">${project.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {project.sdgs.map((sdg, j) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {sdg}
                          </Badge>
                        ))}
                      </div>
                      <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-accent rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <div className="space-y-4">
                {[
                  { action: "Milestone approved", project: "Nano-Filter Water Purification", time: "2 hours ago", icon: <CheckCircle2 className="w-4 h-4 text-success" /> },
                  { action: "Submitted proof of delivery", project: "Nano-Filter Water Purification", time: "1 day ago", icon: <FileText className="w-4 h-4 text-accent" /> },
                  { action: "Received funding", project: "Bio-degradable Membrane Research", time: "3 days ago", icon: <DollarSign className="w-4 h-4 text-success" /> },
                  { action: "Reputation increased", project: "Platform", time: "1 week ago", icon: <TrendingUp className="w-4 h-4 text-accent" /> },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                    <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.project}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-6">Profile Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input defaultValue={mockUser.name} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input defaultValue={mockUser.email} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Organization</label>
                    <Input defaultValue={mockUser.organization} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Website</label>
                    <Input defaultValue={mockUser.website} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Textarea defaultValue={mockUser.bio} rows={4} />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-gradient-cta text-cta-foreground hover:opacity-90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
