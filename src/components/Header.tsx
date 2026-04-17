export default function Header() {
  return (
    <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
      
      {/* Left */}
      <div className="flex items-center gap-6">
        <h1 className="font-bold text-green-700">
          Neighbourly
        </h1>

        <nav className="flex gap-4 text-sm text-gray-600">
          <a className="font-medium text-black">Browse</a>
          <a>How it Works</a>
          <a>Sustainability</a>
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <input
          placeholder="Search tools, gear..."
          className="bg-gray-100 rounded-full px-4 py-2 text-sm w-72 outline-none"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded-full text-sm">
          List an Item
        </button>
      </div>
    </header>
  );
}