import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";

export default function CreateListingPage() {
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Host"
        title="Create a new listing"
        description="A clean reusable form replaces the original static HTML and routes hosts back into the dashboard flow."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form className="grid gap-6 rounded-[2rem] bg-surface-card p-8 shadow-ambient">
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Listing title" placeholder="Professional Power Drill" />
            <Input label="Category" placeholder="Tools" />
          </div>
          <Input label="Short description" placeholder="Perfect for weekend home projects and quick repairs." />
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Daily price" placeholder="$25" />
            <Input label="Pickup neighborhood" placeholder="Greenpoint, Brooklyn" />
          </div>
          <label className="grid gap-2 text-sm font-medium text-ink-soft">
            <span>Condition notes</span>
            <textarea
              className="min-h-40 rounded-2xl border border-transparent bg-surface-low px-4 py-3 outline-none transition focus:border-primary/40 focus:bg-surface-card"
              placeholder="Explain what’s included, how to use it safely, and any wear to expect."
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <Button href="/dashboard">Publish listing</Button>
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
