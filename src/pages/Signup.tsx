import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Zap, Mail, Lock, User, ArrowRight, Loader2, Briefcase } from "lucide-react";
import { supabase } from "@/client";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "innovator",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role,
          },
        },
      });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      console.error("Error signing up:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-cta flex items-center justify-center mx-auto mb-8">
            <Zap className="w-9 h-9 text-cta-foreground" />
          </div>
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            NexusR&D
          </h1>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Join thousands of innovators and funders transforming R&D through 
            smart contract-powered collaboration.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary-foreground">$2.4B+</p>
              <p className="text-sm text-primary-foreground/70">Funding Deployed</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary-foreground">12,000+</p>
              <p className="text-sm text-primary-foreground/70">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-cta flex items-center justify-center">
              <Zap className="w-6 h-6 text-cta-foreground" />
            </div>
            <span className="font-display font-bold text-xl">NexusR&D</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Create your account
          </h2>
          <p className="text-muted-foreground mb-8">
            Start matching with funders or discover innovations
          </p>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>I am a</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                className="grid grid-cols-2 gap-4"
              >
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === "innovator"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <RadioGroupItem value="innovator" id="innovator" className="sr-only" />
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Innovator</p>
                    <p className="text-xs text-muted-foreground">Seeking funding</p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === "funder"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <RadioGroupItem value="funder" id="funder" className="sr-only" />
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Funder</p>
                    <p className="text-xs text-muted-foreground">Investing in R&D</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11"
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-cta text-cta-foreground hover:opacity-90 py-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-accent hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-accent hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
