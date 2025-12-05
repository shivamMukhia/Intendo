// /** @format */

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSubscriptions } from "@/context/subscriptionContext";
// import NotesSection from "@/component/noteSection";

// export default function NotesPage() {
// 	const [notes, setNotes] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const { user } = useSubscriptions();

// 	useEffect(() => {
// 		const fetchNotes = async () => {
// 			if (!user) return; // wait until user is ready

// 			try {
// 				const token = await user.getIdToken();
// 				const res = await axios.get("/api/notes/getUserNotes", {
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 					},
// 				});
// 				setNotes(res.data);
// 			} catch (err) {
// 				console.error("Error fetching notes:", err);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchNotes();
// 	}, [user]);

// 	// Different loading states
// 	if (!user) return <p className='text-center'>Checking user...</p>;
// 	if (loading) return <p className='text-center'>Loading notes...</p>;
// 	if (notes.length === 0) return <p className='text-center'>No notes yet!</p>;

// 	// Group notes by videoId
// 	const grouped = notes.reduce((acc, note) => {
// 		if (!acc[note.video_id]) {
// 			acc[note.video_id] = {
// 				thumbnail: note.video_thumbnail,
// 				notes: [],
// 			};
// 		}
// 		acc[note.video_id].notes.push(note);
// 		return acc;
// 	}, {});

// 	return (
		
// 		<div className='p-6'>
// 			<h1 className='text-2xl font-bold mb-6'>My Notes</h1>

// 			<div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'>
// 				{Object.entries(grouped).map(([videoId, { thumbnail, notes }]) => (
// 					<NotesSection
// 						key={videoId}
// 						videoId={videoId}
// 						thumbnail={thumbnail}
// 						notes={notes}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// }


/** @format */

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSubscriptions } from "@/context/subscriptionContext";
import NotesSection from "@/component/noteSection";
import Link from "next/link";
import { Bold, Weight } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSubscriptions();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await axios.get("/api/notes/getUserNotes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  if (!user) return <p className="text-center">Checking user...</p>;
  if (loading) return <p className="text-center">Loading notes...</p>;
  if (notes.length === 0) return <p className="text-center">No notes yet!</p>;

  const grouped = notes.reduce((acc, note) => {
    if (!acc[note.video_id]) {
      acc[note.video_id] = {
        thumbnail: note.video_thumbnail,
        notes: [],
      };
    }
    acc[note.video_id].notes.push(note);
    return acc;
  }, {});

  return (
    <div className="p-6">

      {/* ---------- SIMPLE TOP NAVBAR ---------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
          marginBottom: "20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* LEFT SIDE - PAGE TITLE */}
        <h1 className="text-2xl font-bold">My Notes</h1>

        {/* RIGHT SIDE - INTENDO BUTTON */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "white",
            color: "black",
            textDecoration: "none",
            fontWeight:"bold",
            fontSize:"20px",
          }}
        >
          {/* Replace this image later */}
          <img
            src="/intendo.png" // <--- put your image here
            alt="play"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
            }}
          />

          <span>Intendo</span>
        </Link>
      </div>
      {/* ---------- END NAVBAR ---------- */}

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {Object.entries(grouped).map(([videoId, { thumbnail, notes }]) => (
          <NotesSection
            key={videoId}
            videoId={videoId}
            thumbnail={thumbnail}
            notes={notes}
          />
        ))}
      </div>
    </div>
  );
}
