import Link from "next/link";

const pages = [
  { name: "Add Listing", path: "/add-listing" },
  { name: "After Picture", path: "/after-picture" },
  { name: "Before Picture", path: "/before-picture" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Login", path: "/login" },
  { name: "Messages", path: "/messages" },
  { name: "My Bookings", path: "/my-bookings" },
  { name: "My Listings", path: "/my-listings" },
  { name: "Product Details", path: "/product-details" },
  { name: "Signup", path: "/signup" },
  { name: "Landing Page", path: "/landing-page" },
  { name: "Home Page", path: "/home" },
  { name: "Lender Dashboard", path: "/lender-dashboard" },
  { name: "Item Verification", path: "/item-verification" },
  { name: "Welcome", path: "/welcome" },
  { name: "Wireframe 5", path: "/wireframe-5" },
  { name: "Wireframe 10", path: "/wireframe-10" },
  { name: "Wireframe 14", path: "/wireframe-14" },
];

export default function Home() {
  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        🚀 Test All Pages
      </h1>

      <div style={{ display: "grid", gap: "10px" }}>
        {pages.map((page, index) => (
          <Link key={index} href={page.path}>
            <div
              style={{
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {page.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}