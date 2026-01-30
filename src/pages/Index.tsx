import { useState } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { SectorCard } from "@/components/SectorCard";
import { StatsCard } from "@/components/StatsCard";
import { 
  Cpu, 
  Leaf, 
  FlaskConical, 
  Zap, 
  Shield, 
  Rocket,
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
  Award,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const sectors = [
  { 
    name: "BioTech", 
    icon: <FlaskConical className="w-6 h-6" />, 
    growthRate: 12.4, 
    projectCount: 234, 
    totalFunding: "$42M",
    matchScore: 87,
    avgROI: 14.2
  },
  { 
    name: "Clean Energy", 
    icon: <Leaf className="w-6 h-6" />, 
    growthRate: 18.2, 
    projectCount: 189, 
    totalFunding: "$67M",
    matchScore: 92,
    avgROI: 16.8
  },
  { 
    name: "Artificial Intelligence", 
    icon: <Cpu className="w-6 h-6" />, 
    growthRate: 24.7, 
    projectCount: 312, 
    totalFunding: "$128M",
    matchScore: 95,
    avgROI: 22.4
  },
  { 
    name: "Advanced Materials", 
    icon: <Zap className="w-6 h-6" />, 
    growthRate: 8.9, 
    projectCount: 87, 
    totalFunding: "$23M",
    matchScore: 78,
    avgROI: 11.5
  },
  { 
    name: "Cybersecurity", 
    icon: <Shield className="w-6 h-6" />, 
    growthRate: 15.3, 
    projectCount: 156, 
    totalFunding: "$51M",
    matchScore: 84,
    avgROI: 18.7
  },
  { 
    name: "Space Tech", 
    icon: <Rocket className="w-6 h-6" />, 
    growthRate: 21.5, 
    projectCount: 64, 
    totalFunding: "$89M",
    matchScore: 89,
    avgROI: 25.3
  },
];

const stats = [
  { 
    label: "Total Funding Deployed", 
    value: "$2.4B", 
    icon: <DollarSign className="w-5 h-5" />, 
    trend: { value: 23, isPositive: true },
    subtext: "Across 3,421 projects"
  },
  { 
    label: "Active Innovators", 
    value: "12,847", 
    icon: <Users className="w-5 h-5" />, 
    trend: { value: 18, isPositive: true },
    subtext: "+1,847 this quarter"
  },
  { 
    label: "Avg. Funding Cycle", 
    value: "42 days", 
    icon: <Clock className="w-5 h-5" />, 
    trend: { value: 12, isPositive: true },
    subtext: "Industry avg: 68 days"
  },
  { 
    label: "Success Rate", 
    value: "87%", 
    icon: <Award className="w-5 h-5" />, 
    trend: { value: 5, isPositive: true },
    subtext: "Milestone completion"
  },
];

const topMatches = [
  {
    id: 1,
    name: "Quantum Computing Breakthrough",
    sector: "AI & Quantum",
    innovator: "QuantumLeap Labs",
    fundingGoal: "$2.5M",
    matchScore: 96,
    timeline: "18 months",
    investors: ["TechVentures", "DeepScience", "FutureFund"]
  },
  {
    id: 2,
    name: "Carbon Capture Membrane",
    sector: "Clean Energy",
    innovator: "EcoTech Solutions",
    fundingGoal: "$1.8M",
    matchScore: 92,
    timeline: "24 months",
    investors: ["GreenCapital", "ClimateFund", "EcoVentures"]
  },
  {
    id: 3,
    name: "Neuromorphic AI Chip",
    sector: "Semiconductors",
    innovator: "NeuroSynth Inc",
    fundingGoal: "$3.2M",
    matchScore: 88,
    timeline: "30 months",
    investors: ["HardwareVentures", "AICapital", "TechGrowth"]
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleQuickMatch = () => {
    navigate("/matcher");
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      {/* Professional Header */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  SMART CONTRACT PLATFORM
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                R&D Investment Dashboard
                <span className="block text-gradient text-3xl md:text-4xl font-normal mt-2">
                  Data-Driven Funding Intelligence
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Real-time analytics and AI-powered matching for strategic R&D investments. 
                Track performance, compare sectors, and discover high-potential opportunities.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleQuickMatch}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-cta text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Target className="w-4 h-4" />
                Quick Match
              </button>
              <button 
                onClick={() => navigate("/explore")}
                className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                <Eye className="w-4 h-4" />
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Dashboard Section */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* Dashboard Header */}
            <div className="border-b border-border p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                    Sector Performance Comparison
                  </h2>
                  <p className="text-muted-foreground">
                    Compare growth metrics, funding patterns, and match success rates across sectors
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Filter sectors..."
                      className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm"
                    />
                  </div>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    {["all", "growth", "funding", "roi"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 text-sm font-medium capitalize ${
                          activeFilter === filter 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-secondary"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <button className="p-2 border border-border rounded-lg hover:bg-secondary">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Metrics */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {sectors.slice(0, 3).map((sector, i) => (
                  <div 
                    key={sector.name}
                    className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-6 hover:border-primary/30 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/explore?sector=${sector.name}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          {sector.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{sector.name}</h3>
                          <p className="text-sm text-muted-foreground">{sector.projectCount} projects</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-green-500">
                        <TrendingUp className="w-4 h-4" />
                        {sector.growthRate}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Avg. ROI</p>
                        <p className="text-xl font-bold text-foreground">{sector.avgROI}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Match Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                              style={{ width: `${sector.matchScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{sector.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">Total Funding</span>
                      <span className="font-semibold">{sector.totalFunding}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="overflow-hidden border border-border rounded-xl">
                <div className="bg-secondary/50 px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Detailed Sector Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/30 border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Sector</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Growth Rate</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Funding Activity</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Match Success</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Avg. ROI</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectors.map((sector) => (
                        <tr key={sector.name} className="border-b border-border/50 hover:bg-secondary/20">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {sector.icon}
                              <span className="font-medium">{sector.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                  style={{ width: `${Math.min(sector.growthRate * 3, 100)}%` }}
                                />
                              </div>
                              <span className="font-medium">{sector.growthRate}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="font-medium">{sector.totalFunding}</span>
                              <p className="text-xs text-muted-foreground">{sector.projectCount} projects</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                                  style={{ width: `${sector.matchScore}%` }}
                                />
                              </div>
                              <span className="font-medium">{sector.matchScore}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-green-500">{sector.avgROI}%</span>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => navigate(`/explore?sector=${sector.name}`)}
                              className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                            >
                              View Details
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 border-y border-border/50 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {stat.icon}
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    +{stat.trend.value}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Matches Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                High-Potential Matches
              </h2>
              <p className="text-muted-foreground">
                AI-curated opportunities with 85%+ match score
              </p>
            </div>
            <button 
              onClick={() => navigate("/matcher")}
              className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topMatches.map((match) => (
              <div 
                key={match.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => navigate(`/project/${match.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                      {match.sector}
                    </span>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {match.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{match.innovator}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-green-500">{match.matchScore}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Match Score</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Funding Goal</span>
                    <span className="font-semibold">{match.fundingGoal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Timeline</span>
                    <span className="font-medium">{match.timeline}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Interested Investors</p>
                  <div className="flex flex-wrap gap-2">
                    {match.investors.slice(0, 3).map((investor, i) => (
                      <span key={i} className="px-3 py-1 bg-secondary text-xs rounded-full">
                        {investor}
                      </span>
                    ))}
                    {match.investors.length > 3 && (
                      <span className="px-3 py-1 bg-secondary text-xs rounded-full">
                        +{match.investors.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            SMART CONTRACT READY
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Ready to Invest with Confidence?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Leverage our AI-powered matching and milestone-based escrow system to fund 
            breakthrough research with reduced risk and transparent execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-3.5 bg-gradient-cta text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-lg shadow-lg"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate("/demo")}
              className="px-8 py-3.5 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-lg"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-cta-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-xl">NexusR&D</span>
                <p className="text-sm text-muted-foreground">Enterprise R&D Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact Sales
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2026 NexusR&D. All rights reserved.<br />
              Patent-pending AI matching technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;