import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Eye, Search, Download, FlaskConical, Leaf, Cpu, TrendingUp } from 'lucide-react';
import type { Sector } from '@/types/database';

const sectorIcons: Record<string, React.ReactNode> = {
  'BioTech': <FlaskConical className="h-5 w-5 text-primary" />,
  'Clean Energy': <Leaf className="h-5 w-5 text-primary" />,
  'Artificial Intelligence': <Cpu className="h-5 w-5 text-primary" />,
};

export default function Home() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchSectors();
  }, []);

  async function fetchSectors() {
    setLoading(true);
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .order('growth_rate', { ascending: false });

    if (!error && data) {
      setSectors(data);
    }
    setLoading(false);
  }

  const filteredSectors = sectors.filter(sector =>
    sector.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <Badge variant="secondary" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            SMART CONTRACT PLATFORM
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">R&D Investment Dashboard</h1>
          <p className="text-xl text-primary font-medium">Data-Driven Funding Intelligence</p>
          <p className="text-muted-foreground max-w-2xl">
            Real-time analytics and AI-powered matching for strategic R&D investments. Track performance,
            compare sectors, and discover high-potential opportunities.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/projects">
            <Button className="bg-accent hover:bg-accent/90 gap-2 rounded-full">
              <Eye className="h-4 w-4" />
              View Projects
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" className="gap-2 rounded-full">
              <Eye className="h-4 w-4" />
              Browse Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Sector Performance */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Sector Performance Comparison</h2>
              <p className="text-muted-foreground">
                Compare growth metrics, funding patterns, and match success rates across sectors
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter sectors..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex bg-secondary rounded-full p-1">
                {['All', 'Growth', 'Funding', 'Roi'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-navy text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredSectors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No sectors found. Add sectors to your database to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredSectors.map((sector) => (
                <Card key={sector.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        {sectorIcons[sector.name] || <BarChart3 className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{sector.name}</p>
                        <p className="text-sm text-muted-foreground">{sector.project_count} projects</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">{sector.growth_rate}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
