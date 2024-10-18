"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
export function MagangBanner() {
  return (
    <Card className="bg-yellow-300">
      <CardHeader className="p-4">
        <motion.span
          className="font-black text-background"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ANNOUNCEMENT
        </motion.span>
      </CardHeader>
      <AnimatePresence mode="wait">
        <CardContent className="px-4">
          <motion.div
            key="no-quests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <span className="text-balance text-center text-4xl font-bold">
                  MAGANG BPH TELAH DIBUKA!
                </span>
                <span className="text-balance text-center text-muted-foreground">
                  Ayo daftar! Untuk mengambil magang, ambil quest dengan label
                  <Badge className="mx-2 bg-yellow-300">MAGANG</Badge> yaa
                  teman-teman 😊
                </span>
              </CardHeader>
            </Card>
          </motion.div>
        </CardContent>
      </AnimatePresence>
    </Card>
  );
}
