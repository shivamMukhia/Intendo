
"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth } from "@/helper/firebase";
import axios from "axios";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // 🔹 Feed preferences
  const [hideFeed, setHideFeed] = useState(false);
  const [subsOnly, setSubsOnly] = useState(false);
  const [eduOnly, setEduOnly] = useState(false);

  // ⬇️ Helper to fetch preferences from backend
  const fetchPreferences = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get("/api/preference", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { hide_feed, edu_only, subs_only } = res.data;
      setHideFeed(hide_feed);
      setEduOnly(edu_only);
      setSubsOnly(subs_only);
      setPrefsLoaded(true); // mark as loaded ✅
    } catch (err) {
      console.error("Error fetching preferences:", err);
    }
  }, []);

  // ⬇️ Helper to update preferences in backend
  const savePreferences = useCallback(
    async (prefs) => {
      if (!auth.currentUser) return;
      try {
        const token = await auth.currentUser.getIdToken();
        await axios.post("/api/preference", prefs, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error saving preferences:", err);
      }
    },
    []
  );

// ⬇️ Watch toggle changes and sync with backend
useEffect(() => {
  if (user && prefsLoaded) {
    savePreferences({ hide_feed: hideFeed, edu_only: eduOnly, subs_only: subsOnly });
  }
}, [hideFeed, eduOnly, subsOnly, user, prefsLoaded, savePreferences]);
  useEffect(() => {
    async function fetchSubscriptions() {
      if (!auth.currentUser) {
        setUser(null);
        setChannels([]);
        setLoading(false);
        return;
      }

      try {
        setUser(auth.currentUser);
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get("/api/subscribe/getChannel", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChannels(res.data);

        // also fetch preferences
        await fetchPreferences();
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser || null);
      if (firebaseUser) {
        fetchSubscriptions();
        fetchPreferences();
      }
    });

    return () => unsubscribe();
  }, [fetchPreferences]);

  const subscribeChannel = (ch) => {
    setChannels((prev) => {
      if (prev.some((c) => c.firebase_uid === ch.firebase_uid)) return prev;
      return [...prev, ch];
    });
  };

  const unsubscribeChannel = (id) => {
    setChannels((prev) => prev.filter((c) => c.firebase_uid !== id));
  };

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        channels,
        loading,
        subscribeChannel,
        unsubscribeChannel,

        // feed preferences
        hideFeed,
        setHideFeed,
        subsOnly,
        setSubsOnly,
        eduOnly,
        setEduOnly,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscriptions = () => useContext(SubscriptionContext);
