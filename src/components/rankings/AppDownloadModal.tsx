import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Apple } from "lucide-react";

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  iosUrl?: string;
  androidUrl?: string;
}

const AppDownloadModal = ({
  isOpen,
  onClose,
  campaignTitle,
  iosUrl = "https://apps.apple.com",
  androidUrl = "https://play.google.com",
}: AppDownloadModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Download the app to play</DialogTitle>
          <DialogDescription className="text-center">
            {campaignTitle ? (
              <>
                <span className="font-medium text-foreground">{campaignTitle}</span> is an app-based ranking. Download it on your device to start competing.
              </>
            ) : (
              "This is an app-based ranking. Download it on your device to start competing."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* iOS */}
          <a
            href={iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-2 p-5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all"
          >
            <div className="h-14 w-14 rounded-full bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Apple className="h-8 w-8 text-foreground" />
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Download on the</p>
              <p className="text-sm font-semibold text-foreground">App Store</p>
            </div>
          </a>

          {/* Android */}
          <a
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-2 p-5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all"
          >
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Get it on</p>
              <p className="text-sm font-semibold text-foreground">Google Play</p>
            </div>
          </a>
        </div>

        <p className="text-[11px] text-center text-muted-foreground mt-2">
          Your progress will sync automatically once you sign in on the app.
        </p>

        <Button variant="ghost" size="sm" onClick={onClose} className="mt-2">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AppDownloadModal;
