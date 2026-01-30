import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Building2, 
  Users, 
  Calendar,
  ExternalLink,
  Plus,
  ArrowRight,
  Trash2,
  X,
  Search,
  Filter,
  Loader2,
  Database,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  User,
  Copy,
  FileText,
  Tag,
  Hash,
  Shield,
  Check,
  Eye,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

// Define the EscrowRequest interface based on database
interface EscrowRequest {
  id: string;
  startup_id: string;
  startup_name: string;
  startup_idea: string;
  domain: string;
  funding_amount: number;
  escrow_percentage: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  description: string;
  created_at: string;
  updated_at: string;
  contact_email: string;
  contact_phone?: string;
  country: string;
  requested_by: string;
  unique_token?: string;
}

const formSchema = z.object({
  startup_name: z.string().min(2, 'Startup name must be at least 2 characters'),
  startup_idea: z.string().min(10, 'Startup idea must be at least 10 characters'),
  domain: z.string().min(2, 'Domain is required'),
  funding_amount: z.number().min(1000, 'Minimum funding amount is $1,000'),
  escrow_percentage: z.number().min(1, 'Minimum escrow percentage is 1%').max(100, 'Maximum escrow percentage is 100%'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  requested_by: z.string().min(2, 'Your name is required'),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function Escrow() {
  const [requests, setRequests] = useState<EscrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  
  // State for the popup
  const [selectedRequest, setSelectedRequest] = useState<EscrowRequest | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      escrow_percentage: 20,
      country: 'USA',
    },
  });

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  // Fetch requests when connected
  useEffect(() => {
    if (connectionStatus === 'connected') {
      fetchRequests();
    }
  }, [connectionStatus]);

  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      console.log('🔍 Checking database connection to escrow_requests table...');
      
      const { data, error } = await supabase
        .from('escrow_requests')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('❌ Database connection error:', error);
        setConnectionError(error.message);
        setConnectionStatus('error');
        return;
      }
      
      console.log('✅ Database connection successful');
      setConnectionError(null);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('❌ Failed to connect to database:', error);
      setConnectionError(error.message || 'Unknown connection error');
      setConnectionStatus('error');
    }
  };

  // Fetch escrow requests from database
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setConnectionError(null);
      
      console.log('📥 Fetching escrow requests...');
      
      const { data, error } = await supabase
        .from('escrow_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching escrow requests:', error);
        throw error;
      }

      console.log('✅ Fetched data:', data);

      if (data) {
        const transformedData: EscrowRequest[] = data.map((item: any) => ({
          id: item.id,
          startup_id: item.startup_id || '',
          startup_name: item.startup_name,
          startup_idea: item.startup_idea,
          domain: item.domain || 'General',
          funding_amount: Number(item.funding_amount) || 0,
          escrow_percentage: Number(item.escrow_percentage) || 20,
          status: item.status || 'pending',
          description: item.description || '',
          created_at: item.created_at,
          updated_at: item.updated_at || item.created_at,
          contact_email: item.contact_email,
          contact_phone: item.contact_phone,
          country: item.country || 'Global',
          requested_by: item.requested_by,
          unique_token: item.unique_token || '',
        }));
        
        setRequests(transformedData);
      }
    } catch (error: any) {
      console.error('❌ Full error:', error);
      setConnectionError(`Database Error: ${error?.message || 'Unknown error'}`);
      setConnectionStatus('error');
      
      toast.error('Failed to fetch escrow requests. Using demo data.');
      
      // Demo data as fallback
      const demoRequests: EscrowRequest[] = [
        {
          id: 'demo-1',
          startup_id: 'ST100001',
          startup_name: 'AI HealthTech Solutions',
          startup_idea: 'AI-powered diagnostic tool for early disease detection',
          domain: 'Healthcare',
          funding_amount: 500000,
          escrow_percentage: 25,
          status: 'pending',
          description: 'Requesting escrow-based funding for product development milestones',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          contact_email: 'contact@aihealthtech.com',
          contact_phone: '+1 (555) 123-4567',
          country: 'USA',
          requested_by: 'John Smith',
          unique_token: 'ESC-20240130-ABC123',
        },
        {
          id: 'demo-2',
          startup_id: 'ST100002',
          startup_name: 'Green Energy Innovations',
          startup_idea: 'Advanced solar panel technology with 40% higher efficiency',
          domain: 'Clean Energy',
          funding_amount: 750000,
          escrow_percentage: 30,
          status: 'approved',
          description: 'Seeking milestone-based funding for manufacturing setup',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          contact_email: 'info@greenenergy.com',
          country: 'Germany',
          requested_by: 'Maria Schmidt',
          unique_token: 'ESC-20240130-DEF456',
        },
      ];
      
      setRequests(demoRequests);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Submit new escrow request
  const onSubmit = async (data: FormData) => {
    try {
      console.log('📝 Submitting escrow request:', data);
      
      const { error } = await supabase
        .from('escrow_requests')
        .insert({
          startup_name: data.startup_name,
          startup_idea: data.startup_idea,
          domain: data.domain,
          funding_amount: data.funding_amount,
          escrow_percentage: data.escrow_percentage,
          status: 'pending',
          description: data.description,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          country: data.country,
          requested_by: data.requested_by,
        });

      if (error) {
        console.error('❌ Error inserting data:', error);
        throw error;
      }

      toast.success('Escrow request submitted successfully! A unique token has been generated for your request.');
      reset();
      setActiveTab('view');
      fetchRequests(); // Refresh the list
      
    } catch (error: any) {
      console.error('❌ Submission error:', error);
      toast.error(`Failed to submit request: ${error.message}`);
    }
  };

  // View detailed startup information
  const viewStartupDetails = (request: EscrowRequest) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };

  // Copy token to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Token copied to clipboard!');
  };

  // Get unique domains for filter
  const uniqueDomains = Array.from(new Set(requests.map(r => r.domain).filter(Boolean))).sort();

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchQuery === '' || 
      request.startup_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.startup_idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDomain = domainFilter === 'all' || request.domain === domainFilter;

    return matchesSearch && matchesStatus && matchesDomain;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4" />;
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
            <AlertCircle className="w-3 h-3 mr-1" />
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

  const handleRefresh = () => {
    checkDatabaseConnection();
    if (connectionStatus === 'connected') {
      fetchRequests();
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
                <p className="font-semibold">Make sure you have:</p>
                <ol className="list-decimal pl-4 space-y-1 mt-1">
                  <li>Created the "escrow_requests" table using the SQL provided</li>
                  <li>Added the unique_token column to the table</li>
                  <li>Enabled RLS policies if needed</li>
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
              {connectionStatus === 'error' ? 'Demo Escrow Requests' : 'Escrow Request Management'}
            </h1>
            <p className="text-muted-foreground">
              {connectionStatus === 'error' 
                ? 'Showing demo data. Connect to Supabase for live database.'
                : `Manage ${requests.length} escrow funding requests`
              }
            </p>
          </div>
          
          <div className="flex gap-2">
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
            <Button 
              className="bg-accent hover:bg-accent/90 gap-2"
              onClick={() => setActiveTab('create')}
            >
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="view">View Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="create">Create Request</TabsTrigger>
          </TabsList>

          {/* View Requests Tab */}
          <TabsContent value="view" className="space-y-6">
            {/* Filters Card */}
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="w-full lg:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests by startup name, idea, or domain..."
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
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <SelectValue placeholder="All Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={domainFilter} onValueChange={setDomainFilter}>
                      <SelectTrigger className="w-[160px]">
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'Request' : 'Requests'} Found
                <span className="text-muted-foreground font-normal text-sm ml-2">
                  (out of {requests.length} total)
                </span>
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>Table: escrow_requests</span>
                <span>•</span>
                <span>Real-time: {connectionStatus === 'connected' ? 'Enabled' : 'Demo'}</span>
              </div>
            </div>

            {/* Requests List */}
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
            ) : filteredRequests.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No requests found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || statusFilter !== 'all' || domainFilter !== 'all'
                      ? 'No requests match your current filters' 
                      : 'No escrow requests found. Create one to get started.'}
                  </p>
                  {(searchQuery || statusFilter !== 'all' || domainFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setDomainFilter('all');
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
                {filteredRequests.map((request) => (
                  <Card 
                    key={request.id} 
                    className="border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Left Section - Request Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm">
                              <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-foreground">
                                  {request.startup_name}
                                </h3>
                                <Badge variant="outline" className={`${getStatusColor(request.status)}`}>
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(request.status)}
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </span>
                                </Badge>
                                {request.unique_token && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {request.unique_token}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-muted-foreground mb-3 line-clamp-2">{request.startup_idea}</p>
                              
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                                  <Building2 className="h-3 w-3" />
                                  {request.domain}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {request.country}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {request.requested_by}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(request.created_at)}
                                </span>
                              </div>

                              {/* Contact Info */}
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Email:</span>
                                  <a 
                                    href={`mailto:${request.contact_email}`} 
                                    className="font-medium hover:text-primary hover:underline"
                                  >
                                    {request.contact_email}
                                  </a>
                                </div>
                                {request.contact_phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{request.contact_phone}</span>
                                  </div>
                                )}
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
                                {formatCurrency(request.funding_amount)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Funding Amount</p>
                            
                            <div className="flex items-center gap-4 mt-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-foreground">
                                  {request.escrow_percentage}%
                                </p>
                                <p className="text-xs text-muted-foreground">Escrow %</p>
                              </div>
                              <div className="h-8 w-px bg-border" />
                              <div className="text-right">
                                <p className="text-sm font-medium text-foreground text-green-600">
                                  {formatCurrency(request.funding_amount * (request.escrow_percentage / 100))}
                                </p>
                                <p className="text-xs text-muted-foreground">Escrow Amount</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-2"
                              onClick={() => viewStartupDetails(request)}
                            >
                              <Eye className="h-4 w-4" />
                              Details
                            </Button>
                            
                            <Button 
                              size="sm" 
                              className="bg-gradient-accent text-accent-foreground hover:opacity-90 gap-2"
                              onClick={() => {
                                toast.info(`Action triggered for ${request.startup_name}`);
                              }}
                            >
                              <ArrowRight className="h-4 w-4" />
                              Take Action
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Database Info */}
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Database:</span>
                    <span className="font-medium">{requests.length} records</span>
                    <span className="text-muted-foreground">in</span>
                    <code className="px-2 py-1 rounded bg-muted text-xs">public.escrow_requests</code>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      Last updated: <span className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Request Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Create Escrow Request</CardTitle>
                    <CardDescription>
                      Submit a request for escrow-based funding. Funds will be held in escrow and released upon milestone completion.
                      A unique token will be automatically generated for your request.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      reset();
                      setActiveTab('view');
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Token Information */}
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800">Unique Token Generation</h4>
                          <p className="text-sm text-purple-600">
                            After submission, a unique escrow token (e.g., ESC-20240130-ABC123) will be automatically generated and stored in the database.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Startup Information Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Startup Information</CardTitle>
                      <CardDescription>
                        Basic information about your startup
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startup_name">Startup Name *</Label>
                          <Input
                            id="startup_name"
                            placeholder="e.g., Tech Innovations Inc."
                            {...register('startup_name')}
                          />
                          {errors.startup_name && (
                            <p className="text-sm text-red-500">{errors.startup_name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="domain">Domain/Industry *</Label>
                          <Input
                            id="domain"
                            placeholder="e.g., Healthcare, FinTech, Clean Energy"
                            {...register('domain')}
                          />
                          {errors.domain && (
                            <p className="text-sm text-red-500">{errors.domain.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="startup_idea">Startup Idea/Description *</Label>
                        <Textarea
                          id="startup_idea"
                          placeholder="Briefly describe your startup idea, problem you're solving, and solution..."
                          rows={3}
                          {...register('startup_idea')}
                        />
                        {errors.startup_idea && (
                          <p className="text-sm text-red-500">{errors.startup_idea.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Funding Details Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Funding Details</CardTitle>
                      <CardDescription>
                        Specify funding requirements and escrow terms
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="funding_amount">Funding Amount ($) *</Label>
                          <Input
                            id="funding_amount"
                            type="number"
                            min="1000"
                            placeholder="50000"
                            {...register('funding_amount', { valueAsNumber: true })}
                          />
                          {errors.funding_amount && (
                            <p className="text-sm text-red-500">{errors.funding_amount.message}</p>
                          )}
                          <p className="text-xs text-muted-foreground">Minimum: $1,000</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="escrow_percentage">Escrow Percentage (%) *</Label>
                          <Input
                            id="escrow_percentage"
                            type="number"
                            min="1"
                            max="100"
                            placeholder="20"
                            {...register('escrow_percentage', { valueAsNumber: true })}
                          />
                          {errors.escrow_percentage && (
                            <p className="text-sm text-red-500">{errors.escrow_percentage.message}</p>
                          )}
                          <p className="text-xs text-muted-foreground">Recommended: 20-40%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Project Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your project in detail, including milestones, timeline, and how funds will be used..."
                          rows={4}
                          {...register('description')}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        How funders can contact you
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="requested_by">Your Name *</Label>
                          <Input
                            id="requested_by"
                            placeholder="John Doe"
                            {...register('requested_by')}
                          />
                          {errors.requested_by && (
                            <p className="text-sm text-red-500">{errors.requested_by.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact_email">Email Address *</Label>
                          <Input
                            id="contact_email"
                            type="email"
                            placeholder="john@example.com"
                            {...register('contact_email')}
                          />
                          {errors.contact_email && (
                            <p className="text-sm text-red-500">{errors.contact_email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_phone">Phone Number (Optional)</Label>
                          <Input
                            id="contact_phone"
                            placeholder="+1 (555) 123-4567"
                            {...register('contact_phone')}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            placeholder="USA"
                            {...register('country')}
                          />
                          {errors.country && (
                            <p className="text-sm text-red-500">{errors.country.message}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Terms and Submission Card */}
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          {...register('terms_accepted')}
                        />
                        <Label htmlFor="terms" className="text-sm leading-tight">
                          I agree to the terms and conditions. I understand that:
                          <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                            <li>Funds will be held in escrow and released only upon milestone completion</li>
                            <li>Milestones and deliverables must be agreed upon before funding</li>
                            <li>Funder approval is required for each milestone release</li>
                            <li>All information provided is accurate and truthful</li>
                            <li>A unique escrow token will be generated and stored in the database</li>
                          </ul>
                        </Label>
                      </div>
                      {errors.terms_accepted && (
                        <p className="text-sm text-red-500">{errors.terms_accepted.message}</p>
                      )}

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-accent hover:bg-accent/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Escrow Request'
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            reset();
                            setActiveTab('view');
                          }}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Your request will be reviewed within 2-3 business days. A unique escrow token will be generated automatically.
                      </p>
                    </CardContent>
                  </Card>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* SIMPLE CUTE POPUP DIALOG 
        Placed outside the map loop for efficiency.
      */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        {selectedRequest && (
          <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-white">
            
            {/* Header: Gradient & Icon */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative">
              <div className="absolute top-4 right-4">
                 <button 
                  onClick={() => setDetailsDialogOpen(false)} 
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                  <Building2 className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
                    {selectedRequest.startup_name}
                   </h2>
                   <div className="flex items-center gap-2 text-indigo-100 text-xs font-medium mt-1">
                      <Globe className="w-3 h-3" /> {selectedRequest.country}
                   </div>
                </div>
              </div>

              {/* Status Badge Overlap */}
              <div className="absolute -bottom-3 right-6">
                 <Badge className={`${getStatusColor(selectedRequest.status)} shadow-sm border`}>
                    {selectedRequest.status.toUpperCase()}
                 </Badge>
              </div>
            </div>

            {/* Body Content */}
            <div className="px-6 pt-8 pb-6 space-y-6">
              
              {/* Token Display */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    <span>Token ID</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <code className="text-xs font-mono font-bold text-slate-700">
                      {selectedRequest.unique_token || 'N/A'}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(selectedRequest.unique_token || '')}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                 </div>
              </div>

              {/* The "Idea" Card */}
              <div className="space-y-2">
                 <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Startup Concept
                 </h4>
                 <p className="text-sm text-slate-600 leading-relaxed bg-white">
                    {selectedRequest.startup_idea}
                 </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Total Funding</span>
                    <span className="text-lg font-bold text-emerald-900">
                      {formatCurrency(selectedRequest.funding_amount)}
                    </span>
                 </div>
                 <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Escrow</span>
                    <span className="text-lg font-bold text-blue-900">
                      {selectedRequest.escrow_percentage}%
                    </span>
                 </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between gap-3">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">Requested by</span>
                    <span className="text-xs font-medium text-slate-800">{selectedRequest.requested_by}</span>
                 </div>
                 <Button 
                   className="rounded-full bg-slate-900 text-white shadow-lg shadow-slate-200 hover:shadow-xl hover:bg-slate-800 transition-all px-6"
                   onClick={() => toast.info('Connecting you with the founder...')}
                 >
                    Contact Founder
                 </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

    </div>
  );
}