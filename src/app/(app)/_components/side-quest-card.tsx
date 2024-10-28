"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
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
import { QuestType, type Quest, type QuestEnrollment } from "@prisma/client";
import React from "react";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateQuestVisibility } from "@/hooks/update-quest-visibility";

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
  const { data: session } = useSession();

  const take = useTakeQuest({ quest: quest! });
  const upload = useUploadProofQuest({ setIsDialogOpen });
  const remove = useDeleteQuest();
  const visibility = useUpdateQuestVisibility();

  const handleVisibilityChange = (checked: boolean) => {
    visibility.mutate({
      questId: quest!.id,
      isVisiblyActive: checked,
    });
  };

  const handleTakeQuest = () => {
    setIsTakeQuestAlertOpen(true);
  };

  const confirmTakeQuest = () => {
    setIsTakeQuestAlertOpen(false);
    if (session) {
      take.mutate({
        id: quest!.id,
        userId: session.user.id,
      });
    }
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
                variant={
                  quest.type !== QuestType.CREATIVE_ARTS
                    ? "default"
                    : "secondary"
                }
                className={cn(
                  quest.type === QuestType.MAGANG && "bg-yellow-300",
                )}
              >
                {quest.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <CardDescription>
              <ReactMarkdown>{quest.description}</ReactMarkdown>
            </CardDescription>
          </CardContent>
          <CardFooter className="flex-col space-y-2 p-4 pt-0 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
            {isMamet ? (
              <div className="flex w-full flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
                <div className="flex items-center gap-2">
                  <Label htmlFor="is-visible">Quest Visibility</Label>
                  <Switch
                    checked={quest.isVisiblyActive}
                    onCheckedChange={handleVisibilityChange}
                    id="is-visible"
                  />
                </div>
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
                  <div className="flex w-fit gap-2">
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
                        className={cn(
                          enrollment.isPresentVerified
                            ? "border-green-500 text-green-500"
                            : "border-yellow-500 text-yellow-500",
                          "w-full sm:w-auto",
                        )}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    <Badge
                      className={cn(
                        enrollment.isActivelyParticipating === null
                          ? "bg-yellow-500"
                          : enrollment.isActivelyParticipating
                            ? "bg-green-500"
                            : "bg-red-500",
                        "h-fit w-fit",
                      )}
                    >
                      {enrollment.isActivelyParticipating === null
                        ? "Pending Participation"
                        : enrollment.isActivelyParticipating
                          ? "Participation Approved"
                          : "Participation Declined"}
                    </Badge>
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
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={image ?? "/404.png"}
                  alt="Uploaded"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
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
            <DialogTitle className="flex items-center justify-start gap-2">
              <span>Preview</span>
              <Badge
                className={
                  enrollment?.isPresentVerified
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
              >
                {enrollment?.isPresentVerified
                  ? "Presence Verified"
                  : "Pending Verification"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={enrollment?.isPresent ?? "/404.png"}
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
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pengambilan Quest</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Jika kamu mengambil quest ini, kamu harus wajib menyelesaikannya.
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2">
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
