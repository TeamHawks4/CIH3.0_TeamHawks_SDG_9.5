import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Plus, ArrowRight, Trash2, Calendar, X } from 'lucide-react';
import type { EscrowGrantRequest } from '@/types/database';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  founder_name: z.string().min(2, 'Founder name is required'),
  founder_email: z.string().email('Invalid email address'),
  funder_name: z.string().min(2, 'Funder name is required'),
  funder_email: z.string().email('Invalid email address'),
  total_amount: z.number().min(100, 'Minimum amount is $100'),
  currency: z.string().default('USD'),
  wallet_address: z.string().min(10, 'Valid wallet address is required'),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  milestones: z.array(
    z.object({
      title: z.string().min(3, 'Milestone title is required'),
      description: z.string().min(10, 'Description is required'),
      amount: z.number().min(1, 'Amount must be positive'),
      due_date: z.string().optional(),
      deliverables: z.array(z.string()).min(1, 'At least one deliverable is required'),
    })
  ).min(1, 'At least one milestone is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function Escrow() {
  const [grants, setGrants] = useState<EscrowGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('view');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: 'USD',
      milestones: [
        {
          title: '',
          description: '',
          amount: 0,
          due_date: '',
          deliverables: [''],
        },
      ],
    },
  });

  const milestones = watch('milestones');
  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);

  useEffect(() => {
    fetchGrants();
  }, []);

  async function fetchGrants() {
    setLoading(true);
    const { data, error } = await supabase
      .from('escrow_grants')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGrants(data);
    }
    setLoading(false);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMilestoneColor = (index: number, completed: number) => {
    if (index < completed) return 'bg-success';
    if (index === completed) return 'bg-warning';
    return 'bg-muted';
  };

  const addMilestone = () => {
    setValue('milestones', [
      ...milestones,
      {
        title: '',
        description: '',
        amount: 0,
        due_date: '',
        deliverables: [''],
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      const updated = [...milestones];
      updated.splice(index, 1);
      setValue('milestones', updated);
    }
  };

  const addDeliverable = (milestoneIndex: number) => {
    const updated = [...milestones];
    updated[milestoneIndex].deliverables.push('');
    setValue('milestones', updated);
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    const updated = [...milestones];
    updated[milestoneIndex].deliverables.splice(deliverableIndex, 1);
    setValue('milestones', updated);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const requestData = {
        ...data,
        total_milestones: data.milestones.length,
        user_id: user?.id,
        status: 'pending',
      };

      const { error } = await supabase
        .from('escrow_grant_requests')
        .insert(requestData);

      if (error) throw error;

      toast.success('Escrow grant request submitted successfully!');
      
      // Reset form and switch to view tab
      reset();
      setActiveTab('view');
      
      // Refresh grants list
      fetchGrants();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setActiveTab('view');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Smart Escrow</h1>
          <p className="text-muted-foreground">
            Milestone-based funding with automatic smart contract releases
          </p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 gap-2"
          onClick={() => setActiveTab('create')}
        >
          <Plus className="h-4 w-4" />
          Create Grant Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="view">View Grants</TabsTrigger>
          <TabsTrigger value="create">Create Request</TabsTrigger>
        </TabsList>

        {/* View Grants Tab */}
        <TabsContent value="view" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : grants.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No escrow grants yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first milestone-based funding grant.
                </p>
                <Button 
                  className="bg-accent hover:bg-accent/90"
                  onClick={() => setActiveTab('create')}
                >
                  Create Grant Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {grants.map((grant) => (
                <Card key={grant.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{grant.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {grant.founder_name} • Funded by {grant.funder_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(grant.released_amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          of {formatCurrency(grant.total_amount)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-navy"
                          style={{ width: `${(grant.released_amount / grant.total_amount) * 100}%` }}
                        />
                      </div>
                      
                      {/* Milestone Progress */}
                      <div className="flex gap-1">
                        {Array.from({ length: grant.total_milestones }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-2 rounded ${getMilestoneColor(i, grant.completed_milestones)}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-muted-foreground">
                        {grant.completed_milestones} of {grant.total_milestones} milestones complete
                      </p>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create Request Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create Escrow Grant Request</CardTitle>
                  <CardDescription>
                    Submit a request for milestone-based funding with smart contract escrow
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Project Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>
                          Provide information about your project
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Project Title *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., AI-Powered Marketing Platform"
                            {...register('title')}
                          />
                          {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Project Description *</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your project, goals, and expected outcomes..."
                            rows={4}
                            {...register('description')}
                          />
                          {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="founder_name">Your Name *</Label>
                            <Input
                              id="founder_name"
                              placeholder="John Doe"
                              {...register('founder_name')}
                            />
                            {errors.founder_name && (
                              <p className="text-sm text-red-500">{errors.founder_name.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="founder_email">Your Email *</Label>
                            <Input
                              id="founder_email"
                              type="email"
                              placeholder="john@example.com"
                              {...register('founder_email')}
                            />
                            {errors.founder_email && (
                              <p className="text-sm text-red-500">{errors.founder_email.message}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Milestones */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Milestones</CardTitle>
                            <CardDescription>
                              Define project milestones with deliverables and funding amounts
                            </CardDescription>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMilestone}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add Milestone
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {milestones.map((_, milestoneIndex) => (
                          <div key={milestoneIndex} className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">Milestone {milestoneIndex + 1}</h3>
                              {milestones.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMilestone(milestoneIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Milestone Title *</Label>
                              <Input
                                placeholder="e.g., MVP Development"
                                {...register(`milestones.${milestoneIndex}.title`)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Description *</Label>
                              <Textarea
                                placeholder="Describe what this milestone will achieve..."
                                {...register(`milestones.${milestoneIndex}.description`)}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Amount ($) *</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="5000"
                                  {...register(`milestones.${milestoneIndex}.amount`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Due Date (Optional)</Label>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="date"
                                    className="pl-10"
                                    {...register(`milestones.${milestoneIndex}.due_date`)}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Deliverables */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Deliverables *</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addDeliverable(milestoneIndex)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Deliverable
                                </Button>
                              </div>
                              
                              {milestones[milestoneIndex].deliverables.map((_, deliverableIndex) => (
                                <div key={deliverableIndex} className="flex items-center gap-2">
                                  <Input
                                    placeholder={`Deliverable ${deliverableIndex + 1}`}
                                    {...register(`milestones.${milestoneIndex}.deliverables.${deliverableIndex}`)}
                                  />
                                  {milestones[milestoneIndex].deliverables.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeDeliverable(milestoneIndex, deliverableIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {errors.milestones && (
                          <p className="text-sm text-red-500">{errors.milestones.message}</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Funding & Submission */}
                  <div className="space-y-6">
                    {/* Funder Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Funder Information</CardTitle>
                        <CardDescription>
                          Details about the funding party
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="funder_name">Funder Name *</Label>
                          <Input
                            id="funder_name"
                            placeholder="Funding Organization Name"
                            {...register('funder_name')}
                          />
                          {errors.funder_name && (
                            <p className="text-sm text-red-500">{errors.funder_name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="funder_email">Funder Email *</Label>
                          <Input
                            id="funder_email"
                            type="email"
                            placeholder="funding@example.com"
                            {...register('funder_email')}
                          />
                          {errors.funder_email && (
                            <p className="text-sm text-red-500">{errors.funder_email.message}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Funding Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Funding Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wallet_address">Wallet Address *</Label>
                          <Input
                            id="wallet_address"
                            placeholder="0x..."
                            {...register('wallet_address')}
                          />
                          {errors.wallet_address && (
                            <p className="text-sm text-red-500">{errors.wallet_address.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Total Funding Amount</Label>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {milestones.length} milestones
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Terms & Submit */}
                    <Card>
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            {...register('terms_accepted')}
                          />
                          <Label htmlFor="terms" className="text-sm leading-tight">
                            I agree to the terms and conditions. I understand that funds will be 
                            released only upon milestone completion and approval by the funder.
                          </Label>
                        </div>
                        {errors.terms_accepted && (
                          <p className="text-sm text-red-500">{errors.terms_accepted.message}</p>
                        )}

                        <Button
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90"
                          disabled={loading}
                        >
                          {loading ? 'Submitting...' : 'Submit Grant Request'}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          Your request will be reviewed and you'll be notified via email.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}