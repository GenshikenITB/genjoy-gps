import { useTakeQuest } from "@/components/hooks/take-quest";
import { useUntakeQuest } from "@/components/hooks/untake-quest";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Quest } from "@prisma/client";
import { CheckIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export function SideQuestCard({
  isTaken = false,
  quest,
}: {
  isTaken?: boolean;
  quest?: Quest;
}) {
  const take = useTakeQuest({ quest: quest! });
  const untake = useUntakeQuest({ quest: quest! });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setFile(files[0]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      // Here you would typically handle the file upload
      // For example: uploadFiles([file])
      console.log("Uploaded file:", file);
      setIsUploading(false);
      setIsDialogOpen(false);
      setFile(null);
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!quest) return null;

  return (
    <>
      <Card className="flex justify-between">
        <CardHeader className="p-2">
          <span className="font-bold">{quest.title}</span>
          <CardDescription>{quest.description}</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-center gap-2 px-2">
          {isTaken ? (
            <>
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="icon"
                variant="secondary"
              >
                <UploadIcon />
              </Button>
              <Button
                onClick={async () => untake.mutateAsync(quest.id)}
                size="icon"
                variant="destructive"
              >
                <TrashIcon />
              </Button>
            </>
          ) : (
            <Button
              onClick={async () => take.mutateAsync(quest.id)}
              size="icon"
            >
              <CheckIcon />
            </Button>
          )}
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            className={`mt-4 flex h-64 flex-col items-center justify-center text-balance rounded-lg border-2 border-dashed text-center transition-colors ${
              isDragging
                ? "border-primary bg-secondary"
                : "border-muted-foreground text-muted-foreground"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={handleSelectFile}
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <>
                <UploadIcon size={60} strokeWidth={1} />
                {isDragging ? (
                  <p className="text-primary">Drop your image here</p>
                ) : (
                  <p className="text-muted-foreground">
                    Drag and drop your image here, or click to select
                  </p>
                )}
              </>
            )}
          </Button>
          <div className="flex w-full justify-end">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              ref={fileInputRef}
            />
            {file && (
              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
