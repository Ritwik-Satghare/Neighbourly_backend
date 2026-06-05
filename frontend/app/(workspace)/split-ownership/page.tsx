"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

interface Shareholder {
  id: string;
  name: string;
  ownershipPercent: number;
  amountPaid: number;
}

interface SplitDetails {
  itemName: string;
  totalValue: number;
  totalOwners: number;
  nextPaymentDate: string;
  shareholders: Shareholder[];
}

export default function SplitOwnershipPage() {
  const [loading, setLoading] = useState(false);

  const [itemId, setItemId] = useState("");
  const [owners, setOwners] = useState("");

  const [splitDetails, setSplitDetails] =
    useState<SplitDetails | null>(null);

  const getSplitDetails = () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("neighbourly.splitDetails");
    if (stored) {
      try {
        setSplitDetails(JSON.parse(stored));
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // Default mock split details if none in localStorage
    const defaultSplit: SplitDetails = {
      itemName: "Anker Nebula 4K Projector",
      totalValue: 40000,
      totalOwners: 4,
      nextPaymentDate: "June 25, 2026",
      shareholders: [
        {
          id: "1",
          name: "Ritwik (You)",
          ownershipPercent: 25,
          amountPaid: 0,
        },
        {
          id: "2",
          name: "Avery Cole",
          ownershipPercent: 25,
          amountPaid: 10000,
        },
        {
          id: "3",
          name: "Sarah Mitchell",
          ownershipPercent: 25,
          amountPaid: 10000,
        },
        {
          id: "4",
          name: "Maya Flores",
          ownershipPercent: 25,
          amountPaid: 10000,
        },
      ],
    };
    setSplitDetails(defaultSplit);
    localStorage.setItem("neighbourly.splitDetails", JSON.stringify(defaultSplit));
  };

  const createSplit = async () => {
    if (!itemId || !owners) {
      alert("Please enter both Item ID and Number of Owners");
      return;
    }

    const numOwners = Number(owners);
    if (isNaN(numOwners) || numOwners <= 0) {
      alert("Please enter a valid number of owners");
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      let itemName = itemId;
      let totalValue = 25000; // default value

      // Check some common items
      const itemLower = itemId.toLowerCase();
      if (itemLower.includes("projector") || itemLower.includes("nebula")) {
        itemName = "Anker Nebula 4K Projector";
        totalValue = 40000;
      } else if (itemLower.includes("pizza") || itemLower.includes("ooni")) {
        itemName = "Ooni Koda 16 Pizza Oven";
        totalValue = 35000;
      } else if (itemLower.includes("bike") || itemLower.includes("stumpjumper")) {
        itemName = "Specialized Stumpjumper EVO";
        totalValue = 120000;
      } else if (itemLower.includes("washer") || itemLower.includes("karcher")) {
        itemName = "Karcher K5 Premium Washer";
        totalValue = 25000;
      } else if (itemLower.includes("yeti") || itemLower.includes("cooler")) {
        itemName = "Yeti Tundra 45 Cooler";
        totalValue = 15000;
      } else if (itemLower.includes("sony") || itemLower.includes("camera")) {
        itemName = "Sony Alpha IV Creator Kit";
        totalValue = 180000;
      }

      const sharePercent = Math.round((100 / numOwners) * 100) / 100;
      const mockNames = [
        "Avery Cole",
        "Sarah Mitchell",
        "Maya Flores",
        "Jordan Hale",
        "Nina Brooks",
        "Miles Turner",
        "Elena Vance",
        "Marcus Thorne",
        "David Chen",
      ];

      const shareholders: Shareholder[] = [
        {
          id: "1",
          name: "Ritwik (You)",
          ownershipPercent: sharePercent,
          amountPaid: 0,
        },
      ];

      for (let i = 1; i < numOwners; i++) {
        const name = mockNames[(i - 1) % mockNames.length];
        const isPaid = Math.random() > 0.4;
        const shareAmount = (totalValue * sharePercent) / 100;
        shareholders.push({
          id: String(i + 1),
          name,
          ownershipPercent: sharePercent,
          amountPaid: isPaid ? Math.round(shareAmount) : 0,
        });
      }

      // Adjust last shareholder to make total ownership exactly 100%
      const totalPercent = shareholders.reduce((sum, s) => sum + s.ownershipPercent, 0);
      if (totalPercent !== 100) {
        const diff = 100 - totalPercent;
        shareholders[shareholders.length - 1].ownershipPercent =
          Math.round((shareholders[shareholders.length - 1].ownershipPercent + diff) * 100) / 100;
      }

      const newSplit: SplitDetails = {
        itemName,
        totalValue,
        totalOwners: numOwners,
        nextPaymentDate: "June 25, 2026",
        shareholders,
      };

      setSplitDetails(newSplit);
      localStorage.setItem("neighbourly.splitDetails", JSON.stringify(newSplit));
      setLoading(false);
      alert("Split ownership created successfully!");
    }, 800);
  };

  const payShare = async () => {
    if (!splitDetails) return;

    let payAmount = 0;
    let alreadyPaid = false;

    const updatedShareholders = splitDetails.shareholders.map((owner) => {
      if (owner.name.includes("(You)") || owner.id === "1") {
        if (owner.amountPaid > 0) {
          alreadyPaid = true;
        }
        const shareAmount = (splitDetails.totalValue * owner.ownershipPercent) / 100;
        payAmount = shareAmount - owner.amountPaid;
        return {
          ...owner,
          amountPaid: Math.round(shareAmount),
        };
      }
      return owner;
    });

    if (alreadyPaid || payAmount <= 0) {
      alert("You have already paid your share for this asset!");
      return;
    }

    const updatedSplit = {
      ...splitDetails,
      shareholders: updatedShareholders,
    };

    setSplitDetails(updatedSplit);
    localStorage.setItem("neighbourly.splitDetails", JSON.stringify(updatedSplit));
    alert(`Payment of ₹${Math.round(payAmount)} successful!`);
  };

  useEffect(() => {
    getSplitDetails();
  }, []);

  return (
    <div className="grid w-full gap-10">
      {/* Header */}

      <PageHeader
        eyebrow="Ownership"
        title="Split Ownership"
        description="Create shared ownership, manage contributors, and track payments for expensive rental assets."
        actions={
          <Button onClick={payShare}>
            Pay Share
          </Button>
        }
      />

      {/* Stats */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] bg-surface-low p-6">
          <p className="text-sm text-ink-soft">
            Total Asset Value
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            ₹{splitDetails?.totalValue ?? 0}
          </h3>
        </div>

        <div className="rounded-[2rem] bg-surface-low p-6">
          <p className="text-sm text-ink-soft">
            Co-Owners
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {splitDetails?.totalOwners ?? 0}
          </h3>
        </div>

        <div className="rounded-[2rem] bg-surface-low p-6">
          <p className="text-sm text-ink-soft">
            Next Payment
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {splitDetails?.nextPaymentDate ?? "--"}
          </h3>
        </div>

        <div className="rounded-[2rem] bg-surface-low p-6">
          <p className="text-sm text-ink-soft">
            Asset
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {splitDetails?.itemName ?? "--"}
          </h3>
        </div>
      </section>

      {/* Create Split */}

      <section className="rounded-[2rem] bg-surface-low p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-strong">
            Create Split Ownership
          </h2>

          <p className="text-sm text-ink-soft">
            Register a new shared ownership asset.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border p-3"
            placeholder="Item ID"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Number of Owners"
            value={owners}
            onChange={(e) => setOwners(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <Button
            onClick={createSplit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Split"}
          </Button>
        </div>
      </section>

      {/* Shareholders */}

      <section className="rounded-[2rem] bg-surface-low p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-strong">
            Ownership Distribution
          </h2>

          <p className="text-sm text-ink-soft">
            Track each owner's contribution and stake.
          </p>
        </div>

        <div className="grid gap-4">
          {splitDetails?.shareholders?.map((owner) => (
            <div
              key={owner.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-white p-5"
            >
              <div>
                <h3 className="font-semibold">
                  {owner.name}
                </h3>

                <p className="text-sm text-ink-soft">
                  {owner.ownershipPercent}% Ownership
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary">
                  ₹{owner.amountPaid}
                </p>

                <p className="text-sm text-ink-soft">
                  Contributed
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment History */}

      <section className="rounded-[2rem] bg-surface-low p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-strong">
            Payment Schedule
          </h2>

          <p className="text-sm text-ink-soft">
            Upcoming contribution cycle for all co-owners.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Next Scheduled Payment
              </h3>

              <p className="text-sm text-ink-soft">
                {splitDetails?.nextPaymentDate ?? "--"}
              </p>
            </div>

            <Button onClick={payShare}>
              Pay Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}