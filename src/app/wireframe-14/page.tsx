// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import PageHeader from '../../components/pageHeader'; 

interface Item {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  stock: number;
  thumbnail: string;
  description: string;
  location: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, usersRes] = await Promise.all([
        fetch("https://dummyjson.com/products"),
        fetch("https://dummyjson.com/users"),
      ]);

      const productsData = await productsRes.json();
      const usersData = await usersRes.json();

      const users = usersData.users;

      const mapped = productsData.products.map((item: any, index: number) => {
        const user = users[index % users.length];

        return {
          id: item.id,
          title: item.title,
          price: item.price,
          rating: item.rating,
          brand: item.brand,
          category: item.category,
          stock: item.stock,
          thumbnail: item.thumbnail,
          description: item.description,
          location: `${user.address.city}, ${user.address.state}`,
        };
      });

      setItems(mapped);
    };

    fetchData();
  }, []);

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="hidden md:block sticky top-0 z-50 backdrop-blur-md bg-white/70">
        <PageHeader />
      </div>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-400 via-blue-300 to-blue-200 p-4 md:p-8">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
        {/* Search Bar */}
        <div className="max-w-5xl mx-auto mt-6 bg-white rounded-full flex items-center px-4 py-2 shadow-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none px-3 py-2"
            placeholder="Search products..."
          />
          <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full">
            Search
          </button>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid max-w-6xl mx-auto mt-8 grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-48 object-contain rounded-xl"
              />

              <div className="mt-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg line-clamp-1">
                  {item.title}
                </h2>
                <span className="text-yellow-500 text-sm">
                  ⭐ {item.rating}
                </span>
              </div>

              <p className="text-gray-800 font-medium">₹{item.price} / day</p>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-2 text-xs text-gray-400">
                <p>Brand: {item.brand}</p>
                <p>Category: {item.category}</p>
                <p>Stock: {item.stock}</p>
                <p>📍 {item.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden mt-8 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex bg-white rounded-2xl shadow-md p-3 gap-3"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-28 h-28 object-contain rounded-lg"
              />

              <div className="flex flex-col justify-between">
                <h2 className="font-semibold line-clamp-1">{item.title}</h2>
                <p className="text-sm text-gray-700">₹{item.price} / day</p>
                <p className="text-xs text-gray-500">⭐ {item.rating}</p>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {item.description}
                </p>
                <p className="text-xs text-gray-400">{item.brand}</p>
                <p className="text-xs text-gray-400">📍 {item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
