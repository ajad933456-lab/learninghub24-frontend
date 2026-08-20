"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { IconArrowRight, IconSchool, IconLock } from "@tabler/icons-react";
import type { SubjectCatalogItem } from "@/lib/types";

// Dynamic icon color palette with dark-mode support
const getCardStyle = (name: string) => {
  const charCode = name.charCodeAt(0) || 0;
  const styles = [
    { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  ];
  return styles[charCode % styles.length];
};

export function CatalogCard({ catalog }: { catalog: SubjectCatalogItem }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const style = getCardStyle(catalog.name);

  const handleViewDetails = () => {
    if (!user) {
      router.push("/login?redirect=/courses");
      return;
    }

    if (user.role === "teacher") {
      setIsTeacherDialogOpen(true);
      return;
    }

    if (user.role === "student") {
      router.push("/student/queries/new");
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleViewDetails();
    }
  };

  const subjectCount = catalog.subjects?.length || 0;

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={handleViewDetails}
        onKeyDown={handleKeyDown}
        className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
      >
        {/* Subtle background glow on hover */}
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/10" />

        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Catalog Icon Container */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${style.bg} ${style.text} transition-colors group-hover:bg-primary group-hover:text-primary-foreground`}
            >
              <IconSchool className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Subject Count Badge */}
            <Badge variant="outline" className="text-xs text-muted-foreground font-normal border-border/60">
              {subjectCount} {subjectCount === 1 ? "Subject" : "Subjects"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-5 py-2">
          {/* Title */}
          <h3 className="line-clamp-2 text-base font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors">
            {catalog.name}
          </h3>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            Explore {catalog.subjects.slice(0, 3).join(", ")}
            {catalog.subjects.length > 3 ? " and more." : "."}
          </p>
        </CardContent>

        <CardFooter className="mt-auto p-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
          <span className="font-medium text-primary transition-colors group-hover:text-primary/80">
            View Details
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5">
            <IconArrowRight className="h-3.5 w-3.5" />
          </div>
        </CardFooter>
      </Card>

      {/* Restricted Access Dialog */}
      <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <IconLock className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-lg">Access Restricted</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Course info can be seen only by the students.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 pt-2">
            <DialogClose className={buttonVariants({ variant: "secondary" })}>
              Understood
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}