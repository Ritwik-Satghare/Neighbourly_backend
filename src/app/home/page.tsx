import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#f5f7f6] min-h-screen text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-green-600 text-white">
        <h1 className="text-xl font-bold">Neighbourly</h1>
        <div className="flex gap-6 text-sm">
          <a href="#">Browse</a>
          <a href="#">How it works</a>
          <a href="#">List an item</a>
          <a href="#">Community</a>
        </div>
        <div className="flex gap-4 items-center">
          <span>🔍</span>
          <span>👤</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">
            Rent anything from your neighborhood
          </h2>
          <p className="text-gray-600 mb-6">
            Access high-quality tools, outdoor gear, and equipment without the
            commitment of buying.
          </p>

          {/* Search Box */}
          <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">
            <input
              className="border p-2 rounded w-full md:w-[30%]"
              placeholder="What are you looking for?"
            />
            <input
              className="border p-2 rounded w-full md:w-[25%]"
              placeholder="Location"
            />
            <input
              className="border p-2 rounded w-full md:w-[20%]"
              placeholder="Dates"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto">
              Search Now
            </button>
          </div>

          <p className="text-sm mt-4 text-gray-500">
            ⭐ 1,200+ reviews • 4.8 average rating
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <Image
            src="https://illustrations.popsy.co/amber/digital-nomad.svg"
            alt="hero"
            width={400}
            height={300}
            className="rounded-lg"
          />

          {/* Rating Card */}
          <div className="absolute bottom-4 left-4 bg-white shadow p-4 rounded-xl text-center">
            <h3 className="text-xl font-bold text-green-600">92%</h3>
            <p className="text-xs text-gray-500">Satisfaction rate</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-8">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Explore our library</h3>
          <a href="#" className="text-green-600 text-sm">
            Browse all categories →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["Tools", "Outdoor", "Kitchen", "Tech", "Sports"].map((cat) => (
            <div
              key={cat}
              className="bg-white p-4 rounded-xl shadow text-center"
            >
              <div className="text-2xl mb-2">📦</div>
              <p className="font-medium">{cat}</p>
              <p className="text-xs text-gray-500">20+ items</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="px-8 py-10">
        <h3 className="text-center text-xl font-semibold mb-8">
          How It Works
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Browse",
              desc: "Explore items shared by people in your community.",
            },
            {
              step: "02",
              title: "Book",
              desc: "Choose dates and book securely online.",
            },
            {
              step: "03",
              title: "Pickup",
              desc: "Meet your neighbor and pick up the item.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white p-6 rounded-xl shadow">
              <h4 className="text-green-600 font-bold text-lg">
                {item.step}
              </h4>
              <h5 className="font-semibold mt-2">{item.title}</h5>
              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-10">
        <h3 className="text-center text-xl font-semibold mb-6">
          Stories from the Block
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-600">
              “Needed a pressure washer for my driveway. Found one just two
              blocks away. Saved hundreds!”
            </p>
            <p className="mt-4 font-medium">— Daniel Torres</p>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-xl shadow">
            <p className="text-sm">
              “Neighbourly has turned my garage into a side hustle. I earn extra
              income renting out my tools.”
            </p>
            <p className="mt-4 font-medium">— Camila R.</p>
          </div>
        </div>
      </section>
    </div>
  );
}