"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle, Search } from "lucide-react";
import { VerifyCard } from "./verify-card";
import { useSortedItems } from "@/hooks/sort-query";

export function VerifyClientPage() {
  const enrollments = api.mamet.getAllEnrollments.useQuery();
  const sortedEnrollments = useSortedItems(enrollments.data, "id");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterTab, setFilterTab] = useState("ALL");

  const filteredEnrollments = sortedEnrollments.filter((enrollment) => {
    const matchesSearch =
      (enrollment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      enrollment.quest.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "ALL" || enrollment.quest.type === filterType;
    let matchesTab = true;
    switch (filterTab) {
      case "UNVERIFIED":
        matchesTab =
          !!enrollment.completedAt &&
          !enrollment.isPresentVerified &&
          !!enrollment.isPresent;
        break;
      case "UNAPPROVED":
        matchesTab =
          !!enrollment.completedAt &&
          !enrollment.isActivelyParticipating &&
          !!enrollment.isPresent;
        break;
      case "TAKING":
        matchesTab = !!enrollment.completedAt;
        break;
    }
    return matchesSearch && matchesType && matchesTab;
  });

  console.log(filteredEnrollments);

  return (
    <Card className="bg-secondary">
      <CardHeader className="p-4">
        <motion.span
          className="font-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          VERIFY PRESENCE
        </motion.span>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search by name or quest title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {Array.from(
                  new Set(
                    enrollments.data?.map(
                      (enrollment) => enrollment.quest.type,
                    ),
                  ),
                ).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs
            value={filterTab}
            onValueChange={setFilterTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-background [&>*]:text-xs">
              <TabsTrigger
                className="data-[state=active]:bg-secondary"
                value="ALL"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-secondary"
                value="TAKING"
              >
                Taking
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-secondary"
                value="UNVERIFIED"
              >
                Presence
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-secondary"
                value="UNAPPROVED"
              >
                Participation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
        <AnimatePresence mode="wait">
          {enrollments.isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardHeader className="flex items-center justify-center">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </CardHeader>
              </Card>
            </motion.div>
          )}
          {!enrollments.isLoading && filteredEnrollments.length === 0 && (
            <motion.div
              key="no-quests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <span className="text-center text-muted-foreground">
                    No matching enrollments found
                  </span>
                </CardHeader>
              </Card>
            </motion.div>
          )}
          {!enrollments.isLoading && filteredEnrollments.length > 0 && (
            <motion.div
              key="quests-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredEnrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <VerifyCard enrollment={enrollment} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
