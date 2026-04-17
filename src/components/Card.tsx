import Image from "next/image";
import { Heart } from "lucide-react";

export default function Card({
  title,
  price,
  rating,
  image,
  tag,
}: any) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition">

      {/* Image Tile */}
      <div className="relative h-44 rounded-xl bg-[#0f172a] overflow-hidden flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4"
        />

        {/* Heart */}
        <button className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
          <Heart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium">
          {title}
        </h3>

        <p className="text-xs text-gray-500">
          1.2km away • Tools
        </p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-semibold">
            ${price}
            <span className="text-gray-400 text-xs"> /day</span>
          </span>

          <span className="text-xs">⭐ {rating}</span>
        </div>

        <div className="mt-2">
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}