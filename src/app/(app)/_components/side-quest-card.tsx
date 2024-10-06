"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UploadIcon,
  InfoIcon,
} from "lucide-react";
import { useTakeQuest } from "@/hooks/take-quest";
import { useUploadProofQuest } from "@/hooks/upload-proof-quest";
import { useDeleteQuest } from "@/hooks/delete-quest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@/utils/uploadthing";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Quest, QuestEnrollment } from "@prisma/client";
import React from "react";

export function SideQuestCard({
  isMamet = false,
  openDialog,
  quest,
  enrollment,
}: {
  isTaken?: boolean;
  isMamet?: boolean;
  openDialog?: (quest: Quest) => void;
  quest?: Quest;
  enrollment?: QuestEnrollment;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTakeQuestAlertOpen, setIsTakeQuestAlertOpen] = useState(false);
  const [image, setImage] = useState<string | null | undefined>(null);

  const take = useTakeQuest({ quest: quest! });
  const upload = useUploadProofQuest({ setIsDialogOpen });
  const remove = useDeleteQuest();

  const handleTakeQuest = () => {
    setIsTakeQuestAlertOpen(true);
  };

  const confirmTakeQuest = () => {
    setIsTakeQuestAlertOpen(false);
    take.mutate(quest!.id);
  };

  if (!quest) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{quest.title}</CardTitle>
              <Badge
                variant={quest.type === "COMMUNITY" ? "default" : "secondary"}
              >
                {quest.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <CardDescription>{quest.description}</CardDescription>
          </CardContent>
          <CardFooter className="flex-col space-y-2 p-4 pt-0 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
            {isMamet ? (
              <div className="flex w-full flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
                <Button
                  onClick={() => openDialog?.(quest)}
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => remove.mutate(quest.id)}
                  size="sm"
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            ) : enrollment ? (
              <div className="flex w-full flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
                <div className="flex w-full flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                  <div className="flex w-full gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsDialogOpen(true)}
                      className="w-full sm:w-auto"
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload Proof
                    </Button>
                    {enrollment.isPresent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsPreviewOpen(true)}
                        className="w-full sm:w-auto"
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    {enrollment.isPresentVerified !== null && (
                      <Badge
                        className={cn(
                          enrollment.isPresentVerified
                            ? "bg-secondary text-foreground"
                            : "bg-yellow-500",
                          "h-fit w-fit",
                        )}
                      >
                        {enrollment.isPresentVerified ? "Approved" : "Pending"}
                      </Badge>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px]">
                        <p className="text-balance text-center text-xs">
                          Jika anda berhalangan untuk menyelesaikan quest ini,
                          hubungi mentor untuk meminta pembatalan pengambilan
                          quest.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ) : (
              <Button size="sm" className="w-full" onClick={handleTakeQuest}>
                <CheckIcon className="mr-2 h-4 w-4" />
                Take Quest
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          {!image ? (
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImage(res[0]?.url);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              config={{
                mode: "auto",
              }}
            />
          ) : (
            <>
              <Image
                src={image ?? "/avatar.png"}
                alt="Uploaded"
                width={400}
                height={400}
                objectFit="contain"
                className="rounded-lg"
              />
              <Button
                onClick={async () =>
                  upload.mutateAsync({
                    questId: quest.id,
                    image: image ?? "ERROR",
                  })
                }
                disabled={upload.isPending}
                className="mt-4 w-full"
              >
                {upload.isPending ? "Loading..." : "Submit Bukti"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={enrollment?.isPresent ?? "/avatar.png"}
              alt="Uploaded"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          <Button
            onClick={() => setIsPreviewOpen(false)}
            className="mt-4 w-full"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTakeQuestAlertOpen}
        onOpenChange={setIsTakeQuestAlertOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pengambilan Quest</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Jika kamu mengambil quest ini, kamu harus wajib menyelesaikannya.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTakeQuestAlertOpen(false)}
            >
              Batalkan
            </Button>
            <Button onClick={confirmTakeQuest}>Ambil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
