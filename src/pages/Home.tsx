import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign,
  Building2,
  Users,
  Globe,
  Activity,
  Target,
  Clock,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface DomainPerformance {
  id: string;
  name: string;
  growthRate: number;
  marketShare: number;
  activeStartups: number;
  fundingAmount: number;
  trend: 'up' | 'down' | 'stable';
  topPerformer: string;
}

interface StockPerformance {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  sector: string;
}

export default function AdminDashboard() {
  const [domains, setDomains] = useState<DomainPerformance[]>([]);
  const [stocks, setStocks] = useState<StockPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'today' | 'week' | 'month'>('today');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real implementation, fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for domains
      const domainsData: DomainPerformance[] = [
        {
          id: '1',
          name: 'Artificial Intelligence',
          growthRate: 28.5,
          marketShare: 18.2,
          activeStartups: 1245,
          fundingAmount: 8500000000,
          trend: 'up',
          topPerformer: 'DeepMind Analytics'
        },
        {
          id: '2',
          name: 'FinTech',
          growthRate: 22.3,
          marketShare: 15.8,
          activeStartups: 892,
          fundingAmount: 6200000000,
          trend: 'up',
          topPerformer: 'BlockChain Pay'
        },
        {
          id: '3',
          name: 'Clean Energy',
          growthRate: 31.7,
          marketShare: 12.4,
          activeStartups: 567,
          fundingAmount: 4500000000,
          trend: 'up',
          topPerformer: 'SolarMax Tech'
        },
        {
          id: '4',
          name: 'HealthTech',
          growthRate: 19.8,
          marketShare: 14.6,
          activeStartups: 734,
          fundingAmount: 3800000000,
          trend: 'stable',
          topPerformer: 'MediAI Solutions'
        },
        {
          id: '5',
          name: 'EdTech',
          growthRate: 15.4,
          marketShare: 8.9,
          activeStartups: 456,
          fundingAmount: 2100000000,
          trend: 'up',
          topPerformer: 'LearnSphere'
        },
        {
          id: '6',
          name: 'AgriTech',
          growthRate: 34.2,
          marketShare: 6.3,
          activeStartups: 289,
          fundingAmount: 1800000000,
          trend: 'up',
          topPerformer: 'FarmBot Systems'
        },
        {
          id: '7',
          name: 'E-Commerce',
          growthRate: 12.8,
          marketShare: 21.5,
          activeStartups: 1023,
          fundingAmount: 7200000000,
          trend: 'stable',
          topPerformer: 'QuickShop Global'
        },
        {
          id: '8',
          name: 'Biotechnology',
          growthRate: 25.9,
          marketShare: 9.7,
          activeStartups: 378,
          fundingAmount: 5500000000,
          trend: 'up',
          topPerformer: 'GeneEdit Corp'
        }
      ];

      // Mock data for stocks
      const stocksData: StockPerformance[] = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 187.25, change: 2.45, changePercent: 1.32, volume: 48500000, sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft', price: 415.86, change: 8.32, changePercent: 2.04, volume: 32500000, sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet', price: 172.34, change: 3.21, changePercent: 1.90, volume: 28500000, sector: 'Technology' },
        { symbol: 'TSLA', name: 'Tesla', price: 245.67, change: -5.43, changePercent: -2.16, volume: 125000000, sector: 'Automotive' },
        { symbol: 'NVDA', name: 'NVIDIA', price: 950.02, change: 32.45, changePercent: 3.54, volume: 65000000, sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon', price: 178.89, change: 2.67, changePercent: 1.51, volume: 42500000, sector: 'E-Commerce' },
        { symbol: 'META', name: 'Meta', price: 485.75, change: 12.34, changePercent: 2.61, volume: 28500000, sector: 'Technology' },
        { symbol: 'JPM', name: 'JPMorgan', price: 195.43, change: 1.23, changePercent: 0.63, volume: 12500000, sector: 'Financial' }
      ];

      setDomains(domainsData);
      setStocks(stocksData);
      setLastUpdated(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000000 ? 'compact' : 'standard',
      minimumFractionDigits: 0,
      maximumFractionDigits: amount >= 1000000000 ? 1 : 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 20) return 'text-green-600';
    if (growth >= 10) return 'text-blue-600';
    if (growth >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  // Calculate overall metrics
  const totalGrowthRate = domains.length ? 
    domains.reduce((sum, d) => sum + d.growthRate, 0) / domains.length : 0;
  
  const totalStartups = domains.reduce((sum, d) => sum + d.activeStartups, 0);
  const totalFunding = domains.reduce((sum, d) => sum + d.fundingAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-muted-foreground">
                Comparative Domain Analysis & Real-time Market Intelligence
              </p>
              <Badge variant="outline" className="gap-2">
                <Activity className="h-3 w-3" />
                Live Updates
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium text-foreground">
                {lastUpdated || '--:--:--'}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchDashboardData}
              disabled={loading}
              className="rounded-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex items-center gap-4">
          <Tabs value={timeFrame} onValueChange={(v) => setTimeFrame(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="today" className="gap-2">
                <Clock className="h-4 w-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="week" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                This Week
              </TabsTrigger>
              <TabsTrigger value="month" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                This Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Growth Rate</p>
                  <p className={`text-2xl font-bold ${getGrowthColor(totalGrowthRate)}`}>
                    {totalGrowthRate.toFixed(1)}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-muted-foreground">Across all domains</span>
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Startups</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(totalStartups)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Total ventures</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Funding</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalFunding)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Capital deployed</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Domains Tracked</p>
                  <p className="text-2xl font-bold text-foreground">{domains.length}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Industry sectors</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Domain Performance Table */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Comparative Domain Analysis
              </CardTitle>
              <CardDescription>
                Performance metrics across key industry sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <div className="col-span-4">Domain</div>
                    <div className="col-span-2">Growth Rate</div>
                    <div className="col-span-2">Market Share</div>
                    <div className="col-span-2">Startups</div>
                    <div className="col-span-2">Trend</div>
                  </div>
                  
                  {domains.map((domain) => (
                    <div key={domain.id} className="grid grid-cols-12 gap-4 items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="col-span-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                            <Target className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{domain.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {domain.topPerformer}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${getGrowthColor(domain.growthRate)}`}>
                            {domain.growthRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{domain.marketShare.toFixed(1)}%</span>
                          </div>
                          <Progress value={domain.marketShare} className="h-1.5" />
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatNumber(domain.activeStartups)}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(domain.trend)}
                          <Badge 
                            variant="outline" 
                            className={`${
                              domain.trend === 'up' ? 'bg-green-50 text-green-700 border-green-200' :
                              domain.trend === 'down' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {domain.trend.charAt(0).toUpperCase() + domain.trend.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Performance */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Today's Stock Performance
              </CardTitle>
              <CardDescription>
                Real-time market movements & trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {stocks.map((stock) => (
                    <div key={stock.symbol} className="p-3 border rounded-lg hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{stock.symbol}</p>
                            <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {stock.sector}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-foreground">
                            ${stock.price.toFixed(2)}
                          </p>
                          <div className={`flex items-center gap-1 text-sm ${getChangeColor(stock.change)}`}>
                            {getChangeIcon(stock.change)}
                            <span>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                              ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-muted-foreground">
                          <p>Volume</p>
                          <p className="font-medium">
                            {(stock.volume / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Growth Insights */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Growth Insights & Trends
            </CardTitle>
            <CardDescription>
              Key performance indicators and market opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-32 bg-muted animate-pulse rounded-lg" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Top Performing Domains</h4>
                  {domains
                    .filter(d => d.growthRate >= 25)
                    .map(domain => (
                      <div key={domain.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">{domain.name}</span>
                        <Badge className="bg-green-600">
                          {domain.growthRate.toFixed(1)}%
                        </Badge>
                      </div>
                    ))
                  }
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Highest Funded Sectors</h4>
                  {domains
                    .sort((a, b) => b.fundingAmount - a.fundingAmount)
                    .slice(0, 3)
                    .map(domain => (
                      <div key={domain.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">{domain.name}</span>
                        <span className="font-bold text-blue-700">
                          {formatCurrency(domain.fundingAmount)}
                        </span>
                      </div>
                    ))
                  }
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Market Leaders</h4>
                  {domains
                    .sort((a, b) => b.marketShare - a.marketShare)
                    .slice(0, 3)
                    .map(domain => (
                      <div key={domain.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">{domain.name}</span>
                        <span className="font-bold text-purple-700">
                          {domain.marketShare.toFixed(1)}%
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card className="bg-muted/30 border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Dashboard Status:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
                  Live & Synced
                </Badge>
                <span className="text-muted-foreground">• Last refresh: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Data Sources: <span className="font-medium">8 domains, {stocks.length} stocks</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}