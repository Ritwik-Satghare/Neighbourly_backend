import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { notifications } from "@/lib/data";

export default function NotificationsPage() {
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Activity"
        title="Notifications"
        description="Keep hosts and renters informed with reusable activity cards and route-aware calls to action."
        actions={<Button href="/messages">Open inbox</Button>}
      />
      <div className="grid gap-5">
        {notifications.map((notification) => (
          <article key={notification.title} className="rounded-[1.75rem] bg-surface-card p-6 shadow-ambient">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${notification.tone}`}>Update</span>
                <h2 className="mt-4 font-headline text-2xl font-bold text-ink-strong">{notification.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">{notification.body}</p>
              </div>
              <div className="text-sm font-medium text-ink-soft">{notification.time}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
