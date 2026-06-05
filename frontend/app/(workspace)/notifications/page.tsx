"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { notifications as mockNotifications } from "@/lib/data";
import { getBookings, confirmOrCompleteBooking, cancelBooking, MockBooking } from "@/services/booking";

export default function NotificationsPage() {
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<MockBooking[]>([]);
  const [renterNotifications, setRenterNotifications] = useState<MockBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const markAllAsRead = (pending: MockBooking[], renter: MockBooking[]) => {
    const currentKeys = [
      ...pending.map(r => `${r._id}_${r.status}`),
      ...renter.map(r => `${r._id}_${r.status}`)
    ];
    localStorage.setItem("neighbourly.readNotifications", JSON.stringify(currentKeys));
    window.dispatchEvent(new Event("neighbourly-notifications-read"));
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const ownerBookings = await getBookings("owner");
        const pending = ownerBookings.filter((b: MockBooking) => b.status === "pending");
        setPendingRequests(pending);

        const renterBookings = await getBookings("renter");
        setRenterNotifications(renterBookings);

        markAllAsRead(pending, renterBookings);
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
      setPendingRequests((prev) => {
        const updated = prev.filter((b) => b._id !== id);
        markAllAsRead(updated, renterNotifications);
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to accept booking.");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await cancelBooking(id);
      setPendingRequests((prev) => {
        const updated = prev.filter((b) => b._id !== id);
        markAllAsRead(updated, renterNotifications);
        return updated;
      });
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

            {renterNotifications.map((req) => {
              let badgeText = "Request Sent";
              let badgeColor = "bg-surface-low text-ink-soft";
              let titleText = `You requested to rent ${req.itemTitle}`;
              let bodyText = `Status: Awaiting owner approval • Price: $${req.pricePerDay} / day`;

              if (req.status === "active") {
                badgeText = "Booking Confirmed";
                badgeColor = "bg-emerald-100 text-emerald-800";
                titleText = `Your booking for ${req.itemTitle} has been accepted!`;
                bodyText = `The owner accepted your request. Ready for pickup! • Price: $${req.pricePerDay} / day`;
              } else if (req.status === "completed") {
                badgeText = "Completed";
                badgeColor = "bg-primary-fixed text-primary";
                titleText = `Rental completed for ${req.itemTitle}`;
                bodyText = `Thank you for renting! Hope you had a great experience.`;
              } else if (req.status === "canceled") {
                badgeText = "Declined";
                badgeColor = "bg-rose-100 text-rose-800";
                titleText = `Request for ${req.itemTitle} was declined`;
                bodyText = `The owner declined the rental request.`;
              }

              return (
                <article key={req._id} className="rounded-[1.75rem] bg-surface-card p-6 shadow-ambient">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}>
                        {badgeText}
                      </span>
                      <h2 className="mt-4 font-headline text-2xl font-bold text-ink-strong">
                        {titleText}
                      </h2>
                      <p className="mt-2 text-sm text-ink-soft">
                        {bodyText}
                      </p>
                      {req.status === "active" && (
                        <div className="mt-4">
                          <Button 
                            onClick={() => router.push(`/messages?userId=${req.ownerId}`)}
                            size="sm"
                          >
                            Message Owner
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-ink-soft">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </article>
              );
            })}

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

            {pendingRequests.length === 0 && renterNotifications.length === 0 && mockNotifications.length === 0 && (
              <div className="text-ink-soft">No new notifications.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
