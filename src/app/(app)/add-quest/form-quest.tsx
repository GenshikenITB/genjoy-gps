"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { type Quest, QuestType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { type QuestFormProps, questFormSchema } from "@/validations/quest";
import { useEffect } from "react";
import { motion } from "framer-motion";

export function AddQuestDialog({
  isOpen,
  isEditing,
  quest,
  setIsOpen,
  setIsEditing,
  setEditingQuest,
  closeDialog,
}: {
  isOpen: boolean;
  isEditing?: boolean;
  quest?: Quest;
  setIsOpen: (isOpen: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  setEditingQuest: (quest?: Quest) => void;
  closeDialog: () => void;
}) {
  const utils = api.useUtils();

  const createQuestMutation = api.mamet.createQuest.useMutation({
    onMutate() {
      toast.info("⌛ Creating quest...");
    },
    async onSuccess() {
      await utils.mamet.getQuests.invalidate();
      await utils.quest.getAllNotTakenSideQuests.invalidate();
      await utils.quest.getAllTakenSideQuests.invalidate();
      setIsOpen(false);
      form.reset();
      toast.success("✅ Quest created successfully.");
      closeDialog();
    },
    onError() {
      toast.error("❗️ An error occurred while creating the quest.");
    },
  });

  const updateQuestMutation = api.mamet.editQuest.useMutation({
    onMutate() {
      toast.info("⌛ Updating quest...");
    },
    async onSuccess() {
      await utils.mamet.getQuests.invalidate();
      await utils.quest.getAllNotTakenSideQuests.invalidate();
      await utils.quest.getAllTakenSideQuests.invalidate();
      setIsOpen(false);
      form.reset();
      toast.success("✅ Quest updated successfully.");
      closeDialog();
    },
    onError() {
      toast.error("❗️ An error occurred while updating the quest.");
    },
  });

  const form = useForm<QuestFormProps>({
    resolver: zodResolver(questFormSchema),
  });

  function onSubmit(values: z.infer<typeof questFormSchema>) {
    if (isEditing && quest?.id) {
      // Update existing quest
      updateQuestMutation.mutate({ id: quest.id, data: values });
    } else {
      // Create new quest
      createQuestMutation.mutate(values);
    }
  }

  useEffect(() => {
    if (isOpen && !isEditing) {
      form.reset({
        title: "",
        description: "",
        type: QuestType.CREATIVE_ARTS,
        isHandsOn: false,
      });
    }
    if (isEditing && quest) {
      form.reset({
        title: quest.title,
        description: quest.description,
        type: quest.type,
        isHandsOn: quest.isHandsOn,
      });
    }
  }, [isEditing, quest, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            size="sm"
            className="mb-4 w-full"
            onClick={() => {
              setEditingQuest(undefined);
              setIsEditing(false);
            }}
          >
            Create Quest
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Quest" : "Create New Quest"}
          </DialogTitle>
          <DialogDescription>Side Quest GenJourney</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter quest title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">
                    Description (markdown applied on save)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Enter quest description support simple markdown, e.g. **bold**, _italic_, [link](https://example.com)"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quest Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={QuestType.CREATIVE_ARTS}
                          id="main"
                        />
                        <FormLabel htmlFor="main">Creative Arts</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={QuestType.COMMUNITY} id="side" />
                        <FormLabel htmlFor="side">Community</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={QuestType.MAGANG} id="magang" />
                        <FormLabel htmlFor="magang">Magang</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hands-On Checkbox */}
            <FormField
              control={form.control}
              name="isHandsOn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel htmlFor="isHandsOn">Hands-On Quest</FormLabel>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Check if this is a hands-on quest.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {isEditing ? (
                  updateQuestMutation.isPending ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    "Save Changes"
                  )
                ) : createQuestMutation.isPending ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
