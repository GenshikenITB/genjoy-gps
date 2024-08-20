import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { CheckIcon, TrashIcon, UploadIcon } from "lucide-react";

export function SideQuestCard() {
  return (
    <Card className="flex justify-between">
      <CardHeader className="p-2">
        <span className="font-bold">Side Quest 1</span>
        <CardDescription>Detail isi side quest</CardDescription>
      </CardHeader>
      <div className="flex items-center justify-center gap-2 px-2">
        <Button size="icon" variant="secondary">
          <UploadIcon />
        </Button>
        <Button size="icon" variant="destructive">
          <TrashIcon />
        </Button>
        <Button size="icon">
          <CheckIcon />
        </Button>
      </div>
    </Card>
  );
}
