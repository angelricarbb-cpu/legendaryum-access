import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, Trash2, FileText, Image, File, AlertCircle, 
  HardDrive, Loader2, Download, Lock
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string | null;
  created_at: string;
}

interface StorageLimits {
  max_storage_bytes: number;
  max_file_size_bytes: number;
  max_files: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return <File className="h-4 w-4" />;
  if (fileType.startsWith("image/")) return <Image className="h-4 w-4 text-blue-500" />;
  if (fileType.includes("pdf") || fileType.includes("document")) return <FileText className="h-4 w-4 text-red-500" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
};

interface StorageManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StorageManagerModal = ({ open, onOpenChange }: StorageManagerModalProps) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const userPlan = user?.subscription?.plan || "free";
  const hasStorageAccess = userPlan === "growth" || userPlan === "scale";

  const totalUsed = files.reduce((acc, file) => acc + file.file_size, 0);
  
  const limits: StorageLimits = {
    max_storage_bytes: 52428800, // 50MB
    max_file_size_bytes: 5242880, // 5MB
    max_files: 10,
  };

  const usagePercent = (totalUsed / limits.max_storage_bytes) * 100;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > limits.max_file_size_bytes) {
      toast.error(`El archivo excede el límite de ${formatBytes(limits.max_file_size_bytes)}`);
      return;
    }

    if (files.length >= limits.max_files) {
      toast.error(`Has alcanzado el límite de ${limits.max_files} archivos`);
      return;
    }

    if (totalUsed + file.size > limits.max_storage_bytes) {
      toast.error("No tienes suficiente espacio de almacenamiento");
      return;
    }

    setIsUploading(true);

    const newFile: UserFile = {
      id: `file_${Date.now()}`,
      file_name: file.name,
      file_path: `${user.id}/${Date.now()}_${file.name}`,
      file_size: file.size,
      file_type: file.type,
      created_at: new Date().toISOString(),
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setFiles(prev => [newFile, ...prev]);
    toast.success("Archivo subido correctamente");

    setIsUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (file: UserFile) => {
    if (!user) return;
    setDeletingId(file.id);

    await new Promise(resolve => setTimeout(resolve, 300));

    setFiles(files.filter(f => f.id !== file.id));
    toast.success("Archivo eliminado");

    setDeletingId(null);
  };

  const handleDownload = async (file: UserFile) => {
    toast.success(`Descargando ${file.file_name}...`);
  };

  // Locked state for non-eligible plans
  if (!hasStorageAccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-amber-500" />
              Almacenamiento de Premios
            </DialogTitle>
            <DialogDescription>
              Sube hasta 10 archivos (giftcards, códigos, premios) para repartir a los ganadores de tus campañas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Upload className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">10 archivos</p>
                <p className="text-xs text-muted-foreground">Hasta 50MB de almacenamiento total</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/5">
              <div className="text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <p className="text-sm font-medium text-amber-600">
                  Disponible en planes Growth y Scale
                </p>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => window.location.href = "/pricing"}
            >
              Hacer Upgrade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Premios de Campañas
          </DialogTitle>
          <DialogDescription>
            Sube giftcards, códigos y premios para repartir a los ganadores. Máximo 10 archivos.
          </DialogDescription>
        </DialogHeader>

        {/* Usage bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Espacio usado</span>
            <span className="font-medium">
              {formatBytes(totalUsed)} / {formatBytes(limits.max_storage_bytes)}
            </span>
          </div>
          <Progress value={usagePercent} className="h-3" />
          {usagePercent > 90 && (
            <p className="text-xs text-orange-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Te estás quedando sin espacio
            </p>
          )}
        </div>

        {/* Upload button */}
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            disabled={isUploading || files.length >= 10}
            asChild
          >
            <label className="cursor-pointer">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Subiendo..." : "Subir premio"}
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Máx. 5MB por archivo • Formatos: imágenes, PDF, documentos
        </p>

        {/* Files list */}
        <ScrollArea className="h-[300px] border rounded-lg">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <File className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">No tienes archivos</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 hover:bg-muted/50">
                  {getFileIcon(file.file_type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(file)}
                      disabled={deletingId === file.id}
                    >
                      {deletingId === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
