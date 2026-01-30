export type AppRole = 'admin' | 'founder' | 'investor';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  organization: string | null;
  website: string | null;
  bio: string | null;
  reputation_score: number;
  completed_projects: number;
  on_time_delivery: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Sector {
  id: string;
  name: string;
  icon: string | null;
  project_count: number;
  growth_rate: number;
  created_at: string;
}

export interface Investor {
  id: string;
  uid: string;
  name: string;
  profile: string;
  domain: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Startup {
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
  updated_at?: string;
}

export type EscrowGrantRequest = {
  id: string;
  title: string;
  description: string;
  founder_name: string;
  founder_email: string;
  funder_name: string;
  funder_email: string;
  total_amount: number;
  total_milestones: number;
  currency: string;
  milestones: Milestone[];
  wallet_address: string;
  terms_accepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  amount: number;
  due_date?: string;
  deliverables: string[];
};

export interface UserTag {
  id: string;
  user_id: string;
  tag: string;
  created_at: string;
}
