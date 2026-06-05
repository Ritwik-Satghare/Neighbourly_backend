"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { notifications as mockNotifications } from "@/lib/data";
import { getBookings, confirmOrCompleteBooking, cancelBooking, MockBooking } from "@/services/booking";

export default function NotificationsPage() {
  const [pendingRequests, setPendingRequests] = useState<MockBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const bookings = await getBookings("owner");
        // Only show pending requests as actionable notifications
        setPendingRequests(bookings.filter((b: MockBooking) => b.status === "pending"));
      } catch (err) {
        console.error("Failed to load requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await confirmOrCompleteBooking(id, "active");
      setPendingRequests((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to accept booking.");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await cancelBooking(id);
      setPendingRequests((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to decline booking.");
    }
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Activity"
        title="Notifications"
        description="Review rental requests and keep up to date with your listings."
        actions={<Button href="/messages">Open inbox</Button>}
      />
      <div className="grid gap-5">
        {loading ? (
          <div className="text-ink-soft">Loading notifications...</div>
        ) : (
          <>
            {pendingRequests.map((req) => (
              <article key={req._id} className="rounded-[1.75rem] bg-surface-card p-6 shadow-ambient">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold bg-primary-fixed text-primary">
                      New Request
                    </span>
                    <h2 className="mt-4 font-headline text-2xl font-bold text-ink-strong">
                      {req.requesterName} wants to rent your {req.itemTitle}
                    </h2>
                    <p className="mt-2 text-sm text-ink-soft">
                      Price: ${req.pricePerDay} / day
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Button onClick={() => handleAccept(req._id)} size="sm">
                        Accept
                      </Button>
                      <Button variant="secondary" onClick={() => handleDecline(req._id)} size="sm">
                        Decline
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-ink-soft">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </article>
            ))}

            {/* Static mock notifications for visual filler if desired */}
            {mockNotifications.map((notification) => (
              <article key={notification.title} className="rounded-[1.75rem] bg-surface-card p-6 shadow-ambient opacity-70">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${notification.tone}`}>Update</span>
                    <h2 className="mt-4 font-headline text-xl font-bold text-ink-strong">{notification.title}</h2>
                    <p className="mt-2 text-sm text-ink-soft">{notification.body}</p>
                  </div>
                  <div className="text-sm font-medium text-ink-soft">{notification.time}</div>
                </div>
              </article>
            ))}

            {pendingRequests.length === 0 && mockNotifications.length === 0 && (
              <div className="text-ink-soft">No new notifications.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
