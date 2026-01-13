import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, Calendar, Clock,
  CheckCircle2, Sparkles, Play, Share2,
  Facebook, Twitter, Linkedin, MessageCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventTicket {
  id: string;
  eventName: string;
  eventDate: Date;
  ticketType: string;
  status: "active" | "upcoming" | "past";
}

interface AccessPassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for tickets
const mockTickets: EventTicket[] = [
  {
    id: "1",
    eventName: "Summer Challenge 2026",
    eventDate: new Date("2026-01-20T20:00:00"),
    ticketType: "Participante Activo",
    status: "active",
  },
  {
    id: "2",
    eventName: "Winter Quest Live",
    eventDate: new Date("2026-01-25T18:00:00"),
    ticketType: "Early Access",
    status: "active",
  },
  {
    id: "3",
    eventName: "Gaming Awards 2026",
    eventDate: new Date("2026-03-15T20:00:00"),
    ticketType: "General Admission",
    status: "upcoming",
  },
  {
    id: "4",
    eventName: "Esports Championship Finals",
    eventDate: new Date("2026-02-28T18:00:00"),
    ticketType: "General Admission",
    status: "upcoming",
  },
  {
    id: "5",
    eventName: "Legendaryum Launch Party",
    eventDate: new Date("2026-04-10T21:00:00"),
    ticketType: "Early Access",
    status: "upcoming",
  },
  {
    id: "6",
    eventName: "Indie Games Showcase 2025",
    eventDate: new Date("2025-11-20T16:00:00"),
    ticketType: "Press Pass",
    status: "past",
  },
  {
    id: "7",
    eventName: "Retro Gaming Convention",
    eventDate: new Date("2025-09-10T10:00:00"),
    ticketType: "Weekend Pass",
    status: "past",
  },
];

export const AccessPassModal = ({ open, onOpenChange }: AccessPassModalProps) => {
  const activeTickets = mockTickets.filter(t => t.status === "active");
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

  const handleShare = (platform: string, eventName: string) => {
    const shareText = `¡Estoy participando en ${eventName} en Legendaryum! 🎮`;
    const shareUrl = window.location.origin;
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const TicketCard = ({ ticket, isActive = false, isPast = false }: { ticket: EventTicket; isActive?: boolean; isPast?: boolean }) => (
    <Card className={`border-border ${isPast ? 'opacity-70' : isActive ? 'border-emerald-500/50 bg-emerald-500/5' : 'hover:border-primary/50'} transition-all`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Ticket visual */}
          <div className={`w-16 h-20 rounded-lg flex flex-col items-center justify-center ${
            isPast ? 'bg-muted' : isActive ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-primary to-accent'
          }`}>
            {isActive ? (
              <Play className="h-6 w-6 text-white" />
            ) : (
              <Ticket className={`h-6 w-6 ${isPast ? 'text-muted-foreground' : 'text-white'}`} />
            )}
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
                    : isActive
                    ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/10"
                    : "text-primary border-primary/50 bg-primary/10"
                  }
                >
                  {ticket.ticketType}
                </Badge>
              </div>
              {isPast && (
                <Badge className="bg-muted text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Finalizado
                </Badge>
              )}
              {isActive && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                  <Play className="h-3 w-3 mr-1" />
                  En curso
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(ticket.eventDate)}
              </span>
            </div>

            {!isPast && (
              <div className="flex gap-2 pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Share2 className="h-3 w-3 mr-1" />
                      Compartir
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => handleShare('facebook', ticket.eventName)}>
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter', ticket.eventName)}>
                      <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                      Twitter / X
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('linkedin', ticket.eventName)}>
                      <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('whatsapp', ticket.eventName)}>
                      <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                      WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {!isActive && (
                  <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">
                    Añadir al calendario
                  </Button>
                )}
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

        <Tabs defaultValue="active" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="active" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Play className="h-4 w-4 mr-2" />
              Activos ({activeTickets.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Ticket className="h-4 w-4 mr-2" />
              Próximos ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Finalizados ({pastTickets.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4 mt-4">
            <TabsContent value="active" className="mt-0 space-y-3">
              {activeTickets.length === 0 ? (
                <div className="text-center py-12">
                  <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No estás participando en ningún evento ahora mismo</p>
                  <Button className="mt-4" variant="outline">
                    Explorar eventos
                  </Button>
                </div>
              ) : (
                activeTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isActive />
                ))
              )}
            </TabsContent>

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
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No tienes eventos finalizados</p>
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