import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Shield, FileText } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Términos y Condiciones</DialogTitle>
          </div>
          <DialogDescription>
            Por favor, lee y acepta nuestros términos y condiciones para continuar usando la plataforma.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                1. Aceptación de los Términos
              </h3>
              <p>
                Al acceder y utilizar la plataforma Legendaryum, aceptas estar sujeto a estos términos y 
                condiciones de uso. Si no estás de acuerdo con alguna parte de estos términos, no deberás 
                utilizar nuestra plataforma.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">2. Descripción del Servicio</h3>
              <p>
                Legendaryum es una plataforma de gamificación que permite a los usuarios participar en 
                campañas interactivas, competir en rankings y obtener recompensas. Los servicios incluyen, 
                pero no se limitan a: acceso a juegos, participación en campañas, sistema de puntos y 
                clasificaciones.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">3. Registro y Cuenta de Usuario</h3>
              <p>
                Para acceder a ciertas funciones de la plataforma, debes crear una cuenta proporcionando 
                información precisa y completa. Eres responsable de mantener la confidencialidad de tu 
                cuenta y contraseña, así como de todas las actividades que ocurran bajo tu cuenta.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">4. Uso Aceptable</h3>
              <p>Te comprometes a:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>No utilizar la plataforma para fines ilegales o no autorizados</li>
                <li>No intentar acceder a áreas restringidas de la plataforma</li>
                <li>No transmitir virus u otro código malicioso</li>
                <li>No interferir con el funcionamiento normal de la plataforma</li>
                <li>No crear múltiples cuentas para manipular rankings o recompensas</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">5. Propiedad Intelectual</h3>
              <p>
                Todo el contenido de la plataforma, incluyendo pero no limitado a textos, gráficos, logos, 
                iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad 
                de Legendaryum o de sus proveedores de contenido y está protegido por las leyes de propiedad 
                intelectual.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">6. Privacidad y Datos Personales</h3>
              <p>
                El uso de tus datos personales se rige por nuestra Política de Privacidad. Al utilizar 
                la plataforma, consientes el procesamiento de tus datos según se describe en dicha política. 
                Nos comprometemos a proteger tu información personal y a utilizarla únicamente para los 
                fines descritos.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">7. Recompensas y Premios</h3>
              <p>
                Las recompensas y premios están sujetos a disponibilidad y a los términos específicos de 
                cada campaña. Nos reservamos el derecho de modificar, suspender o cancelar cualquier 
                recompensa en caso de detectar actividad fraudulenta o incumplimiento de estos términos.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">8. Limitación de Responsabilidad</h3>
              <p>
                Legendaryum no será responsable por daños indirectos, incidentales, especiales o 
                consecuentes que resulten del uso o la imposibilidad de usar la plataforma.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">9. Modificaciones</h3>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las 
                modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. 
                Tu uso continuado de la plataforma constituye la aceptación de los términos modificados.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">10. Contacto</h3>
              <p>
                Si tienes preguntas sobre estos términos, puedes contactarnos a través de los canales 
                de soporte disponibles en la plataforma.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="border-t pt-4">
          <div className="flex items-start gap-3 mb-4">
            <Checkbox 
              id="accept-terms" 
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
            />
            <label 
              htmlFor="accept-terms" 
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              He leído y acepto los <span className="text-foreground font-medium">Términos y Condiciones</span> y 
              la <span className="text-foreground font-medium">Política de Privacidad</span> de Legendaryum.
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!accepted}
            className="min-w-[120px]"
          >
            Aceptar y Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
