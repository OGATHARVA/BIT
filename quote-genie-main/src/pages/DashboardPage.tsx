import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/auth";
import { mockDocuments } from "@/lib/mockHistory";
import {
  FileText,
  Sparkles,
  FolderOpen,
  Plus,
  ArrowRight,
  CalendarDays,
  User,
  Mail,
  Activity,
} from "lucide-react";

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  generated: "bg-secondary text-secondary-foreground",
  completed: "bg-primary/15 text-primary",
};

const DashboardPage = () => {
  const user = getUser();
  const username = user?.username || "User";
  const email = user?.email || "user@example.com";
  const createdAt = user?.createdAt || new Date().toISOString();

  const totalQuotations = mockDocuments.filter((d) => d.type === "quotation").length;
  const totalProposals = mockDocuments.filter((d) => d.type === "proposal").length;
  const recent = mockDocuments.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="container space-y-8">
          {/* Welcome */}
          <Card className="gradient-hero border shadow-card">
            <CardContent className="flex flex-col gap-2 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Welcome back, {username} 👋
                </h1>
                <p className="text-muted-foreground">
                  Manage your quotations and proposals here.
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Link to="/quotation">
                  <Button size="sm" className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2">
                    <Plus className="h-4 w-4" /> New Quotation
                  </Button>
                </Link>
                <Link to="/proposal">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" /> New Proposal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats + Profile row */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="shadow-card border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-secondary p-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalQuotations}</p>
                  <p className="text-sm text-muted-foreground">Quotations</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-secondary p-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalProposals}</p>
                  <p className="text-sm text-muted-foreground">Proposals</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-secondary p-3">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockDocuments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-xl bg-secondary p-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Active</p>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="shadow-card border">
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{username}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    Joined {new Date(createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Files */}
            <Card className="shadow-card border lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Documents</CardTitle>
                <Link to="/my-files">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {recent.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-secondary p-2">
                          {doc.type === "quotation" ? (
                            <FileText className="h-4 w-4 text-primary" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusColor[doc.status]}>{doc.status}</Badge>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
