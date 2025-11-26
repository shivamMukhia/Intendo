// // 'use client';

// // import { useState } from 'react';

// // const pastelColors = [
// //   "bg-yellow-50",
// //   "bg-blue-50",
// //   "bg-green-50",
// //   "bg-pink-50",
// //   "bg-purple-50",
// //   "bg-orange-50",
// // ];

// // export default function TakeNotesSection({ videoId }) {
// //   const [notes, setNotes] = useState('');
// //   const [savedNotes, setSavedNotes] = useState([]);

// //   const handleSave = () => {
// //     if (!notes.trim()) return;
// //     const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
// //     setSavedNotes([{ text: notes, date: new Date(), color }, ...savedNotes]);
// //     setNotes('');
// //   };

// //   return (
// //     <div className="flex flex-col h-full bg-neutral-100 rounded-xl shadow-lg p-3">
// //       {/* Input Box */}
// //       <div className="bg-white rounded-xl shadow-md p-3 mb-4">
// //         <textarea
// //           value={notes}
// //           onChange={(e) => setNotes(e.target.value)}
// //           placeholder="✏️ Take a note..."
// //           className="w-full resize-none p-2 rounded-md bg-gray-50 focus:bg-white focus:outline-none text-sm placeholder-gray-600"
// //           rows={3}
// //         />
// //         <div className="flex justify-end mt-2">
// //           <button
// //             onClick={handleSave}
// //             className="px-4 py-1 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition"
// //           >
// //             Save
// //           </button>
// //         </div>
// //       </div>

// //       {/* Notes List */}
// //       <div className="flex-1 overflow-y-auto pr-1">
// //         {savedNotes.length === 0 ? (
// //           <p className="text-gray-500 text-center mt-10">No notes yet</p>
// //         ) : (
// //           <div className="grid gap-3">
// //             {savedNotes.map((note, i) => (
// //               <div
// //                 key={i}
// //                 className={`rounded-lg shadow-sm p-3 ${note.color} hover:shadow-md transition`}
// //               >
// //                 <p className="text-sm text-gray-800">{note.text}</p>
// //                 <span className="block text-xs text-gray-500 mt-2">
// //                   {note.date.toLocaleDateString()}{" "}
// //                   {note.date.toLocaleTimeString([], {
// //                     hour: "2-digit",
// //                     minute: "2-digit",
// //                   })}
// //                 </span>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import { Trash } from 'lucide-react';
// import { useSubscriptions } from '@/context/subscriptionContext';

// const pastelColors = [
//   "bg-yellow-50",
//   "bg-blue-50",
//   "bg-green-50",
//   "bg-pink-50",
//   "bg-purple-50",
//   "bg-orange-50",
// ];

// export default function TakeNotesSection({ videoId, videoThumbnail }) {
//   const [notes, setNotes] = useState('');
//   const [savedNotes, setSavedNotes] = useState([]);
//   const {user} = useSubscriptions();

//   const handleSave = async () => {
//     if (!notes.trim()) return;
//     const token = await user.getIdToken();

//     try {
//       const res = await axios.post('/api/notes/takeNotes', {
//         videoId,
//         videoThumbnail,
//         noteText: notes,
//       },
//        {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//     );

//       const newNote = res.data;
//       const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
//       setSavedNotes([{ ...newNote, color }, ...savedNotes]);
//       setNotes('');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {

//     try {
//       const token = await user.getIdToken();
//       await axios.delete(`/api/notes/deleteNotes/${id}`,
//            {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setSavedNotes(savedNotes.filter((note) => note.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-neutral-100 rounded-xl shadow-lg p-3">
//       {/* Input Box */}
//       <div className="bg-white rounded-xl shadow-md p-3 mb-4">
//         <textarea
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           placeholder="✏️ Take a note..."
//           className="w-full resize-none p-2 rounded-md bg-gray-50 focus:bg-white focus:outline-none text-sm placeholder-gray-600"
//           rows={3}
//         />
//         <div className="flex justify-end mt-2">
//           <button
//             onClick={handleSave}
//             className="px-4 py-1 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition"
//           >
//             Save
//           </button>
//         </div>
//       </div>

//       {/* Notes List */}
//       <div className="flex-1 overflow-y-auto pr-1">
//         {savedNotes.length === 0 ? (
//           <p className="text-gray-500 text-center mt-10">No notes yet</p>
//         ) : (
//           <div className="grid gap-3">
//             {savedNotes.map((note) => (
//               <div
//                 key={note.id}
//                 className={`rounded-lg shadow-sm p-3 ${note.color} hover:shadow-md transition relative`}
//               >
//                 <p className="text-sm text-gray-800">{note.note_text}</p>
//                 <span className="block text-xs text-gray-500 mt-2">
//                   {new Date(note.created_at).toLocaleDateString()}{" "}
//                   {new Date(note.created_at).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </span>
//                 <button
//                   onClick={() => handleDelete(note.id)}
//                   className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
//                 >
//                   <Trash size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useSubscriptions } from '@/context/subscriptionContext';

const pastelColors = [
  "bg-yellow-50",
  "bg-blue-50",
  "bg-green-50",
  "bg-pink-50",
  "bg-purple-50",
  "bg-orange-50",
];

export default function TakeNotesSection({ videoId, videoThumbnail }) {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const { user } = useSubscriptions();

  // Fetch existing notes for this video
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      const token = await user.getIdToken();

      try {
        const res = await axios.get(`/api/notes/getNotes/${videoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Add colors for UI
        const notesWithColors = res.data.map((note) => ({
          ...note,
          color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        }));

        setSavedNotes(notesWithColors);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [videoId, user]);

  // Save new note
  const handleSave = async () => {
    if (!notes.trim()) return;
    const token = await user.getIdToken();

    try {
      const res = await axios.post(
        '/api/notes/takeNotes',
        {
          videoId,
          videoThumbnail,
          noteText: notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newNote = res.data;
      const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      setSavedNotes([{ ...newNote, color }, ...savedNotes]);
      setNotes('');
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`/api/notes/deleteNotes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedNotes(savedNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 rounded-xl shadow-lg p-3">
      {/* Input Box */}
      <div className="bg-white rounded-xl shadow-md p-3 mb-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="✏️ Take a note..."
          className="w-full resize-none p-2 rounded-md bg-gray-50 focus:bg-white focus:outline-none text-sm placeholder-gray-600"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {savedNotes.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No notes yet</p>
        ) : (
          <div className="grid gap-3">
            {savedNotes.map((note) => (
              <div
                key={note.id}
                className={`rounded-lg shadow-sm p-3 ${note.color} hover:shadow-md transition relative`}
              >
                <p className="text-sm text-gray-800">{note.note_text}</p>
                <span className="block text-xs text-gray-500 mt-2">
                  {new Date(note.created_at).toLocaleDateString()}{" "}
                  {new Date(note.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
