import { FileText } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-muted/50 py-8">
    <div className="container flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="gradient-primary rounded-lg p-1.5">
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground">Codify</span>
      </div>
      <p className="text-sm text-muted-foreground">© 2026 Codify. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
