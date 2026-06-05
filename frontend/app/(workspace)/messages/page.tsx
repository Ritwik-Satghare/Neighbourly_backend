"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { confirmOrCompleteBooking, getBookings, MockBooking } from "@/services/booking";
import { formatCurrency } from "@/lib/utils";

export default function MessagesPage() {
  const [requests, setRequests] = useState<MockBooking[]>([]);
  const [activeRequest, setActiveRequest] = useState<MockBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getBookings("owner");
        const pending = data.filter((b: MockBooking) => b.status === "pending" || b.status === "active");
        setRequests(pending);
        if (pending.length > 0) setActiveRequest(pending[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleAccept = async () => {
    if (!activeRequest) return;
    try {
      await confirmOrCompleteBooking(activeRequest._id, "active");
      const updated = [...requests];
      const index = updated.findIndex(r => r._id === activeRequest._id);
      if (index !== -1) {
        updated[index].status = "active";
        setRequests(updated);
        setActiveRequest(updated[index]);
      }
      setMessage("Request accepted successfully! The item will now appear in the dashboard.");
      setTimeout(() => setMessage(""), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to accept");
    }
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Inbox"
        title="Messages & Notifications"
        description="View incoming rental requests, negotiate, and accept them."
      />
      <div className="grid overflow-hidden rounded-[2rem] bg-surface-card shadow-ambient lg:grid-cols-[320px_1fr] min-h-[500px]">
        
        {/* Sidebar */}
        <section className="border-b border-outline/20 p-4 lg:border-b-0 lg:border-r overflow-y-auto max-h-[600px]">
          <div className="grid gap-3">
            {isLoading ? (
              <div className="p-4 text-sm text-ink-soft">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-4 text-sm text-ink-soft">No active rental requests.</div>
            ) : (
              requests.map((req) => (
                <div
                  key={req._id}
                  onClick={() => setActiveRequest(req)}
                  className={`rounded-[1.5rem] p-4 cursor-pointer ${
                    activeRequest?._id === req._id ? "bg-surface-low" : "hover:bg-surface-low"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-strong truncate">{req.requesterName}</p>
                      <p className="mt-1 text-sm text-ink-soft truncate">Requested: {req.itemTitle}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-ink-soft">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {req.status === "active" && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      Accepted
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Detail View */}
        <section className="grid gap-6 p-6">
          {!activeRequest ? (
            <div className="flex items-center justify-center h-full text-ink-soft">
              Select a conversation to view details
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-outline/20 pb-4">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-ink-strong">{activeRequest.requesterName}</h2>
                  <p className="text-sm text-primary">Neighbor • Requested to rent</p>
                </div>
                <Button variant="secondary">View profile</Button>
              </div>

              <div className="max-w-md rounded-[1.5rem] bg-surface-low p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Rental context</p>
                <p className="mt-2 font-semibold text-ink-strong">{activeRequest.itemTitle}</p>
                <p className="mt-1 text-sm text-ink-soft">{formatCurrency(activeRequest.pricePerDay)} / day</p>
              </div>

              <div className="grid gap-4 flex-1">
                <div className="max-w-xl rounded-[1.5rem] rounded-bl-md bg-surface-low px-5 py-4 text-sm text-ink-strong">
                  Hi! I'd like to rent your {activeRequest.itemTitle}. Is it available this week?
                </div>

                <div className="max-w-xl rounded-[1.5rem] bg-surface-card p-5 shadow-ambient mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Action required</p>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-ink-soft">Rental Request</p>
                      <p className="font-headline text-2xl font-bold text-ink-strong">
                        {activeRequest.status === "pending" ? "Pending Approval" : "Accepted"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {activeRequest.status === "pending" ? (
                        <>
                          <Button variant="secondary">Decline</Button>
                          <Button onClick={handleAccept}>Accept request</Button>
                        </>
                      ) : (
                        <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                          Request Accepted
                        </div>
                      )}
                    </div>
                  </div>
                  {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
