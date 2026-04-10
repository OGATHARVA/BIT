import { FileText } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t bg-muted/50 py-8">
    <div className="container flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="rounded-lg overflow-hidden h-6 w-6">
          <img src={logo} alt="Quotify Logo" className="h-full w-full object-cover" />
        </div>
        <span className="font-semibold text-foreground">Quotify</span>
      </div>
      <p className="text-sm text-muted-foreground">© 2026 Quotify. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
