export type NavItem = {
  href: string;
  label: string;
};

export type Category = {
  name: string;
  description: string;
  accent: string;
};

export type Listing = {
  id: string;
  title: string;
  category: string;
  distance: string;
  pricePerDay: number;
  rating: number;
  trustScore: number;
  image: string;
  summary: string;
  host: string;
  badge?: string;
};

export type UserListingStatus = "Active" | "Rented" | "Pending";

export type UserListing = {
  id: string;
  title: string;
  pricePerDay: number;
  status: UserListingStatus;
  image: string;
  category: string;
  summary: string;
  requests: number;
};

export type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  active?: boolean;
  online?: boolean;
};

export type LenderActivity = {
  title: string;
  detail: string;
  time: string;
};

export type VerificationChecklistItem = {
  id: string;
  label: string;
};

export const marketingNav: NavItem[] = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#trust", label: "Trust" },
];

export const workspaceNav: NavItem[] = [
  { href: "/home", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lender-dashboard", label: "Lender Dashboard" },
  { href: "/split-ownership", label: "Split Ownership" },
  { href: "/verify", label: "Verify" },
  { href: "/create-listing", label: "List an Item" },
  { href: "/messages", label: "Messages" },
];

export const footerLinks: NavItem[] = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
];

export const categories: Category[] = [
  { name: "Tools", description: "Drills, saws, ladders, repair kits.", accent: "bg-primary-fixed text-primary" },
  { name: "Outdoor", description: "Camping kits, bikes, grills, paddle boards.", accent: "bg-secondary-container text-secondary" },
  { name: "Kitchen", description: "Pizza ovens, mixers, air fryers, coolers.", accent: "bg-tertiary-fixed text-tertiary" },
  { name: "Tech", description: "Projectors, cameras, speakers, drones.", accent: "bg-surface-high text-ink-strong" },
];

export const listings: Listing[] = [
  {
    id: "stumpjumper-evo",
    title: "Specialized Stumpjumper EVO",
    category: "Outdoor",
    distance: "1.2km away",
    pricePerDay: 45,
    rating: 4.9,
    trustScore: 98,
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
    summary: "Trail-ready mountain bike tuned for weekend adventures.",
    host: "Avery Cole",
    badge: "New Listing",
  },
  {
    id: "karcher-k5",
    title: "Karcher K5 Premium Washer",
    category: "Tools",
    distance: "0.8km away",
    pricePerDay: 25,
    rating: 4.8,
    trustScore: 94,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
    summary: "High-pressure washer for driveways, decks, and patio resets.",
    host: "Sarah Mitchell",
  },
  {
    id: "yeti-tundra",
    title: "Yeti Tundra 45 Cooler",
    category: "Kitchen",
    distance: "2.4km away",
    pricePerDay: 15,
    rating: 5,
    trustScore: 99,
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
    summary: "Premium hard cooler for beach days, road trips, and parties.",
    host: "Maya Flores",
  },
  {
    id: "sony-alpha-kit",
    title: "Sony Alpha IV Creator Kit",
    category: "Tech",
    distance: "3.1km away",
    pricePerDay: 85,
    rating: 4.9,
    trustScore: 96,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    summary: "Mirrorless camera, lens, tripod, and creator mic bundle.",
    host: "Jordan Hale",
  },
  {
    id: "ooni-koda",
    title: "Ooni Koda 16 Pizza Oven",
    category: "Kitchen",
    distance: "0.5km away",
    pricePerDay: 35,
    rating: 5,
    trustScore: 100,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    summary: "Restaurant-style outdoor pizza nights without the ownership cost.",
    host: "Nina Brooks",
  },
  {
    id: "nebula-projector",
    title: "Anker Nebula 4K Projector",
    category: "Tech",
    distance: "4.2km away",
    pricePerDay: 40,
    rating: 4.9,
    trustScore: 95,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    summary: "Portable cinema setup for movie nights and presentations.",
    host: "Miles Turner",
  },
];

export const stats = [
  { label: "Total Earnings", value: "$1,200", note: "+12% from last month" },
  { label: "Active Rentals", value: "3", note: "2 due this week" },
  { label: "Trust Score", value: "98.5", note: "Excellent standing" },
  { label: "Total Listings", value: "14", note: "8 currently available" },
];

export const conversations: Conversation[] = [
  {
    id: "elena",
    name: "Elena Vance",
    preview: "Does the lawnmower come with the spare battery?",
    time: "2m ago",
    active: true,
    online: true,
  },
  { id: "marcus", name: "Marcus Thorne", preview: "Thanks again for the ladder!", time: "1h ago" },
  { id: "sarah", name: "Sarah Jenks", preview: "Is the projector available for Friday?", time: "3h ago" },
  { id: "david", name: "David Chen", preview: "Dropping the drill off this evening.", time: "Yesterday" },
];

export const notifications = [
  {
    title: "New rental request",
    body: "Elena wants the Pro-Grade Electric Mower for Saturday morning.",
    time: "2 minutes ago",
    tone: "bg-primary-fixed text-primary",
  },
  {
    title: "Trust milestone unlocked",
    body: "Your profile crossed a 98% trust score after your latest review.",
    time: "Today",
    tone: "bg-secondary-container text-secondary",
  },
  {
    title: "Listing performing well",
    body: "The Sony Alpha IV kit is trending in your neighborhood this week.",
    time: "Yesterday",
    tone: "bg-tertiary-fixed text-tertiary",
  },
];

export const dashboardLinks = [
  { href: "/home", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/browse", label: "Browse" },
  { href: "/lender-dashboard", label: "Lender Dashboard" },
  { href: "/split-ownership", label: "Split Ownership" },
  { href: "/create-listing", label: "Create Listing" },
  { href: "/messages", label: "Messages" },
  { href: "/notifications", label: "Notifications" },
  { href: "/verify", label: "Verify" },
];

export const userListings: UserListing[] = [
  {
    id: "karcher-k5",
    title: "Karcher K5 Premium Washer",
    pricePerDay: 25,
    status: "Active",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
    category: "Tools",
    summary: "Pressure washer kept in excellent condition with hose kit included.",
    requests: 4,
  },
  {
    id: "stumpjumper-evo",
    title: "Specialized Stumpjumper EVO",
    pricePerDay: 40,
    status: "Rented",
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
    category: "Outdoor",
    summary: "Trail-ready mountain bike currently out on a weekend booking.",
    requests: 7,
  },
  {
    id: "nebula-projector",
    title: "Anker Nebula 4K Projector",
    pricePerDay: 45,
    status: "Pending",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    category: "Tech",
    summary: "Cinema-ready projector with portable screen and cables.",
    requests: 2,
  },
  {
    id: "ooni-koda",
    title: "Ooni Koda 16 Pizza Oven",
    pricePerDay: 35,
    status: "Active",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    category: "Kitchen",
    summary: "Gas-fired pizza oven for backyard hosting nights.",
    requests: 5,
  },
];

export const lenderStats = [
  { label: "Total Earnings", value: "$4,820", note: "+18% month over month" },
  { label: "Active Listings", value: "8", note: "3 trending this week" },
  { label: "Completed Rentals", value: "126", note: "12 this month" },
  { label: "Trust Score", value: "99.1", note: "Top-tier lender profile" },
];

export const lenderActivities: LenderActivity[] = [
  {
    title: "New request for 4K Home Theater Projector",
    detail: "Elena requested Friday evening pickup and weekend return.",
    time: "8 minutes ago",
  },
  {
    title: "Weekly payout processed",
    detail: "$320 was transferred from three completed rentals.",
    time: "Today",
  },
  {
    title: "Listing boosted by community demand",
    detail: "The Outdoor Pizza Oven appeared in 14 new searches today.",
    time: "Yesterday",
  },
];

export const verificationImages = {
  before:
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
  after:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
};

export const verificationChecklist: VerificationChecklistItem[] = [
  { id: "description", label: "Matches original description" },
  { id: "damage", label: "No major damage detected" },
  { id: "clean", label: "Returned in clean condition" },
];

export function getListingById(id: string) {
  return listings.find((listing) => listing.id === id) ?? listings[0];
}
