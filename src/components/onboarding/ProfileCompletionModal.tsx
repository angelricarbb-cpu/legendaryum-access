import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { User, Calendar, MapPin, Phone } from "lucide-react";
import { UserProfile } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserProfile) => void;
}

const ProfileCompletionModal = ({ isOpen, onClose, onComplete }: ProfileCompletionModalProps) => {
  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    phone: "",
    country: "",
    city: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = "El nombre no puede exceder 50 caracteres";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Los apellidos son obligatorios";
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = "Los apellidos no pueden exceder 100 caracteres";
    }

    if (!formData.gender) {
      newErrors.gender = "El género es obligatorio";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es obligatoria";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthDate = "Debes tener al menos 13 años";
      } else if (age > 120) {
        newErrors.birthDate = "Fecha de nacimiento inválida";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^[+]?[\d\s-]{9,20}$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    if (!formData.country.trim()) {
      newErrors.country = "El país es obligatorio";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
      toast.success("Perfil completado correctamente");
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Completa tu Perfil</DialogTitle>
          </div>
          <DialogDescription>
            Necesitamos algunos datos para personalizar tu experiencia y generar reportes de las campañas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Tu nombre"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
                maxLength={50}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                Apellidos <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Tus apellidos"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
                maxLength={100}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Género <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
              <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecciona tu género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Femenino</SelectItem>
                <SelectItem value="non-binary">No binario</SelectItem>
                <SelectItem value="prefer-not-say">Prefiero no decirlo</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-xs text-destructive">{errors.gender}</p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Fecha de Nacimiento <span className="text-destructive">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              className={errors.birthDate ? "border-destructive" : ""}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && (
              <p className="text-xs text-destructive">{errors.birthDate}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+34 612 345 678"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
              maxLength={20}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                País <span className="text-destructive">*</span>
              </Label>
              <Input
                id="country"
                placeholder="España"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className={errors.country ? "border-destructive" : ""}
                maxLength={60}
              />
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                Ciudad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Madrid"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
                maxLength={100}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city}</p>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> Campos obligatorios. 
              Esta información nos ayuda a generar reportes para las marcas y mejorar tu experiencia en la plataforma.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="min-w-[140px]">
              Guardar y Continuar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionModal;
