import { useState, useEffect } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { FunderCard } from "@/components/FunderCard";
import { GrantCard } from "@/components/GrantCard";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Loader2, 
  Database, 
  RefreshCw,
  DollarSign,
  User,
  Briefcase,
  Building,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Investor {
  id: string;
  name: string;
  profile: string;
  domain: string;
  amount: number;
  created_at?: string;
}

interface Grant {
  id: string;
  title: string;
  description: string;
  funder: string;
  total_amount: number;
  applicants?: number;
  days_left?: number;
  sdg_tags?: string[];
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loadingInvestors, setLoadingInvestors] = useState(true);
  const [loadingGrants, setLoadingGrants] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedAmount, setSelectedAmount] = useState<string>("all");
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  // Fetch investors from database on component mount
  useEffect(() => {
    if (connectionStatus === 'connected') {
      fetchInvestors();
      fetchGrants();
    }
  }, [connectionStatus]);

  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      console.log('Checking database connection...');
      
      // Try a simple query to check connection
      const { data, error } = await supabase
        .from('investor')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Database connection error:', error);
        setConnectionError(error.message);
        setConnectionStatus('error');
        return;
      }
      
      console.log('Database connection successful');
      setConnectionError(null);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Failed to connect to database:', error);
      setConnectionError(error.message || 'Unknown connection error');
      setConnectionStatus('error');
    }
  };

  // Fetch investors from database
  const fetchInvestors = async () => {
    try {
      setLoadingInvestors(true);
      setIsRefreshing(true);
      setConnectionError(null);
      
      console.log('Starting fetchInvestors...');
      console.log('Supabase client:', supabase);
      
      // Query the investor table directly with your exact schema
      const { data, error } = await supabase
        .from('investor')
        .select('*')
        .order('name', { ascending: true });

      console.log('Query result:', { data, error });

      if (error) {
        console.error('Supabase query error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Raw data from database:', data);
      console.log('Data type:', typeof data);
      console.log('Is array?', Array.isArray(data));
      console.log('Data length:', data?.length || 0);

      // Transform data with proper type safety
      const transformedData: Investor[] = (data || []).map(item => {
        console.log('Processing item:', item);
        return {
          id: item.id || `id-${Math.random()}`,
          name: item.name || 'Unnamed Investor',
          profile: item.profile || 'No profile available',
          domain: item.domain || 'General',
          amount: Number(item.amount) || 0,
          created_at: item.created_at,
        };
      });

      console.log('Transformed investors:', transformedData);
      
      setInvestors(transformedData);
      setFilteredInvestors(transformedData);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Full error fetching investors:', {
        error,
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      setConnectionError(`Database Error: ${error?.message || 'Unknown error'}`);
      setConnectionStatus('error');
      
      // Use demo data for development
      const demoInvestors: Investor[] = [
        {
          id: 'demo-1',
          name: 'Paras',
          profile: 'Angel Investor',
          domain: 'EdTech',
          amount: 45000,
        },
        {
          id: 'demo-2',
          name: 'Tech Ventures',
          profile: 'VC Firm focusing on early-stage technology',
          domain: 'Technology',
          amount: 500000,
        },
        {
          id: 'demo-3',
          name: 'Green Capital',
          profile: 'Impact investor in sustainable projects',
          domain: 'Sustainability',
          amount: 250000,
        }
      ];
      
      setInvestors(demoInvestors);
      setFilteredInvestors(demoInvestors);
      
      // Don't show alert for demo data
      console.log('Using demo data due to database error');
    } finally {
      setLoadingInvestors(false);
      setIsRefreshing(false);
    }
  };

  const fetchGrants = async () => {
    try {
      setLoadingGrants(true);
      
      // Demo data for grants
      const demoGrants: Grant[] = [
        {
          id: 'grant-1',
          title: 'Early Stage Tech Innovation Fund',
          description: 'Funding for innovative technology startups with disruptive potential',
          funder: 'Tech Innovation Foundation',
          total_amount: 1000000,
          applicants: 156,
          days_left: 45,
          sdg_tags: ['SDG 9: Innovation', 'SDG 8: Economic Growth'],
        },
        {
          id: 'grant-2',
          title: 'Climate Action Accelerator',
          description: 'Grants for projects addressing climate change and environmental sustainability',
          funder: 'Green Future Initiative',
          total_amount: 2500000,
          applicants: 289,
          days_left: 78,
          sdg_tags: ['SDG 13: Climate Action', 'SDG 7: Clean Energy'],
        },
        {
          id: 'grant-3',
          title: 'Healthcare Innovation Grant',
          description: 'Funding for healthcare technology and medical innovation projects',
          funder: 'Health Impact Fund',
          total_amount: 1500000,
          applicants: 203,
          days_left: 32,
          sdg_tags: ['SDG 3: Good Health', 'SDG 9: Innovation'],
        },
      ];

      setGrants(demoGrants);
      setFilteredGrants(demoGrants);
    } catch (error) {
      console.error('Error fetching grants:', error);
      // Use demo data
      const demoGrants: Grant[] = [
        {
          id: 'demo-grant-1',
          title: 'Demo Grant Program',
          description: 'Sample grant program for demonstration purposes',
          funder: 'Demo Foundation',
          total_amount: 500000,
          applicants: 50,
          days_left: 90,
          sdg_tags: ['SDG 9: Innovation'],
        },
      ];
      setGrants(demoGrants);
      setFilteredGrants(demoGrants);
    } finally {
      setLoadingGrants(false);
    }
  };

  // Extract unique domains for filter dropdown
  useEffect(() => {
    if (investors.length > 0) {
      const uniqueDomains = Array.from(new Set(
        investors
          .map(inv => inv.domain)
          .filter(domain => domain && domain.trim() !== "")
      )).sort();
      setDomains(uniqueDomains);
    }
  }, [investors]);

  // Filter investors when search or filters change
  useEffect(() => {
    let filtered = investors;

    if (searchQuery) {
      filtered = filtered.filter(investor =>
        investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investor.profile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investor.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDomain !== "all") {
      filtered = filtered.filter(investor =>
        investor.domain.toLowerCase() === selectedDomain.toLowerCase()
      );
    }

    if (selectedAmount !== "all") {
      filtered = filtered.filter(investor => {
        const amount = investor.amount;
        switch (selectedAmount) {
          case "small":
            return amount <= 100000; // <= $100k
          case "medium":
            return amount > 100000 && amount <= 1000000; // $100k - $1M
          case "large":
            return amount > 1000000; // > $1M
          default:
            return true;
        }
      });
    }

    setFilteredInvestors(filtered);
  }, [searchQuery, selectedDomain, selectedAmount, investors]);

  // Filter grants when search or filters change
  useEffect(() => {
    let filtered = grants;

    if (searchQuery) {
      filtered = filtered.filter(grant =>
        grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.funder.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGrants(filtered);
  }, [searchQuery, grants]);

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return '$0';
    
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatCheckRange = (amount: number) => {
    if (amount === 0) return 'Amount not specified';
    
    const min = Math.max(amount * 0.5, 10000); // Assume 50% range
    const max = amount * 1.5;
    
    return `${formatCurrency(min)} to ${formatCurrency(max)}`;
  };

  const getInvestorType = (profile: string) => {
    if (profile.toLowerCase().includes('angel')) return 'Angel Investor';
    if (profile.toLowerCase().includes('vc') || profile.toLowerCase().includes('venture')) return 'VC Firm';
    if (profile.toLowerCase().includes('corporate')) return 'Corporate Investor';
    if (profile.toLowerCase().includes('family')) return 'Family Office';
    return 'Investor';
  };

  const getInvestorIndustries = (domain: string) => {
    return [domain || 'General'];
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
      <p className="text-muted-foreground">Loading investor data...</p>
    </div>
  );

  const handleRefresh = async () => {
    await checkDatabaseConnection();
    if (connectionStatus === 'connected') {
      await fetchInvestors();
      await fetchGrants();
    }
  };

  const ConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'checking':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Connecting...
          </Badge>
        );
      case 'connected':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Connection Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Connection Status Alert */}
          {connectionError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Database Connection Error</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{connectionError}</p>
                <div className="text-sm">
                  <p className="font-semibold">Troubleshooting steps:</p>
                  <ol className="list-decimal pl-4 space-y-1 mt-1">
                    <li>Check if your Supabase project is running</li>
                    <li>Verify your .env.local file has correct credentials</li>
                    <li>Ensure the "investor" table exists in your database</li>
                    <li>Check browser console for detailed error logs</li>
                  </ol>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkDatabaseConnection}
                  className="mt-2"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Header with stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-6 h-6 text-accent" />
                  <ConnectionStatusBadge />
                  {isRefreshing && (
                    <Badge variant="outline" className="text-xs">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Syncing...
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  {connectionStatus === 'error' ? 'Demo Investor Database' : 'Real-Time Investor Database'}
                </h1>
                <p className="text-muted-foreground">
                  {connectionStatus === 'error' 
                    ? 'Showing demo data. Connect to Supabase for live data.'
                    : `Discover ${investors.length} investors from your database`
                  }
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Investors</p>
                      <p className="text-2xl font-bold text-foreground">{investors.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Funding Pool</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(investors.reduce((sum, inv) => sum + inv.amount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unique Domains</p>
                      <p className="text-2xl font-bold text-foreground">{domains.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Investment</p>
                      <p className="text-2xl font-bold text-foreground">
                        {investors.length > 0 
                          ? formatCurrency(investors.reduce((sum, inv) => sum + inv.amount, 0) / investors.length)
                          : '$0'
                        }
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cta/10 flex items-center justify-center">
                      <Building className="w-5 h-5 text-cta" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="investors" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="investors" className="gap-2">
                  <User className="w-4 h-4" />
                  Investors ({investors.length})
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  Opportunities
                </TabsTrigger>
              </TabsList>

              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search investors by name, domain, or profile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {domains.map(domain => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                  <SelectTrigger className="w-[160px]">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Amounts</SelectItem>
                    <SelectItem value="small">Small (&lt; $100k)</SelectItem>
                    <SelectItem value="medium">Medium ($100k - $1M)</SelectItem>
                    <SelectItem value="large">Large (&gt; $1M)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Investors Tab */}
            <TabsContent value="investors">
              {loadingInvestors ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground mb-2 md:mb-0">
                      Found {filteredInvestors.length} investor{filteredInvestors.length !== 1 ? 's' : ''}
                      {selectedDomain !== 'all' && ` in ${selectedDomain}`}
                      {selectedAmount !== 'all' && ` (${selectedAmount} investments)`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {connectionStatus === 'error' ? 'Demo Mode' : `Live Data • Updated: ${new Date().toLocaleTimeString()}`}
                    </div>
                  </div>
                  
                  {filteredInvestors.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No investors found
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-4">
                          {searchQuery 
                            ? `No investors match "${searchQuery}". Try a different search term.`
                            : selectedDomain !== 'all' || selectedAmount !== 'all'
                            ? 'No investors match your current filters. Try clearing filters.'
                            : 'No investors found. Add some investors to get started.'
                          }
                        </p>
                        {(searchQuery || selectedDomain !== 'all' || selectedAmount !== 'all') && (
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedDomain('all');
                              setSelectedAmount('all');
                            }}
                          >
                            Clear all filters
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {filteredInvestors.map((investor, i) => (
                        <FunderCard
                          key={investor.id}
                          name={investor.name}
                          type={getInvestorType(investor.profile)}
                          verified={true}
                          countries={['Global']}
                          checkRange={formatCheckRange(investor.amount)}
                          stages={['All Stages']}
                          industries={getInvestorIndustries(investor.domain)}
                          openRate={85}
                          onSubmit={() => console.log("Submit to", investor.name)}
                          onViewProfile={() => {
                            // Show detailed investor modal
                            const modalContent = `
                              Investor Details:
                              
                              Name: ${investor.name}
                              Type: ${getInvestorType(investor.profile)}
                              Domain: ${investor.domain}
                              Investment Range: ${formatCheckRange(investor.amount)}
                              
                              Profile:
                              ${investor.profile}
                              
                              ${investor.created_at ? `Added: ${new Date(investor.created_at).toLocaleDateString()}` : ''}
                            `;
                            alert(modalContent);
                          }}
                          className="animate-fade-in"
                          style={{ animationDelay: `${i * 0.05}s` } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities">
              {loadingGrants ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    {filteredGrants.length} investment opportunities available
                  </div>
                  
                  {filteredGrants.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <DollarSign className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No opportunities found
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Check back later for new investment opportunities.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGrants.map((grant, i) => (
                        <GrantCard
                          key={grant.id}
                          title={grant.title}
                          description={grant.description}
                          funder={grant.funder}
                          totalAmount={formatCurrency(grant.total_amount)}
                          applicants={grant.applicants || 0}
                          daysLeft={grant.days_left || 100}
                          sdgTags={grant.sdg_tags || ['SDG 9: Innovation']}
                          onClick={() => console.log("View opportunity", grant.title)}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Database Info Card */}
          <Card className="mt-12 bg-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {connectionStatus === 'error' ? 'Demo Mode' : 'Database Connection'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {connectionStatus === 'error' 
                        ? 'Using demo data. Connect to Supabase for live database access.'
                        : 'Connected to Supabase • Table: investor'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {investors.length} records • {connectionStatus === 'error' ? 'Static data' : 'Live updates'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="gap-2"
                  >
                    {isRefreshing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    {isRefreshing ? 'Syncing...' : 'Refresh Data'}
                  </Button>
                  
                  {connectionStatus === 'error' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        // Open browser console for debugging
                        console.log('Debug info:', {
                          supabase,
                          connectionStatus,
                          connectionError,
                          investors
                        });
                        alert('Check browser console for debugging information');
                      }}
                      className="gap-2"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Debug Info
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Explore;