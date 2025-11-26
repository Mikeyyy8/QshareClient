import { TextShareForm } from "@/components/TextShareForm";
import { FileText, Code, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Loader from "../components/ui/Loader";

const Index = () => {
  const [receiveId, setReceiveId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {toast} = useToast();

  const handleReceive = async () => {
    if (receiveId.trim().length === 5) {
      const response = await fetch(
        `https://qshare-gamma.vercel.app/api/share/${receiveId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      try {
        if (data.message === "File not found") {
          toast({
            title: "File not found",
            description: "Please check the ID and try again.",
            variant: "destructive",
          });
          return;
        }
        sessionStorage.setItem(`qshare:${receiveId.trim()}`, JSON.stringify(data));
      } catch (err) {
        // non-fatal: log but continue navigation
        console.error("Failed to persist received data:", err);
      }

      navigate(`receive/${receiveId.trim()}`);
      setOpen(false);
      setReceiveId("");
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Qshare
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-smooth hover:border-primary"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Receive
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Receive Text</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter the 5-digit ID to retrieve shared text
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receive-id">ID</Label>
                    <Input
                      id="receive-id"
                      placeholder="abc12"
                      maxLength={5}
                      value={receiveId}
                      onChange={(e) => setReceiveId(e.target.value.slice(0, 5))}
                      onKeyDown={(e) => e.key === "Enter" && handleReceive()}
                    />
                  </div>
                  <Button
                    onClick={handleReceive}
                    disabled={receiveId.trim().length !== 5}
                    className="w-full"
                  >
                    {loading ? <Loader /> : "Retrieve Text"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {/* <Button
              variant="outline"
              size="sm"
              className="transition-smooth hover:border-primary"
              asChild
            >
              <a href="YOUR_API_URL" target="_blank" rel="noopener noreferrer">
                <Code className="mr-2 h-4 w-4" />
                API Docs
              </a>
            </Button> */}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Share Text Instantly
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick and simple text sharing. Paste your content, get a simple ID you can use on another device.
          </p>
        </header>

        <div
          className="animate-fade-in-up"
          style={{
            animationDelay: "0.1s",
            animationFillMode: "backwards",
          }}
        >
          <TextShareForm />
        </div>

        <footer
          className="text-center mt-16 text-sm text-muted-foreground animate-fade-in"
          style={{
            animationDelay: "0.2s",
            animationFillMode: "backwards",
          }}
        >
          <p>Secure • Fast • Simple</p>
        </footer>
      </div>
    </div>
  );
};
export default Index;
