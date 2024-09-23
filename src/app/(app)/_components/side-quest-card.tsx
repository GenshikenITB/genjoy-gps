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
import { QuestType, type Quest, type QuestEnrollment } from "@prisma/client";
import {
  CheckIcon,
  EyeIcon,
  GiftIcon,
  SkullIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { useUploadProofQuest } from "@/components/hooks/upload-proof-quest";
import { cn } from "@/lib/utils";

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

  return (
    <>
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
        <div className="flex items-center justify-center gap-2 px-2">
          {isTaken ? (
            <>
              {enrollment?.isPresent && (
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  size="icon"
                  variant="outline"
                >
                  <EyeIcon />
                </Button>
              )}

              <Button
                onClick={() => setIsDialogOpen(true)}
                size="icon"
                variant="secondary"
              >
                <UploadIcon />
              </Button>

              <Button
                size="icon"
                variant={
                  enrollment?.isActivelyParticipating
                    ? "default"
                    : "destructive"
                }
              >
                {enrollment?.isActivelyParticipating ? (
                  <GiftIcon />
                ) : (
                  <SkullIcon />
                )}
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
              >
                {upload.isPending ? "Loading..." : "Submit Bukti"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>

          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={enrollment?.isPresent ?? "/avatar.png"}
            alt="Uploaded"
            width={400}
            height={400}
            objectFit="contain"
            className="rounded-lg"
          />
          <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
