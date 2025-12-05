"use client";

import Link from "next/link";

const pastelColors = [
  "bg-yellow-100",
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-orange-100",
];

export default function NotesSection({ videoId, thumbnail, notes }) {
  // Pick random pastel color for card
  const color =
    pastelColors[Math.floor(Math.random() * pastelColors.length)];

  return (
    <div
      className={`rounded-xl shadow-md p-4 transition hover:shadow-lg break-inside-avoid ${color}`}
    >
      {/* Card layout: image left, notes right */}
      <div className="flex flex-wrap gap-4">
        {/* Thumbnail */}
        <Link href={`/watch?v=${videoId}`}>
          <img
            src={thumbnail}
            alt="Video Thumbnail"
            className="w-44 h-28 object-cover rounded-lg cursor-pointer hover:opacity-80"
          />
        </Link>

        {/* Notes beside image */}
        <div className="flex-1 min-w-[220px]">
          {notes.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-md px-3 py-2 mb-2 shadow-sm hover:shadow-md transition text-sm"
            >
              <p className="text-gray-800">{n.note_text}</p>
              <span className="block text-[11px] text-gray-500 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

