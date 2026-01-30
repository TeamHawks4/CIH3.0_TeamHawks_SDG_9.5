import { useState, useEffect } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { DeepMatchSearch } from "@/components/DeepMatchSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Loader2, 
  Brain, 
  Target, 
  CheckCircle2, 
  Building2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  FileText,
  BarChart3,
  Filter,
  Search
} from "lucide-react";
import { supabase } from "@/client";

interface Project {
  id: string;
  title: string;
  description: string;
  sector: string;
  funding_goal: number;
  raised_amount: number;
  created_at: string;
  status: string;
  innovator_id: string;
  innovator_name?: string;
  match_score?: number;
}

const Matcher = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");

  // Fetch projects from Supabase
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          sector,
          funding_goal,
          raised_amount,
          created_at,
          status,
          innovator_id,
          innovators (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedData = data?.map(({ innovators, ...rest }) => ({
        ...rest,
        innovator_name: innovators?.name,
        match_score: Math.floor(Math.random() * 30) + 70, // Random match score for demo
      })) || [];

      setProjects(processedData);
      setFilteredProjects(processedData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search and sector
  useEffect(() => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSector !== "all") {
      filtered = filtered.filter(project =>
        project.sector.toLowerCase() === selectedSector.toLowerCase()
      );
    }

    setFilteredProjects(filtered);
  }, [searchQuery, selectedSector, projects]);

  const handleSearch = (query: string, file?: File) => {
    setIsAnalyzing(true);
    setHasResults(false);
    setAnalysisComplete(false);
    setSearchQuery(query);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisComplete(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setHasResults(true);
      }, 1000);
    }, 2000);
  };

  const getSectors = () => {
    const sectors = projects.map(p => p.sector);
    return ["all", ...Array.from(new Set(sectors))];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFundingProgress = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  const handleInvest = (projectId: string) => {
    console.log("Invest in project:", projectId);
    // Navigate to investment page or show investment modal
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <FloatingNavbar />
        <div className="flex items-center justify-center pt-40">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              AI-Powered Project Discovery
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Discover & Match with Innovations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find groundbreaking projects that match your investment criteria. 
              Our AI analyzes project viability, sector trends, and funding potential.
            </p>
          </div>

          {/* Search Box */}
          <DeepMatchSearch onSearch={handleSearch} className="mb-10" />

          {/* Analysis Animation */}
          {isAnalyzing && (
            <div className="bg-card rounded-lg border border-border p-6 mb-10 animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  {analysisComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {analysisComplete ? "Analysis Complete" : "Analyzing projects..."}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {analysisComplete 
                      ? `Found ${filteredProjects.length} matching projects` 
                      : "Filtering and ranking projects based on your criteria"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-2xl font-bold text-accent mb-1">{projects.length}</div>
                  <div className="text-xs text-muted-foreground">Total Projects</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-2xl font-bold text-success mb-1">
                    {Math.round(projects.reduce((acc, p) => acc + (p.raised_amount / p.funding_goal), 0) / projects.length * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg. Funded</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-2xl font-bold text-cta mb-1">
                    {formatCurrency(projects.reduce((acc, p) => acc + p.funding_goal, 0))}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Goal</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Stats */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Search Projects
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Sector
                    </label>
                    <select
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="w-full p-2 border border-input rounded-md bg-background text-sm"
                    >
                      {getSectors().map((sector) => (
                        <option key={sector} value={sector}>
                          {sector === "all" ? "All Sectors" : sector}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Quick Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Projects</span>
                        <span className="font-medium">{projects.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Funding Goal</span>
                        <span className="font-medium">{formatCurrency(projects.reduce((acc, p) => acc + p.funding_goal, 0))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg. Match Score</span>
                        <span className="font-medium text-accent">
                          {Math.round(projects.reduce((acc, p) => acc + (p.match_score || 0), 0) / projects.length)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Available Projects
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredProjects.length} projects found
                  </p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Sorted by Match Score
                </Badge>
              </div>

              {filteredProjects.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No projects found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try adjusting your filters or search terms to find matching projects.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="mb-2 bg-accent/10 text-accent hover:bg-accent/20 border-0">
                              {project.sector}
                            </Badge>
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                              {project.title}
                            </CardTitle>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge className="mb-2 bg-gradient-cta text-cta-foreground border-0">
                              {project.match_score}% Match
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Funding Goal</span>
                            <span className="font-bold text-foreground">
                              {formatCurrency(project.funding_goal)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Raised Amount</span>
                            <span className="font-bold text-success">
                              {formatCurrency(project.raised_amount)}
                            </span>
                          </div>
                        </div>

                        {/* Funding Progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{getFundingProgress(project.raised_amount, project.funding_goal)}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-500"
                              style={{ width: `${getFundingProgress(project.raised_amount, project.funding_goal)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {project.innovator_name || "Anonymous Innovator"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(project)}
                              className="gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleInvest(project.id)}
                              className="gap-1"
                            >
                              <DollarSign className="w-4 h-4" />
                              Invest
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge className="mb-2 bg-accent/10 text-accent hover:bg-accent/20 border-0">
                    {selectedProject.sector}
                  </Badge>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-secondary rounded-md"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Funding Goal</h3>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(selectedProject.funding_goal)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Raised Amount</h3>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(selectedProject.raised_amount)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <Badge className="bg-success/10 text-success border-0">
                      {selectedProject.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Match Score</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cta to-cta/70 rounded-full"
                          style={{ width: `${selectedProject.match_score}%` }}
                        />
                      </div>
                      <span className="font-bold text-cta">{selectedProject.match_score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Project Description</h3>
                <div className="prose prose-sm max-w-none text-foreground/80">
                  <p className="whitespace-pre-line">{selectedProject.description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Innovator</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProject.innovator_name || "Anonymous"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedProject(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleInvest(selectedProject.id)}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Invest Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matcher;