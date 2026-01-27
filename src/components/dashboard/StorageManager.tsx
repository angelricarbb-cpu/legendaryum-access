import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, Trash2, FileText, Image, File, AlertCircle, 
  HardDrive, Loader2, X, Download 
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

export const StorageManager = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [limits, setLimits] = useState<StorageLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalUsed = files.reduce((acc, file) => acc + file.file_size, 0);
  const usagePercent = limits ? (totalUsed / limits.max_storage_bytes) * 100 : 0;

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Si no hay usuario, mostrar límites del plan free como demo
      setDefaultLimits();
    }
  }, [user]);

  const setDefaultLimits = async () => {
    setIsLoading(true);
    const { data: limitsData } = await supabase
      .from("storage_limits")
      .select("*")
      .eq("plan", "free")
      .maybeSingle();
    
    if (limitsData) {
      setLimits(limitsData);
    } else {
      // Fallback si no hay datos en DB
      setLimits({
        max_storage_bytes: 52428800, // 50MB
        max_file_size_bytes: 5242880, // 5MB
        max_files: 10,
      });
    }
    setFiles([]);
    setIsLoading(false);
  };

  const fetchData = async () => {
    if (!user) {
      setDefaultLimits();
      return;
    }
    setIsLoading(true);

    try {
      // Fetch user files
      const { data: filesData, error: filesError } = await supabase
        .from("user_files")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filesError) {
        console.error("Error fetching files:", filesError);
        setFiles([]);
      } else {
        setFiles(filesData || []);
      }

      // Fetch storage limits for user's plan
      const plan = user.subscription?.plan || "free";
      const { data: limitsData, error: limitsError } = await supabase
        .from("storage_limits")
        .select("*")
        .eq("plan", plan)
        .maybeSingle();

      if (limitsError) {
        console.error("Error fetching limits:", limitsError);
      }
      
      if (limitsData) {
        setLimits(limitsData);
      } else {
        // Fallback a free si no encuentra el plan
        const { data: freeLimits } = await supabase
          .from("storage_limits")
          .select("*")
          .eq("plan", "free")
          .maybeSingle();
        
        setLimits(freeLimits || {
          max_storage_bytes: 52428800,
          max_file_size_bytes: 5242880,
          max_files: 10,
        });
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
      setLimits({
        max_storage_bytes: 52428800,
        max_file_size_bytes: 5242880,
        max_files: 10,
      });
    }

    setIsLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !limits) return;

    // Validate file size
    if (file.size > limits.max_file_size_bytes) {
      toast.error(`El archivo excede el límite de ${formatBytes(limits.max_file_size_bytes)}`);
      return;
    }

    // Validate file count
    if (files.length >= limits.max_files) {
      toast.error(`Has alcanzado el límite de ${limits.max_files} archivos`);
      return;
    }

    // Validate total storage
    if (totalUsed + file.size > limits.max_storage_bytes) {
      toast.error("No tienes suficiente espacio de almacenamiento");
      return;
    }

    setIsUploading(true);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("user-files")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Error al subir el archivo");
      setIsUploading(false);
      return;
    }

    // Save file record
    const { error: dbError } = await supabase.from("user_files").insert({
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
    });

    if (dbError) {
      // Rollback storage upload
      await supabase.storage.from("user-files").remove([filePath]);
      toast.error("Error al guardar el archivo");
    } else {
      toast.success("Archivo subido correctamente");
      fetchData();
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (file: UserFile) => {
    if (!user) return;
    setDeletingId(file.id);

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("user-files")
      .remove([file.file_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("user_files")
      .delete()
      .eq("id", file.id);

    if (dbError) {
      toast.error("Error al eliminar el archivo");
    } else {
      toast.success("Archivo eliminado");
      setFiles(files.filter(f => f.id !== file.id));
    }

    setDeletingId(null);
  };

  const handleDownload = async (file: UserFile) => {
    const { data, error } = await supabase.storage
      .from("user-files")
      .download(file.file_path);

    if (error) {
      toast.error("Error al descargar el archivo");
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Mini preview in card */}
      <div 
        className="mt-4 p-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HardDrive className="h-4 w-4 text-primary" />
            <span>Almacenamiento</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {files.length}/{limits?.max_files || 0} archivos
          </span>
        </div>
        <Progress value={usagePercent} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {formatBytes(totalUsed)} / {limits ? formatBytes(limits.max_storage_bytes) : "0 B"}
        </p>
      </div>

      {/* Full modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Gestor de Almacenamiento
            </DialogTitle>
            <DialogDescription>
              Gestiona tus archivos. Tu plan permite hasta {limits?.max_files} archivos.
            </DialogDescription>
          </DialogHeader>

          {/* Usage bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Espacio usado</span>
              <span className="font-medium">
                {formatBytes(totalUsed)} / {limits ? formatBytes(limits.max_storage_bytes) : "0 B"}
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
              disabled={isUploading || (limits && files.length >= limits.max_files)}
              asChild
            >
              <label className="cursor-pointer">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isUploading ? "Subiendo..." : "Subir archivo"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={isUploading}
                />
              </label>
            </Button>
          </div>

          {limits && (
            <p className="text-xs text-muted-foreground text-center">
              Máx. {formatBytes(limits.max_file_size_bytes)} por archivo
            </p>
          )}

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
    </>
  );
};
