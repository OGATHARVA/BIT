import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockDocuments, type DocumentItem } from "@/lib/mockHistory";
import {
  FileText,
  Sparkles,
  Search,
  Eye,
  Download,
  Trash2,
  Plus,
  FolderOpen,
} from "lucide-react";

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  generated: "bg-secondary text-secondary-foreground",
  completed: "bg-primary/15 text-primary",
};

const MyFilesPage = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let docs: DocumentItem[] = [...mockDocuments];
    if (typeFilter !== "all") docs = docs.filter((d) => d.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.clientName.toLowerCase().includes(q)
      );
    }
    docs.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return docs;
  }, [typeFilter, sortOrder, search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="container space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Generated Files</h1>
            <p className="text-muted-foreground">
              View and manage your quotations and proposals.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="quotation">Quotations</SelectItem>
                <SelectItem value="proposal">Proposals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <Card className="shadow-card border">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                <FolderOpen className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">No documents found</p>
                <p className="text-sm text-muted-foreground">
                  Create your first quotation or proposal to get started.
                </p>
                <div className="flex gap-3">
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
          ) : (
            <div className="space-y-3">
              {filtered.map((doc) => (
                <Card key={doc.id} className="shadow-card border transition-all hover:shadow-card-hover">
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-secondary p-3">
                        {doc.type === "quotation" ? (
                          <FileText className="h-5 w-5 text-primary" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.clientName} · v{doc.version}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`capitalize ${statusColor[doc.status]}`}>
                        {doc.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground hidden md:inline">
                        {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyFilesPage;
