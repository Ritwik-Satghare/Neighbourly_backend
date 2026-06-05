"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { createListing, uploadImages } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

export default function CreateListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [conditionNotes, setConditionNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Availability slots state
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [slotType, setSlotType] = useState<"weekly" | "dates">("weekly");
  const [startDay, setStartDay] = useState("Mon");
  const [endDay, setEndDay] = useState("Thu");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const price = parseFloat(pricePerDay.replace(/[^0-9.]/g, ""));
      if (isNaN(price)) {
        throw new Error("Please enter a valid price");
      }

      // Create the listing
      const { id } = await createListing({
        title,
        category,
        summary,
        pricePerDay: price,
        neighborhood,
        conditionNotes,
        availabilitySlots,
      });

      // Upload images if any are selected
      if (images.length > 0 && id) {
        await uploadImages(id, images);
      }

      // Navigate to dashboard only if authenticated
      if (isAuthenticated()) {
        router.push("/lender-dashboard");
      } else {
        setError("Listing created, but you are not signed in. Please sign in to view your dashboard.");
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to publish listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Host"
        title="Create a new listing"
        description="A clean reusable form replaces the original static HTML and routes hosts back into the dashboard flow."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="grid gap-6 rounded-[2rem] bg-surface-card p-8 shadow-ambient">
          {error && (
            <div className="rounded-2xl bg-tertiary-fixed px-4 py-3 text-sm font-medium text-tertiary">
              {error}
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Listing title"
              placeholder="Professional Power Drill"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Category"
              placeholder="Tools"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <Input
            label="Short description"
            placeholder="Perfect for weekend home projects and quick repairs."
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Daily price"
              placeholder="$25"
              required
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
            />
            <Input
              label="Pickup neighborhood"
              placeholder="Greenpoint, Brooklyn"
              required
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
          </div>
          
          <label className="grid gap-2 text-sm font-medium text-ink-soft">
            <span>Condition notes</span>
            <textarea
              className="min-h-40 rounded-2xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary/40 focus:bg-surface-card"
              placeholder="Explain what’s included, how to use it safely, and any wear to expect."
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
            />
          </label>

          {/* Availability Slots Section */}
          <div className="grid gap-4 rounded-3xl bg-surface-low p-6 border border-outline/10">
            <div>
              <h3 className="font-headline text-lg font-bold text-ink-strong">Availability Settings</h3>
              <p className="text-xs text-ink-soft mt-1">Decide when your item is available to rent. You can add multiple slots.</p>
            </div>

            <div className="flex flex-wrap gap-5 items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-ink-soft cursor-pointer">
                <input
                  type="radio"
                  name="slotType"
                  checked={slotType === "weekly"}
                  onChange={() => setSlotType("weekly")}
                  className="w-4 h-4 accent-primary"
                />
                Weekly Day Range (e.g. Mon-Thu)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-ink-soft cursor-pointer">
                <input
                  type="radio"
                  name="slotType"
                  checked={slotType === "dates"}
                  onChange={() => setSlotType("dates")}
                  className="w-4 h-4 accent-primary"
                />
                Specific Calendar Dates
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {slotType === "weekly" ? (
                <>
                  <label className="grid gap-2 text-sm font-medium text-ink-soft">
                    <span>Start Day</span>
                    <select
                      value={startDay}
                      onChange={(e) => setStartDay(e.target.value)}
                      className="rounded-2xl border border-transparent bg-surface-card px-4 py-3 outline-none transition focus:border-primary/40 text-ink-strong"
                    >
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-ink-soft">
                    <span>End Day</span>
                    <select
                      value={endDay}
                      onChange={(e) => setEndDay(e.target.value)}
                      className="rounded-2xl border border-transparent bg-surface-card px-4 py-3 outline-none transition focus:border-primary/40 text-ink-strong"
                    >
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label className="grid gap-2 text-sm font-medium text-ink-soft">
                    <span>Start Date</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-2xl border border-transparent bg-surface-card px-4 py-3 outline-none transition focus:border-primary/40 text-ink-strong"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-ink-soft">
                    <span>End Date</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-2xl border border-transparent bg-surface-card px-4 py-3 outline-none transition focus:border-primary/40 text-ink-strong"
                    />
                  </label>
                </>
              )}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                let newSlot: any = null;
                if (slotType === "weekly") {
                  newSlot = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: "weekly",
                    startDay,
                    endDay,
                  };
                } else {
                  if (!startDate || !endDate) {
                    alert("Please select both start and end dates.");
                    return;
                  }
                  newSlot = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: "dates",
                    startDate,
                    endDate,
                  };
                }
                setAvailabilitySlots([...availabilitySlots, newSlot]);
              }}
              className="w-fit"
            >
              Add Slot
            </Button>

            {availabilitySlots.length > 0 && (
              <div className="mt-2 grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">Added Availability Slots:</span>
                <div className="flex flex-wrap gap-2">
                  {availabilitySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-2 rounded-2xl bg-primary-fixed/30 text-primary px-3 py-1.5 text-xs font-semibold"
                    >
                      {slot.type === "weekly" ? (
                        <span>Weekly: {slot.startDay} – {slot.endDay}</span>
                      ) : (
                        <span>Dates: {slot.startDate} to {slot.endDate}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setAvailabilitySlots(availabilitySlots.filter((s) => s.id !== slot.id))}
                        className="font-bold text-rose-500 hover:text-rose-700 ml-1 text-sm leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <label className="grid gap-2 text-sm font-medium text-ink-soft">
            <span>Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="rounded-2xl border border-transparent bg-surface-low px-4 py-3 outline-none text-ink-strong file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-fixed file:text-primary file:hover:bg-primary-fixed/80"
            />
          </label>

          <div className="flex flex-wrap gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish listing"}
            </Button>
            <Button href="/browse" variant="secondary">
              Preview marketplace
            </Button>
          </div>
        </form>
        <aside className="h-fit rounded-[2rem] bg-surface-low p-6">
          <h2 className="font-headline text-2xl font-bold text-ink-strong">Checklist</h2>
          <div className="mt-5 grid gap-4 text-sm text-ink-soft">
            <p>Use a clear title and one primary use case.</p>
            <p>Mention included accessories and pickup expectations.</p>
            <p>Link to condition verification before first handoff.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
