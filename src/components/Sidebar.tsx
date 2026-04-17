export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#f3f4f6] p-6 border-r min-h-screen">
      
      <h2 className="font-semibold mb-6">Filters</h2>

      <div className="space-y-6 text-sm">

        {/* Categories */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2">
            Categories
          </p>

          {["Tools", "Kitchen", "Outdoor", "Tech", "Party"].map((c) => (
            <label key={c} className="flex items-center gap-2 mb-2">
              <input type="checkbox" />
              {c}
            </label>
          ))}
        </div>

        {/* Distance */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2">
            Distance
          </p>

          <div className="flex gap-2 flex-wrap">
            {["2km", "5km", "10km", "20km"].map((d) => (
              <button
                key={d}
                className="px-3 py-1 border rounded-full text-xs"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2">
            Price Range
          </p>
          <input type="range" className="w-full" />
        </div>

        {/* Trust Box */}
        <div className="bg-green-50 p-3 rounded-lg text-xs">
          <p className="font-semibold text-green-700">
            90% Trust Score
          </p>
          <p className="text-gray-500">
            Only verified neighbors
          </p>
        </div>

        {/* Instant Book */}
        <div className="flex justify-between items-center">
          <span>Instant Book</span>
          <input type="checkbox" />
        </div>

      </div>
    </aside>
  );
}