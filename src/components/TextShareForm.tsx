import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Copy, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const TextShareForm = () => {
  const [text, setText] = useState("");
  const [sharedId, setSharedId] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to share",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    
    try {
      const response = await fetch('https://qshare-gamma.vercel.app/api/share/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      
      setSharedId(data.id);
      setIsPopoverOpen(true);
      toast({
        title: "Text shared",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sharedId);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "ID copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setText("");
    setSharedId("");
    setCopied(false);
    setIsPopoverOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6 border-2 transition-smooth hover:border-primary/30">
        <div className="space-y-4">
          <Textarea
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] font-mono text-sm resize-none border-border focus:border-primary transition-smooth"
            disabled={!!sharedId}
          />
          
          <div className="flex gap-3">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  onClick={handleShare}
                  disabled={isSharing || !text.trim() || !!sharedId}
                  className="flex-1 bg-primary hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 text-primary-foreground transition-all duration-200"
                  size="lg"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {isSharing ? "Sharing..." : "Share Text"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h4 className="font-medium">Text Shared Successfully</h4>
                  <p className="text-sm text-muted-foreground">Your text ID:</p>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-sm font-mono">{sharedId}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full transition-smooth"
                  >
                    Share Another
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {text && !sharedId && (
        <Card className="p-4 bg-muted/50 border-border/50">
          <div className="flex items-start gap-3">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Preview</p>
              <p>{text.length} characters</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
