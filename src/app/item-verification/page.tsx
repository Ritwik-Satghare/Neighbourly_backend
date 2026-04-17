import Image from "next/image";

export default function VerifyPage() {
  return (
    <div className="bg-[#f5f7f6] min-h-screen text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-green-700 font-bold text-lg">CommonGround</h1>

        <div className="flex gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-green-600">Browse</a>
          <a href="#" className="hover:text-green-600">My Rentals</a>
          <a href="#" className="hover:text-green-600">How it Works</a>
          <a href="#" className="hover:text-green-600">Support</a>
        </div>

        <div className="flex items-center gap-4">
          <span>🔔</span>
          <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
            👤
          </span>
        </div>
      </nav>

      {/* Content */}
      <div className="px-8 py-10 max-w-6xl mx-auto">
        {/* Heading */}
        <p className="text-sm text-gray-500 mb-2">
          ← Back to Rental
        </p>

        <h2 className="text-2xl font-bold mb-2">
          Verify Item Condition
        </h2>

        <p className="text-gray-600 mb-8">
          Compare the current state with the owner’s original photos to ensure total transparency.
        </p>

        {/* Image Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Original Image */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="font-medium">Original listing</p>
              <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">
                ✔ Condition Verified
              </span>
            </div>

            <div className="bg-black rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                alt="original"
                width={500}
                height={350}
                className="object-cover w-full h-[300px]"
              />
            </div>

            <div className="bg-gray-100 text-xs text-gray-500 p-2 rounded mt-2">
              Fujifilm X-T4 • 16-80mm lens
            </div>
          </div>

          {/* Upload Section */}
          <div>
            <p className="font-medium mb-2">Current State</p>

            <div className="border-2 border-dashed rounded-xl h-[300px] flex flex-col items-center justify-center text-gray-400">
              <div className="text-4xl mb-2">📷</div>
              <p className="font-medium">Upload Current Photo</p>
              <p className="text-xs">Capture item from multiple angles</p>
            </div>
          </div>
        </div>

        {/* Checklist Card */}
        <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
          <h3 className="font-semibold mb-4">Condition Checklist</h3>

          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Matches description
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Clean & well-maintained
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Fully functioning
            </label>
          </div>

          {/* Notes */}
          <textarea
            placeholder="Any minor scuffs or notes to mention?"
            className="w-full border rounded-lg p-3 text-sm mb-4"
            rows={3}
          />

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm text-gray-700 mb-4">
            <p className="font-medium text-green-700 mb-1">
              Neighbourly Guarantee
            </p>
            <p>
              Report discrepancies early. Everything is verified to ensure community trust.
            </p>
          </div>

          {/* Button */}
          <button className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition">
            Confirm Receipt & Complete
          </button>

          <p className="text-center text-xs text-red-500 mt-3 cursor-pointer">
            Report an issue
          </p>
        </div>
      </div>
    </div>
  );
}