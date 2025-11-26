"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"; // Adjust this import based on your icon library

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex-grow mx-10 max-w-2xl"
    >
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full border border-gray-300 rounded-l-full px-4 py-1 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-gray-100 border border-gray-300 rounded-r-full px-4"
        >
          <Search className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </form>
  );
}
