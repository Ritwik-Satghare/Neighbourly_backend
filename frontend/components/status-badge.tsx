import { cn } from "@/lib/utils";
import type { UserListingStatus } from "@/lib/data";

const tones: Record<UserListingStatus, string> = {
  Active: "bg-primary-fixed text-primary",
  Rented: "bg-secondary-container text-secondary",
  Pending: "bg-tertiary-fixed text-tertiary",
};

export function StatusBadge({ status, className }: { status: UserListingStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", tones[status], className)}>
      {status}
    </span>
  );
}
