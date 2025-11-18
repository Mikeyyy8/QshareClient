import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, FileDown, FileArchive } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";

const Receive = () => {
  const { id } = useParams();
  const [textContent, setTextContent] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setTextContent("");
      navigate("/"); // Redirect to home if no ID is provided
      return;
    }
    try {
      const raw = sessionStorage.getItem(`qshare:${id}`);
      if (!raw) {
        console.warn(`No localStorage entry for qshare:${id}`);
        setTextContent("");
        return;
      }
      const parsed = JSON.parse(raw);
      // support both plain string storage or { text: string } shape
      const text = typeof parsed === "string" ? parsed : parsed?.data.text ?? "";
      setTextContent(text);
    } catch (err) {
      console.error("Failed to parse qshare data:", err);
      setTextContent("");
    }
  }, [id]);

  const downloadAsText = () => {
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qshare-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = () => {
    // For PDF generation, we'll create a simple HTML-based PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>qshare - ${id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #333; margin-bottom: 20px; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>qshare - ${id}</h1>
            <div class="content">${textContent}</div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    zip.file(`qshare-${id}.txt`, textContent);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qshare-${id}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              qshare
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Receive Text
          </h1>
          {id ? (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Text for ID: <span className="font-mono font-bold text-foreground">{id}</span></p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileDown className="h-4 w-4" />
                      Download
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={downloadAsText}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        As Text File
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={downloadAsPDF}
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        As PDF
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={downloadAsZip}
                      >
                        <FileArchive className="mr-2 h-4 w-4" />
                        As ZIP File
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 min-h-[200px]">
                <p className="text-foreground whitespace-pre-wrap">{textContent}</p>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground">No ID provided. Please enter an ID from the header.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receive;
