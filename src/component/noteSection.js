// // // "use client";

// // // import Link from "next/link";

// // // export default function NotesSection({ videoId, thumbnail, notes }) {
// // //   return (
// // //     <div className="border rounded-lg p-4 shadow-md bg-white">
// // //       {/* Video thumbnail link */}
// // //       <Link href={`/watch?v=${videoId}`}>
// // //         <img
// // //           src={thumbnail}
// // //           alt="Video Thumbnail"
// // //           className="w-64 h-36 object-cover rounded-lg cursor-pointer hover:opacity-80"
// // //         />
// // //       </Link>

// // //       {/* Notes list */}
// // //       <ul className="mt-4 space-y-2">
// // //         {notes.map((n) => (
// // //           <li
// // //             key={n.id} // now guaranteed unique
// // //             className="p-2 bg-gray-50 rounded-md border"
// // //           >
// // //             <p>{n.note_text}</p>
// // //             <span className="text-xs text-gray-500">
// // //               {new Date(n.created_at).toLocaleString()}
// // //             </span>
// // //           </li>
// // //         ))}
// // //       </ul>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import Link from "next/link";

// // // Pastel color palette (Google Keep-like)
// // const pastelColors = [
// //   "bg-yellow-100",
// //   "bg-pink-100",
// //   "bg-blue-100",
// //   "bg-green-100",
// //   "bg-purple-100",
// //   "bg-orange-100",
// // ];

// // export default function NotesSection({ videoId, thumbnail, notes }) {
// //   // Pick random color for each section (like Keep cards)
// //   const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];

// //   return (
// //     <div
// //       className={`rounded-xl shadow-md p-4 transition hover:shadow-lg ${color}`}
// //     >
// //       {/* Video thumbnail */}
// //       <Link href={`/watch?v=${videoId}`}>
// //         <img
// //           src={thumbnail}
// //           alt="Video Thumbnail"
// //           className="w-full h-40 object-cover rounded-lg cursor-pointer mb-3"
// //         />
// //       </Link>

// //       {/* Notes like sticky cards */}
// //       <div className="flex flex-wrap gap-2">
// //         {notes.map((n) => (
// //           <div
// //             key={n.id}
// //             className="bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition text-sm max-w-xs"
// //           >
// //             <p className="text-gray-800">{n.note_text}</p>
// //             <span className="block text-[11px] text-gray-500 mt-1">
// //               {new Date(n.created_at).toLocaleString()}
// //             </span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }



// "use client";

// import Link from "next/link";

// const pastelColors = [
//   "bg-yellow-100",
//   "bg-pink-100",
//   "bg-blue-100",
//   "bg-green-100",
//   "bg-purple-100",
//   "bg-orange-100",
// ];

// export default function NotesSection({ videoId, thumbnail, notes }) {
//   // Pick random pastel color for card
//   const color =
//     pastelColors[Math.floor(Math.random() * pastelColors.length)];

//   return (
//     <div
//       className={`rounded-xl shadow-md p-4 transition hover:shadow-lg break-inside-avoid ${color}`}
//     >
//       {/* Card layout: image left, notes right */}
//       <div className="flex flex-wrap gap-3">
//         {/* Thumbnail */}
//         <Link href={`/watch?v=${videoId}`}>
//           <img
//             src={thumbnail}
//             alt="Video Thumbnail"
//             className="w-28 h-20 object-cover rounded-md cursor-pointer hover:opacity-80"
//           />
//         </Link>

//         {/* Notes beside image */}
//         <div className="flex-1 min-w-[200px]">
//           {notes.map((n) => (
//             <div
//               key={n.id}
//               className="bg-white rounded-md px-3 py-2 mb-2 shadow-sm hover:shadow-md transition text-sm"
//             >
//               <p className="text-gray-800">{n.note_text}</p>
//               <span className="block text-[11px] text-gray-500 mt-1">
//                 {new Date(n.created_at).toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


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

