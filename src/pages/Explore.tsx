import { useState } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { FunderCard } from "@/components/FunderCard";
import { GrantCard } from "@/components/GrantCard";
import { Search, Filter, Grid, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockFunders = [
  {
    name: "Senovo",
    type: "VC firm",
    verified: true,
    countries: ["Austria", "Belgium"],
    checkRange: "$1M to $3M",
    stages: ["Early Revenue", "Scaling"],
    industries: ["collaboration", "tech"],
    openRate: 75,
  },
  {
    name: "Woodlawn Health Ventures",
    type: "VC firm",
    verified: true,
    countries: ["USA"],
    checkRange: "$50k to $500k",
    stages: ["Early Revenue", "Growth"],
    industries: ["agetech", "IVD"],
    openRate: 67,
  },
  {
    name: "Troismer",
    type: "Family office",
    verified: true,
    countries: ["Belgium", "France"],
    checkRange: "$100k to $1M",
    stages: ["Prototype", "Early Revenue"],
    industries: ["cleantech"],
    openRate: 100,
  },
  {
    name: "Jack Taylor",
    type: "Solo angel",
    verified: true,
    countries: ["UK"],
    checkRange: "$5k to $50k",
    stages: ["Idea or Patent", "Prototype"],
    industries: ["gaming", "dual use"],
    openRate: 100,
  },
  {
    name: "Insurtech Capital",
    type: "VC firm",
    verified: true,
    countries: ["Germany", "Switzerland"],
    checkRange: "$500k to $2M",
    stages: ["Early Revenue", "Growth"],
    industries: ["property", "insurtech"],
    openRate: 82,
  },
];

const mockGrants = [
  {
    title: "Eternal Emerging Enterprises Fund I",
    description: "Looking for breakthrough innovations in sustainable technology and clean energy.",
    funder: "Eternal Emerging Enterprises Fund",
    totalAmount: "$5M",
    applicants: 134,
    daysLeft: 2343,
    sdgTags: ["SDG 7: Clean Energy", "SDG 9: Innovation"],
  },
  {
    title: "Tech and Tech enabled",
    description: "Early and Growth Stage, Sector Agnostic investments in technology startups.",
    funder: "Singularity",
    totalAmount: "$10M",
    applicants: 169,
    daysLeft: 2151,
    sdgTags: ["SDG 8: Economic Growth", "SDG 9: Innovation"],
  },
  {
    title: "Venture Debt Program",
    description: "Growth capital for revenue-generating startups with proven business models.",
    funder: "Alteria Capital",
    totalAmount: "$25M",
    applicants: 184,
    daysLeft: 1854,
    sdgTags: ["SDG 8: Economic Growth"],
  },
  {
    title: "Climate & Sustainability Fund",
    description: "Focused on climate tech and sustainability innovations addressing SDG goals.",
    funder: "Avaana Climate",
    totalAmount: "$50M",
    applicants: 256,
    daysLeft: 1200,
    sdgTags: ["SDG 6: Clean Water", "SDG 7: Clean Energy", "SDG 13: Climate Action"],
  },
  {
    title: "High Growth Start-Up Fund",
    description: "Looking for a high growth Start-Up with a highly qualified founder.",
    funder: "Trifecta Capital",
    totalAmount: "$15M",
    applicants: 89,
    daysLeft: 890,
    sdgTags: ["SDG 9: Innovation", "SDG 17: Partnerships"],
  },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Explore Opportunities
            </h1>
            <p className="text-muted-foreground">
              Discover funders and grants that match your innovation
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="funders" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="funders">Funders</TabsTrigger>
                <TabsTrigger value="grants">Grants</TabsTrigger>
              </TabsList>

              {/* Search & Filters */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search funders or grants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Geography" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="eu">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="idea">Idea/Patent</SelectItem>
                    <SelectItem value="prototype">Prototype</SelectItem>
                    <SelectItem value="revenue">Early Revenue</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
                <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Funders Tab */}
            <TabsContent value="funders">
              <div className="mb-4 text-sm text-muted-foreground">
                {mockFunders.length.toLocaleString()} investors found
              </div>
              <div className="space-y-3">
                {mockFunders.map((funder, i) => (
                  <FunderCard
                    key={i}
                    {...funder}
                    onSubmit={() => console.log("Submit to", funder.name)}
                    onViewProfile={() => console.log("View", funder.name)}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` } as React.CSSProperties}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Grants Tab */}
            <TabsContent value="grants">
              <div className="mb-4 text-sm text-muted-foreground">
                {mockGrants.length} active grants
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGrants.map((grant, i) => (
                  <GrantCard
                    key={i}
                    {...grant}
                    onClick={() => console.log("View grant", grant.title)}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Explore;
