import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { conversations } from "@/lib/data";

export default function MessagesPage() {
  const active = conversations[0];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Conversations, rental context, and negotiation UI are now structured React components inside the shared workspace shell."
      />
      <div className="grid overflow-hidden rounded-[2rem] bg-surface-card shadow-ambient lg:grid-cols-[320px_1fr]">
        <section className="border-b border-outline/20 p-4 lg:border-b-0 lg:border-r">
          <div className="grid gap-3">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`rounded-[1.5rem] p-4 ${conversation.active ? "bg-surface-low" : "hover:bg-surface-low"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink-strong">{conversation.name}</p>
                    <p className="mt-1 text-sm text-ink-soft">{conversation.preview}</p>
                  </div>
                  <span className="text-xs font-medium text-ink-soft">{conversation.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-6 p-6">
          <div className="flex items-center justify-between border-b border-outline/20 pb-4">
            <div>
              <h2 className="font-headline text-2xl font-bold text-ink-strong">{active.name}</h2>
              <p className="text-sm text-primary">Verified neighbor</p>
            </div>
            <Button href="/item/karcher-k5" variant="secondary">
              View item
            </Button>
          </div>
          <div className="max-w-md rounded-[1.5rem] bg-surface-low p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Rental context</p>
            <p className="mt-2 font-semibold text-ink-strong">Pro-Grade Electric Mower</p>
            <p className="mt-1 text-sm text-ink-soft">$25 / day • High demand this weekend</p>
          </div>
          <div className="grid gap-4">
            <div className="max-w-xl rounded-[1.5rem] rounded-bl-md bg-surface-low px-5 py-4 text-sm text-ink-strong">
              Hi there. Is the mower available on Saturday morning, and does it include the spare battery?
            </div>
            <div className="ml-auto max-w-xl rounded-[1.5rem] rounded-br-md bg-brand-gradient px-5 py-4 text-sm text-white">
              Yes, it is. I can include the spare battery and a quick walkthrough at pickup.
            </div>
            <div className="max-w-xl rounded-[1.5rem] bg-surface-card p-5 shadow-ambient">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Bargain corner</p>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-ink-soft">Current offer</p>
                  <p className="font-headline text-4xl font-extrabold text-ink-strong">$22.00</p>
                </div>
                <div className="flex gap-3">
                  <Button href="/messages" variant="secondary">
                    Counter
                  </Button>
                  <Button href="/verify">Accept offer</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 rounded-[1.5rem] bg-surface-low p-3">
            <input
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              placeholder="Type your message..."
              type="text"
            />
            <Button href="/messages">Send</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
