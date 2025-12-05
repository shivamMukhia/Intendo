
"use client";
import Link from "next/link";

export default function AuthNavbar() {
  return (
    <nav className="w-full py-2 px-7 flex items-center bg-white">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="intendo.png"
          alt="logo"
          className="w-10 h-10 rounded"
        />
        <span className="text-xl font-semibold">Intendo</span>
      </Link>
    </nav>
  );
}
