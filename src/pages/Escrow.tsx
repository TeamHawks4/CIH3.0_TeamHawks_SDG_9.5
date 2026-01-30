import { useState } from "react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText,
  Upload,
  AlertCircle,
  ArrowRight,
  Wallet
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: "pending" | "submitted" | "approved" | "rejected";
  dueDate: string;
  proofUrl?: string;
}

interface Grant {
  id: string;
  title: string;
  innovator: string;
  funder: string;
  totalAmount: number;
  releasedAmount: number;
  milestones: Milestone[];
  createdAt: string;
}

const mockGrants: Grant[] = [
  {
    id: "1",
    title: "Water Purification Nano-Tech Development",
    innovator: "Dr. Sarah Chen",
    funder: "Clean Water Foundation",
    totalAmount: 150000,
    releasedAmount: 50000,
    createdAt: "2025-12-15",
    milestones: [
      {
        id: "m1",
        title: "Prototype Development",
        description: "Complete working prototype of nano-filter system",
        amount: 50000,
        status: "approved",
        dueDate: "2026-01-15",
      },
      {
        id: "m2",
        title: "Lab Testing & Validation",
        description: "Complete EPA-standard testing with documented results",
        amount: 50000,
        status: "submitted",
        dueDate: "2026-03-01",
        proofUrl: "proof-document.pdf",
      },
      {
        id: "m3",
        title: "Field Trial",
        description: "Deploy 10 units in real-world conditions for 30 days",
        amount: 50000,
        status: "pending",
        dueDate: "2026-05-01",
      },
    ],
  },
  {
    id: "2",
    title: "Solar Panel Efficiency Enhancement",
    innovator: "TechGreen Labs",
    funder: "Sustainable Energy Fund",
    totalAmount: 200000,
    releasedAmount: 0,
    createdAt: "2026-01-10",
    milestones: [
      {
        id: "m1",
        title: "Research Phase",
        description: "Complete material science research with peer review",
        amount: 75000,
        status: "pending",
        dueDate: "2026-04-01",
      },
      {
        id: "m2",
        title: "Prototype Manufacturing",
        description: "Produce 5 enhanced solar cells",
        amount: 75000,
        status: "pending",
        dueDate: "2026-07-01",
      },
      {
        id: "m3",
        title: "Efficiency Certification",
        description: "Achieve 30%+ efficiency rating from certified lab",
        amount: 50000,
        status: "pending",
        dueDate: "2026-09-01",
      },
    ],
  },
];

const getStatusColor = (status: Milestone["status"]) => {
  switch (status) {
    case "approved":
      return "bg-success/10 text-success border-success/20";
    case "submitted":
      return "bg-warning/10 text-warning border-warning/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const Escrow = () => {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [milestones, setMilestones] = useState<Array<{ title: string; amount: string; description: string }>>([
    { title: "", amount: "", description: "" },
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", description: "" }]);
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const calculateProgress = (grant: Grant) => {
    const approved = grant.milestones.filter((m) => m.status === "approved").length;
    return (approved / grant.milestones.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Smart Escrow
              </h1>
              <p className="text-muted-foreground">
                Milestone-based funding with automatic smart contract releases
              </p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-cta text-cta-foreground hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Grant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Grant</DialogTitle>
                  <DialogDescription>
                    Set up milestone-based funding with smart contract escrow
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Grant Title</label>
                    <Input placeholder="e.g., Water Purification Research Phase 1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Innovator Address</label>
                    <Input placeholder="0x..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Total Amount (USDC)</label>
                    <Input type="number" placeholder="100000" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Milestones</label>
                      <Button variant="outline" size="sm" onClick={addMilestone}>
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {milestones.map((m, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border bg-secondary/30">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent">
                              {i + 1}
                            </div>
                            <span className="text-sm font-medium">Milestone {i + 1}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Title"
                              value={m.title}
                              onChange={(e) => updateMilestone(i, "title", e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Amount (USDC)"
                              value={m.amount}
                              onChange={(e) => updateMilestone(i, "amount", e.target.value)}
                            />
                          </div>
                          <Textarea
                            placeholder="Deliverable description..."
                            className="mt-3"
                            value={m.description}
                            onChange={(e) => updateMilestone(i, "description", e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <Lock className="w-5 h-5 text-accent" />
                    <p className="text-sm text-muted-foreground">
                      Funds will be locked in a smart contract and released upon milestone approval
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-cta text-cta-foreground hover:opacity-90">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet & Deploy Contract
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Grants List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockGrants.map((grant) => (
              <div
                key={grant.id}
                className="bg-card rounded-xl border border-border p-6 card-hover cursor-pointer"
                onClick={() => setSelectedGrant(grant)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {grant.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {grant.innovator} • Funded by {grant.funder}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-success">
                      ${grant.releasedAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of ${grant.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Progress value={calculateProgress(grant)} className="h-2 mb-4" />

                <div className="flex items-center gap-2">
                  {grant.milestones.map((m, i) => (
                    <div
                      key={m.id}
                      className={`flex-1 h-2 rounded-full ${
                        m.status === "approved"
                          ? "bg-success"
                          : m.status === "submitted"
                          ? "bg-warning"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>
                    {grant.milestones.filter((m) => m.status === "approved").length} of{" "}
                    {grant.milestones.length} milestones complete
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Grant Detail Modal */}
          <Dialog open={!!selectedGrant} onOpenChange={() => setSelectedGrant(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              {selectedGrant && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedGrant.title}</DialogTitle>
                    <DialogDescription>
                      Created on {new Date(selectedGrant.createdAt).toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="stat-card">
                        <DollarSign className="w-5 h-5 text-accent mb-2" />
                        <p className="text-xl font-bold">${selectedGrant.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Locked</p>
                      </div>
                      <div className="stat-card">
                        <CheckCircle2 className="w-5 h-5 text-success mb-2" />
                        <p className="text-xl font-bold">${selectedGrant.releasedAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Released</p>
                      </div>
                      <div className="stat-card">
                        <Lock className="w-5 h-5 text-muted-foreground mb-2" />
                        <p className="text-xl font-bold">
                          ${(selectedGrant.totalAmount - selectedGrant.releasedAmount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                      </div>
                    </div>

                    {/* Milestones */}
                    <h4 className="font-semibold mb-4">Milestones</h4>
                    <div className="space-y-4">
                      {selectedGrant.milestones.map((milestone, i) => (
                        <div
                          key={milestone.id}
                          className="p-4 rounded-xl border border-border bg-secondary/30"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-medium text-accent">
                                {i + 1}
                              </div>
                              <div>
                                <h5 className="font-medium text-foreground">{milestone.title}</h5>
                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${milestone.amount.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Due {new Date(milestone.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            {milestone.status === "pending" && (
                              <Button variant="outline" size="sm">
                                <Upload className="w-3 h-3 mr-1" />
                                Submit Proof
                              </Button>
                            )}
                            {milestone.status === "submitted" && (
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="text-success border-success/20 hover:bg-success/10">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {milestone.status === "approved" && (
                              <span className="flex items-center gap-1 text-success">
                                <CheckCircle2 className="w-4 h-4" />
                                Funds Released
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Escrow;
