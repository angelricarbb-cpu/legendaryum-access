import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, Ticket, Check, Loader2 } from "lucide-react";

interface TicketPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  ticketPrice: number;
  onPaymentSuccess: () => void;
}

const TicketPaymentModal = ({
  isOpen,
  onClose,
  eventTitle,
  ticketPrice,
  onPaymentSuccess,
}: TicketPaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Stripe payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);

    // Wait for success animation then close
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    onPaymentSuccess();
    onClose();
    
    // Reset state for next use
    setIsSuccess(false);
    setCardNumber("");
    setExpiry("");
    setCvc("");
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setIsSuccess(false);
      setCardNumber("");
      setExpiry("");
      setCvc("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-purple-500" />
            Purchase Ticket
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your ticket for <span className="font-medium">{eventTitle}</span> has been purchased.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Info */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">{eventTitle}</p>
                  <p className="text-xs text-muted-foreground">Event Ticket</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">${ticketPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">One-time payment</p>
                </div>
              </div>
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="pl-10"
                  required
                  disabled={isProcessing}
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  required
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                  maxLength={3}
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Secure Payment Notice */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Secure payment powered by Stripe (simulated)</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              disabled={isProcessing || cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ${ticketPrice.toFixed(2)}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketPaymentModal;
