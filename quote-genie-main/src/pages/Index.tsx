import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, FileText, Sparkles, Upload, PenLine, Eye, Download, Zap, TrendingUp, DollarSign } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Letterhead" },
  { icon: PenLine, label: "Fill Details" },
  { icon: Sparkles, label: "Generate AI Content" },
  { icon: Eye, label: "Preview" },
  { icon: Download, label: "Download PDF" },
];

const stats = [
  { icon: Zap, value: "99%", label: "Faster Document Generation" },
  { icon: TrendingUp, value: "4×", label: "Productivity Increase" },
  { icon: DollarSign, value: "70%", label: "Cost Savings" },  // icon kept as generic money icon
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-24">
        <div className="container text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Sparkles className="h-4 w-4" /> AI-Powered Automation
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Generate Professional Quotations{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Create polished, branded quotations and proposals instantly with AI-powered content generation, beautiful templates, and one-click PDF export.
            </p>
            <Link to="/quotation">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2 px-8 text-base">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">What You Can Create</h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Card className="shadow-card transition-all hover:shadow-card-hover border">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex rounded-xl bg-secondary p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Quotation Generator</h3>
                <p className="mb-6 text-muted-foreground">
                  Create detailed quotations with itemized pricing, tax calculations, and professional AI-written descriptions.
                </p>
                <Link to="/quotation">
                  <Button className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2">
                    Create Quotation <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="shadow-card transition-all hover:shadow-card-hover border">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex rounded-xl bg-secondary p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Proposal Generator</h3>
                <p className="mb-6 text-muted-foreground">
                  Craft compelling business proposals with AI-generated sections, 10 industry templates, and per-section editing.
                </p>
                <Link to="/proposal">
                  <Button className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2">
                    Create Proposal <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="gradient-hero py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">How It Works</h2>
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-background p-6 shadow-card">
                  <div className="gradient-primary rounded-full p-3">
                    <step.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden h-5 w-5 text-muted-foreground md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 inline-flex rounded-2xl bg-secondary p-4">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-4xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
