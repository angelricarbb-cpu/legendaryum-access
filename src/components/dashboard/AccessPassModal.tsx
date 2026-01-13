import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, Calendar, MapPin, Clock, QrCode, 
  CheckCircle2, History, Sparkles
} from "lucide-react";

interface EventTicket {
  id: string;
  eventName: string;
  eventDate: Date;
  location: string;
  ticketType: string;
  status: "upcoming" | "past";
  qrCode?: string;
}

interface AccessPassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for tickets
const mockTickets: EventTicket[] = [
  {
    id: "1",
    eventName: "Gaming Awards 2026",
    eventDate: new Date("2026-03-15T20:00:00"),
    location: "Arena Madrid",
    ticketType: "VIP Access",
    status: "upcoming",
  },
  {
    id: "2",
    eventName: "Esports Championship Finals",
    eventDate: new Date("2026-02-28T18:00:00"),
    location: "Palau Sant Jordi, Barcelona",
    ticketType: "General Admission",
    status: "upcoming",
  },
  {
    id: "3",
    eventName: "Legendaryum Launch Party",
    eventDate: new Date("2026-04-10T21:00:00"),
    location: "WiZink Center, Madrid",
    ticketType: "Early Access",
    status: "upcoming",
  },
  {
    id: "4",
    eventName: "Indie Games Showcase 2025",
    eventDate: new Date("2025-11-20T16:00:00"),
    location: "IFEMA, Madrid",
    ticketType: "Press Pass",
    status: "past",
  },
  {
    id: "5",
    eventName: "Retro Gaming Convention",
    eventDate: new Date("2025-09-10T10:00:00"),
    location: "Feria Valencia",
    ticketType: "Weekend Pass",
    status: "past",
  },
];

export const AccessPassModal = ({ open, onOpenChange }: AccessPassModalProps) => {
  const upcomingTickets = mockTickets.filter(t => t.status === "upcoming");
  const pastTickets = mockTickets.filter(t => t.status === "past");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TicketCard = ({ ticket, isPast = false }: { ticket: EventTicket; isPast?: boolean }) => (
    <Card className={`border-border ${isPast ? 'opacity-70' : 'hover:border-primary/50'} transition-all`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Ticket visual */}
          <div className={`w-16 h-20 rounded-lg flex flex-col items-center justify-center ${
            isPast ? 'bg-muted' : 'bg-gradient-to-br from-primary to-accent'
          }`}>
            <Ticket className={`h-6 w-6 ${isPast ? 'text-muted-foreground' : 'text-white'}`} />
            {!isPast && <QrCode className="h-4 w-4 text-white/70 mt-1" />}
          </div>
          
          {/* Ticket info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{ticket.eventName}</h4>
                <Badge 
                  variant="outline" 
                  className={isPast 
                    ? "text-muted-foreground border-muted" 
                    : "text-primary border-primary/50 bg-primary/10"
                  }
                >
                  {ticket.ticketType}
                </Badge>
              </div>
              {isPast && (
                <Badge className="bg-muted text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Asistido
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(ticket.eventDate)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {ticket.location}
              </span>
            </div>

            {!isPast && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <QrCode className="h-3 w-3 mr-1" />
                  Ver QR
                </Button>
                <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">
                  Añadir al calendario
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Access Pass
          </DialogTitle>
          <DialogDescription>
            Tus entradas y accesos a eventos exclusivos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upcoming" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Ticket className="h-4 w-4 mr-2" />
              Próximos ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="h-4 w-4 mr-2" />
              Historial ({pastTickets.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4 mt-4">
            <TabsContent value="upcoming" className="mt-0 space-y-3">
              {upcomingTickets.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No tienes entradas para próximos eventos</p>
                  <Button className="mt-4" variant="outline">
                    Explorar eventos
                  </Button>
                </div>
              ) : (
                upcomingTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-0 space-y-3">
              {pastTickets.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No tienes eventos pasados</p>
                </div>
              ) : (
                pastTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isPast />
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
