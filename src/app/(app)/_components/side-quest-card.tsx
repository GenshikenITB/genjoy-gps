"use client";

import { useTakeQuest } from "@/hooks/take-quest";
import { useUntakeQuest } from "@/hooks/untake-quest";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestType, type Quest, type QuestEnrollment } from "@prisma/client";
import {
  CheckIcon,
  EyeIcon,
  GiftIcon,
  MoreVerticalIcon,
  SkullIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { useUploadProofQuest } from "@/hooks/upload-proof-quest";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SideQuestCard({
  isTaken = false,
  quest,
  enrollment,
}: {
  isTaken?: boolean;
  quest?: Quest;
  enrollment?: QuestEnrollment;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [image, setImage] = useState<string | null | undefined>(null);

  const take = useTakeQuest({ quest: quest! });
  const untake = useUntakeQuest({ quest: quest! });
  const upload = useUploadProofQuest({ setIsDialogOpen });

  if (!quest) return null;

  const ActionButtons = () => (
    <>
      {isTaken ? (
        <>
          {enrollment?.isPresent && (
            <Button
              onClick={() => setIsPreviewOpen(true)}
              size="icon"
              variant="outline"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={() => setIsDialogOpen(true)}
            size="icon"
            variant="secondary"
          >
            <UploadIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={
              enrollment?.isActivelyParticipating ? "default" : "destructive"
            }
          >
            {enrollment?.isActivelyParticipating ? (
              <GiftIcon className="h-4 w-4" />
            ) : (
              <SkullIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={async () => untake.mutateAsync(quest.id)}
            size="icon"
            variant="destructive"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button onClick={async () => take.mutateAsync(quest.id)} size="icon">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
    </>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="flex justify-between">
          <CardHeader className="p-2">
            <span className="font-bold">{quest.title}</span>
            <span
              className={cn(
                "text-xs font-bold text-yellow-200",
                enrollment?.isPresent !== null && "text-green-300",
              )}
            >
              {quest.type == QuestType.COMMUNITY ? "Community" : "Creative"} -{" "}
              {quest.isHandsOn ? "Hands On" : "Non Hands On"}
            </span>
            <CardDescription>{quest.description}</CardDescription>
          </CardHeader>
          <div className="flex items-center justify-center px-2">
            {isTaken ? (
              <>
                <div className="hidden items-center gap-2 sm:flex">
                  <ActionButtons />
                </div>
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                        Upload
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => untake.mutateAsync(quest.id)}
                      >
                        Untake Quest
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <Button
                onClick={async () => take.mutateAsync(quest.id)}
                size="icon"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[400px] rounded-xl">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={enrollment?.isPresent ?? "/avatar.png"}
              alt="Uploaded"
              width={400}
              height={400}
              objectFit="contain"
              className="rounded-lg"
            />
            <Button
              onClick={() => setIsPreviewOpen(false)}
              className="mt-4 w-full"
            >
              Close
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
