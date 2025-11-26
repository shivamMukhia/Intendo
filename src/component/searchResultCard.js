"use client";
import Image from "next/image";
import Link from "next/link";

export default function SearchResultCard({ video }) {
  const {
    id: { videoId },
    snippet,
  } = video;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-2 border-b border-gray-200">
      {/* Thumbnail */}
      <Link href={`/watch?v=${videoId}`} className="shrink-0 w-full sm:w-60 h-36 relative">
        <Image
          src={snippet.thumbnails.medium.url}
          alt={snippet.title}
          fill
          className="object-cover rounded-lg"
        />
      </Link>

      {/* Video Info */}
      <div className="flex flex-col justify-between">
        <Link href={`/watch?v=${videoId}`}>
          <h3 className="text-lg font-semibold text-black hover:text-red-600 line-clamp-2">
            {snippet.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">{snippet.channelTitle}</p>
        <p className="text-sm text-gray-500">1.2M views • 2 years ago</p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
          {snippet.description}
        </p>
      </div>
    </div>
  );
}
