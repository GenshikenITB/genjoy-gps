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
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { QuestType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { type QuestFormProps, questFormSchema } from "@/validations/quest";
import { useState } from "react";

export default function AddQuestDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const { mutate, isPending } = api.mamet.createQuest.useMutation({
    onMutate() {
      toast.info("⌛ Creating quest...");
    },
    async onSuccess() {
      await utils.mamet.getQuests.invalidate();
      setIsOpen(false);
      form.reset();
      toast.success("✅ Quest created successfully.");
    },
    onError() {
      toast.error("❗️ An error occurred while creating the quest.");
    },
  });

  const form = useForm<QuestFormProps>({
    resolver: zodResolver(questFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: QuestType.CREATIVE_ARTS,
      isHandsOn: false,
    },
  });

  function onSubmit(values: z.infer<typeof questFormSchema>) {
    mutate(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="mb-4 w-full">
          Create Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-md">
        <DialogHeader>Create New Quest</DialogHeader>
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
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Enter quest description"
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
                {isPending ? (
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
