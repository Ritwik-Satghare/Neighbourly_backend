"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { verificationChecklist, verificationImages } from "@/lib/data";

export default function VerifyPage() {
  const [afterPreview, setAfterPreview] = useState(verificationImages.after);

  useEffect(() => {
    return () => {
      if (afterPreview.startsWith("blob:")) {
        URL.revokeObjectURL(afterPreview);
      }
    };
  }, [afterPreview]);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAfterPreview((currentPreview) => {
      if (currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
      return URL.createObjectURL(file);
    });
  }

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Condition"
        title="Before and after verification"
        description="Compare the original item condition with the current returned state, then upload an updated photo if needed before confirming."
      />
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[2rem] bg-surface-card p-8 shadow-ambient">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-2xl font-bold text-ink-strong">Before rental</h3>
                <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-primary">Reference</span>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <Image
                  alt="Before rental condition"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={verificationImages.before}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-2xl font-bold text-ink-strong">After rental</h3>
                <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-secondary">Current</span>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <Image
                  alt="After rental condition"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={afterPreview}
                  unoptimized={afterPreview.startsWith("blob:")}
                />
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-surface-low px-5 py-3 text-sm font-semibold text-ink-strong transition hover:bg-surface-high">
                Upload current image
                <input accept="image/*" className="hidden" onChange={handleUpload} type="file" />
              </label>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {verificationChecklist.map((item) => (
              <label key={item.id} className="flex items-center gap-4 rounded-[1.5rem] bg-surface-low p-4 text-sm font-medium text-ink-strong">
                <input className="h-4 w-4 accent-primary" type="checkbox" />
                {item.label}
              </label>
            ))}
          </div>

          <label className="mt-6 grid gap-2 text-sm font-medium text-ink-soft">
            <span>Verification notes</span>
            <textarea
              className="min-h-32 rounded-[1.5rem] border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary/40 focus:bg-surface-card"
              placeholder="Add any scratches, wear, or handoff observations."
            />
          </label>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="/messages">Confirm verification</Button>
            <Button href="/dashboard" variant="secondary">
              Save and return
            </Button>
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] bg-surface-low p-6">
          <h2 className="font-headline text-2xl font-bold text-ink-strong">Verification flow</h2>
          <div className="mt-4 grid gap-4 text-sm text-ink-soft">
            <p>Creates a documented before/after comparison tied to the rental lifecycle.</p>
            <p>Helps lenders spot damage early and gives renters a transparent condition record.</p>
            <p>Supports trust, payouts, and protection decisions without relying only on chat.</p>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-surface-card p-5 shadow-ambient">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recommended next step</p>
            <p className="mt-3 text-sm text-ink-soft">
              After confirming, send the result to messages so both sides can review the same record.
            </p>
            <Button className="mt-4 w-full justify-center" href="/messages" variant="secondary">
              Open related conversation
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
