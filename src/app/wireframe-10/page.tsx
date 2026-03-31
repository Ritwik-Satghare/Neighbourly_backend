"use client";

import { useEffect, useState } from "react";
import PageHeader from '../../components/pageHeader'; 

interface Notification {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
}

export default function Notifications() {
  const [data, setData] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=6",
      );
      const json = await res.json();

      const mapped = json.map((item: any) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        createdAt: new Date(Date.now() - Math.random() * 100000000),
      }));

      setData(mapped);
    };

    fetchNotifications();
  }, []);

  const getDayLabel = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <>
      <div className="hidden md:block sticky top-0 z-50 backdrop-blur-md bg-white/70">
        <PageHeader />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-blue-300 to-blue-200 p-4 md:p-8 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl"></div>

        <div className="relative max-w-3xl mx-auto mt-10">
          <div className="bg-white/80 backdrop-blur-md border rounded-3xl p-4 space-y-4 shadow-lg">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white rounded-2xl p-4 border hover:shadow-md transition"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  🔔
                </div>

                {/* Content */}
                <div>
                  <p className="text-xs text-gray-400">
                    {getDayLabel(item.createdAt)}
                  </p>
                  <h3 className="font-semibold text-sm md:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
