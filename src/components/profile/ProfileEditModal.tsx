import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Facebook, Linkedin, Instagram, Globe, Lock } from "lucide-react";

const TOPICS = [
  "Juegos", "Deportes", "Moda", "Cine", "Fotografía", 
  "Programación", "Música", "Arte", "Tecnología", "Viajes"
];

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  description: string;
  avatarUrl: string;
  topics: string[];
  company: string;
  activity: string;
  observations: string;
  socialMedia: {
    facebook: string;
    linkedin: string;
    instagram: string;
    twitter: string;
    tiktok: string;
    website: string;
  };
}

interface OnboardingData {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  country: string;
  city: string;
}

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: ProfileData;
  onSave: (data: ProfileData) => void;
  onboardingData?: OnboardingData;
}

export const ProfileEditModal = ({ open, onOpenChange, profileData, onSave, onboardingData }: ProfileEditModalProps) => {
  const [formData, setFormData] = useState<ProfileData>(profileData);

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleSocialChange = (platform: keyof ProfileData['socialMedia'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-medium">Profile picture</p>
                <p className="text-sm text-muted-foreground">Select an image for your account profile.</p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">User</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-7 bg-background/50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-background/50 resize-none"
                rows={2}
                maxLength={160}
              />
            </div>

            {/* Company & Activity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-background/50"
                  placeholder="Your company..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity">Activity</Label>
                <Input
                  id="activity"
                  value={formData.activity}
                  onChange={(e) => setFormData(prev => ({ ...prev, activity: e.target.value }))}
                  className="bg-background/50"
                  placeholder="Your activity..."
                />
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                className="bg-background/50 resize-none"
                rows={2}
                maxLength={1000}
                placeholder="Any additional notes..."
              />
            </div>

            {/* Topics */}
            <div className="space-y-2">
              <Label>Topics of interest</Label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <Badge
                    key={topic}
                    variant={formData.topics.includes(topic) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => handleTopicToggle(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Social Media + Onboarding Data */}
          <div className="space-y-6">
            {/* Read-only onboarding data */}
            {onboardingData && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-semibold">Datos personales</Label>
                </div>
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Nombre</p>
                      <p className="text-sm font-medium">{onboardingData.firstName || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Apellidos</p>
                      <p className="text-sm font-medium">{onboardingData.lastName || "—"}</p>
                    </div>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Género</p>
                      <p className="text-sm font-medium">
                        {onboardingData.gender === "male" ? "Masculino" : 
                         onboardingData.gender === "female" ? "Femenino" : 
                         onboardingData.gender === "non-binary" ? "No binario" : 
                         onboardingData.gender === "prefer-not-say" ? "Prefiero no decirlo" : 
                         onboardingData.gender || "—"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha de nacimiento</p>
                      <p className="text-sm font-medium">{onboardingData.birthDate || "—"}</p>
                    </div>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">País</p>
                      <p className="text-sm font-medium">{onboardingData.country || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Ciudad</p>
                      <p className="text-sm font-medium">{onboardingData.city || "—"}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 pt-1">
                    <Lock className="h-3 w-3" /> Estos datos se establecieron durante el registro
                  </p>
                </div>
              </div>
            )}

            {/* Social Media */}
            <div className="space-y-4">
            <Label>Social media</Label>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-[#1877F2]" />
                <Input
                  placeholder="facebook.com/username.."
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                <Input
                  placeholder="linkedin.com/in/username.."
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-[#E4405F]" />
                <Input
                  placeholder="instagram.com/@username.."
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <Input
                  placeholder="x.com/username.."
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <Input
                  placeholder="tiktok.com/@username.."
                  value={formData.socialMedia.tiktok}
                  onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="website url"
                  value={formData.socialMedia.website}
                  onChange={(e) => handleSocialChange('website', e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
