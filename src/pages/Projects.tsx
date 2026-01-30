import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Building2, 
  Globe, 
  DollarSign, 
  Users, 
  Calendar,
  Target,
  BarChart3,
  MapPin,
  ExternalLink,
  Clock,
  Database,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Startup {
  id: string;
  Startup_ID: string;
  Startup_Idea: string;
  Domain: string;
  Startup_Stage: string;
  Industry_Funder_Type: string;
  Project_Duration_Months: number;
  SDG_AI: string;
  SDG_Alignment: string;
  Project_Status: string;
  Funding_Rounds: number;
  Investment_Amount: number;
  Valuation: number;
  Number_of_Investors: number;
  Country: string;
  Year_Founded: number;
  Growth_Rate_Cent: number;
  created_at?: string;
}

export default function StartupProjects() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  
  // Connection states
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      console.log('Checking database connection...');
      
      // Try a simple query to check connection
      const { data, error } = await supabase
        .from('startup')
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

  // Set up real-time subscription when connected
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    
    console.log('Setting up real-time subscription...');
    
    const channel = supabase
      .channel('realtime-startups')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'startup'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Fetch fresh data when changes occur
          fetchStartups();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [connectionStatus]);

  // Fetch startups when connected
  useEffect(() => {
    if (connectionStatus === 'connected') {
      fetchStartups();
    }
  }, [connectionStatus]);

  async function fetchStartups() {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setConnectionError(null);
      
      console.log('Fetching startups from database...');
      
      // Query the startup table with proper error handling
      const { data, error } = await supabase
        .from('startup')
        .select('*')
        .order('Valuation', { ascending: false });

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
      const transformedData: Startup[] = (data || []).map(item => {
        console.log('Processing item:', item);
        return {
          id: item.id || `id-${Math.random()}`,
          Startup_ID: item.Startup_ID || '',
          Startup_Idea: item.Startup_Idea || 'Unnamed Startup',
          Domain: item.Domain || 'General',
          Startup_Stage: item.Startup_Stage || 'Not Specified',
          Industry_Funder_Type: item.Industry_Funder_Type || 'Not Specified',
          Project_Duration_Months: Number(item.Project_Duration_Months) || 0,
          SDG_AI: item.SDG_AI || 'N/A',
          SDG_Alignment: item.SDG_Alignment || 'N/A',
          Project_Status: item.Project_Status || 'Not Specified',
          Funding_Rounds: Number(item.Funding_Rounds) || 0,
          Investment_Amount: Number(item.Investment_Amount) || 0,
          Valuation: Number(item.Valuation) || 0,
          Number_of_Investors: Number(item.Number_of_Investors) || 0,
          Country: item.Country || 'Global',
          Year_Founded: Number(item.Year_Founded) || 0,
          Growth_Rate_Cent: Number(item.Growth_Rate_Cent) || 0,
          created_at: item.created_at,
        };
      });

      console.log('Transformed startups:', transformedData);
      
      setStartups(transformedData);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Full error fetching startups:', {
        error,
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      setConnectionError(`Database Error: ${error?.message || 'Unknown error'}`);
      setConnectionStatus('error');
      
      // Use demo data for development
      const demoStartups: Startup[] = [
        {
          id: 'demo-1',
          Startup_ID: 'ST100000',
          Startup_Idea: 'AI-based Crop Disease Detection',
          Domain: 'Healthcare',
          Startup_Stage: 'Early Revenue',
          Industry_Funder_Type: 'VC Firm',
          Project_Duration_Months: 11,
          SDG_AI: 'SDG 2',
          SDG_Alignment: 'SDG 17',
          Project_Status: 'Active',
          Funding_Rounds: 2,
          Investment_Amount: 1500000,
          Valuation: 6621448041.82,
          Number_of_Investors: 50,
          Country: 'Germany',
          Year_Founded: 2020,
          Growth_Rate_Cent: 45.5,
        },
        {
          id: 'demo-2',
          Startup_ID: 'ST100001',
          Startup_Idea: 'Blockchain Supply Chain Platform',
          Domain: 'Technology',
          Startup_Stage: 'Seed',
          Industry_Funder_Type: 'Angel Investor',
          Project_Duration_Months: 8,
          SDG_AI: 'SDG 9',
          SDG_Alignment: 'SDG 12',
          Project_Status: 'Active',
          Funding_Rounds: 1,
          Investment_Amount: 500000,
          Valuation: 250000000,
          Number_of_Investors: 10,
          Country: 'USA',
          Year_Founded: 2021,
          Growth_Rate_Cent: 120.3,
        },
        {
          id: 'demo-3',
          Startup_ID: 'ST100002',
          Startup_Idea: 'Renewable Energy Storage System',
          Domain: 'Clean Energy',
          Startup_Stage: 'Series A',
          Industry_Funder_Type: 'Corporate Investor',
          Project_Duration_Months: 18,
          SDG_AI: 'SDG 7',
          SDG_Alignment: 'SDG 13',
          Project_Status: 'Active',
          Funding_Rounds: 3,
          Investment_Amount: 5000000,
          Valuation: 1200000000,
          Number_of_Investors: 25,
          Country: 'Sweden',
          Year_Founded: 2019,
          Growth_Rate_Cent: 85.7,
        }
      ];
      
      setStartups(demoStartups);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  // Get unique values for filters
  const uniqueDomains = Array.from(
    new Set(startups.map(s => s.Domain).filter(Boolean))
  ).sort();

  const uniqueStages = Array.from(
    new Set(startups.map(s => s.Startup_Stage).filter(Boolean))
  ).sort();

  const uniqueCountries = Array.from(
    new Set(startups.map(s => s.Country).filter(Boolean))
  ).sort();

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = searchQuery === '' || 
      startup.Startup_Idea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.Domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.Industry_Funder_Type?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = domainFilter === 'all' || startup.Domain === domainFilter;
    const matchesStage = stageFilter === 'all' || startup.Startup_Stage === stageFilter;
    const matchesCountry = countryFilter === 'all' || startup.Country === countryFilter;

    return matchesSearch && matchesDomain && matchesStage && matchesCountry;
  });

  // Calculate stats
  const totalValuation = startups.reduce((sum, s) => sum + (s.Valuation || 0), 0);
  const totalInvestment = startups.reduce((sum, s) => sum + (s.Investment_Amount || 0), 0);
  const avgGrowthRate = startups.length 
    ? startups.reduce((sum, s) => sum + (s.Growth_Rate_Cent || 0), 0) / startups.length 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: amount >= 1000000000 ? 'compact' : 'standard'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'funding':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'early revenue':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'seed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'series a':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'series b':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'growth':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleRefresh = async () => {
    await checkDatabaseConnection();
    if (connectionStatus === 'connected') {
      await fetchStartups();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
                  <li>Ensure the "startup" table exists in your database</li>
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

        {/* Header */}
        <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {connectionStatus === 'error' ? 'Demo Startup Portfolio' : 'Real-Time Startup Database'}
            </h1>
            <p className="text-muted-foreground">
              {connectionStatus === 'error' 
                ? 'Showing demo data. Connect to Supabase for live data.'
                : `Discover ${startups.length} startups from your database`
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Startups</p>
                  <p className="text-2xl font-bold text-foreground">{startups.length}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Active ventures</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Valuation</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalValuation)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Portfolio value</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Investment</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalInvestment)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Capital deployed</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Growth</p>
                  <p className="text-2xl font-bold text-foreground">
                    {avgGrowthRate.toFixed(1)}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">YoY growth</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Card */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search startups by name, domain, or industry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filter by:</span>
                </div>
                
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <SelectValue placeholder="All Domains" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {uniqueDomains.map(domain => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <SelectValue placeholder="All Stages" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {uniqueStages.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <SelectValue placeholder="All Countries" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active filters display */}
            {(searchQuery || domainFilter !== 'all' || stageFilter !== 'all' || countryFilter !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {domainFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Domain: {domainFilter}
                    <button onClick={() => setDomainFilter('all')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {stageFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Stage: {stageFilter}
                    <button onClick={() => setStageFilter('all')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {countryFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Country: {countryFilter}
                    <button onClick={() => setCountryFilter('all')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery('');
                    setDomainFilter('all');
                    setStageFilter('all');
                    setCountryFilter('all');
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredStartups.length} {filteredStartups.length === 1 ? 'Startup' : 'Startups'} Found
            <span className="text-muted-foreground font-normal text-sm ml-2">
              (out of {startups.length} total)
            </span>
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sorted by:</span>
              <span className="font-medium">Valuation (High to Low)</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Startups List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                      <div className="h-8 w-24 bg-muted rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStartups.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No startups found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || domainFilter !== 'all' || stageFilter !== 'all' || countryFilter !== 'all'
                  ? 'No startups match your current filters' 
                  : 'No startups found in the database. Add some data to get started.'}
              </p>
              {(searchQuery || domainFilter !== 'all' || stageFilter !== 'all' || countryFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setDomainFilter('all');
                    setStageFilter('all');
                    setCountryFilter('all');
                  }}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredStartups.map((startup, index) => (
              <Card 
                key={startup.id || startup.Startup_ID} 
                className="border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left Section - Startup Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {startup.Startup_Idea || 'Unnamed Startup'}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`${getStageColor(startup.Startup_Stage)}`}
                            >
                              {startup.Startup_Stage || 'N/A'}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(startup.Project_Status)}`}
                            >
                              {startup.Project_Status || 'N/A'}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                              <Building2 className="h-3 w-3" />
                              {startup.Domain || 'N/A'}
                            </Badge>
                            <Badge variant="secondary" className="gap-1 bg-green-50 text-green-700 border-green-200">
                              <Target className="h-3 w-3" />
                              {startup.Industry_Funder_Type || 'N/A'}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {startup.Country || 'Global'}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {startup.Year_Founded || 'N/A'}
                            </span>
                          </div>

                          {/* Additional Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">SDG:</span>
                              <span className="font-medium">{startup.SDG_Alignment || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Investors:</span>
                              <span className="font-medium">{startup.Number_of_Investors || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="font-medium">{startup.Project_Duration_Months || 0} months</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Financials & Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-2xl font-bold text-foreground">
                            {formatCurrency(startup.Valuation || 0)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Valuation</p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {formatCurrency(startup.Investment_Amount || 0)}
                            </p>
                            <p className="text-xs text-muted-foreground">Investment</p>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {startup.Funding_Rounds || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Rounds</p>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground text-green-600">
                              {startup.Growth_Rate_Cent?.toFixed(1) || '0.0'}%
                            </p>
                            <p className="text-xs text-muted-foreground">Growth</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            console.log('View details for:', startup.Startup_ID);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-accent text-accent-foreground hover:opacity-90 gap-2"
                          onClick={() => {
                            console.log('Invest in:', startup.Startup_Idea);
                          }}
                        >
                          <DollarSign className="h-4 w-4" />
                          Invest
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Database Info Footer */}
        <Card className="bg-muted/30 border-border/50 mt-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Database:</span>
                <span className="font-medium">{startups.length} records</span>
                <span className="text-muted-foreground">in</span>
                <code className="px-2 py-1 rounded bg-muted text-xs">public.startup</code>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Real-time updates: <span className="text-green-600 font-medium">Enabled</span>
                </span>
                <div className="h-4 w-px bg-border" />
                <span className="text-muted-foreground">
                  Connection: <span className="text-green-600 font-medium">Active</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}