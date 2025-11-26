
'use client';

import { useSubscriptions } from '@/context/subscriptionContext';
import VideoGrid from '@/component/VideoGrid';
import MotivationQuote from '@/component/MotivationQuote';
import GuestFeed from './guestFeed';
import { useEffect, useState } from 'react';

export default function HomeFeed() {
  const { user, hideFeed, eduOnly, subsOnly } = useSubscriptions();
  const [reloadKey, setReloadKey] = useState(0);

  // 🔹 Whenever eduOnly or subsOnly changes → force VideoGrid re-mount
  useEffect(() => {
    if (user) {
      setReloadKey((prev) => prev + 1);
    }
  }, [eduOnly, subsOnly, user]);

  // 🔹 If hideFeed is true → show motivation
  if (hideFeed) {
    return <MotivationQuote />;
  }

  return (
    <main className="p-4 bg-gray-100 min-h-screen">
      {user ? (
        <VideoGrid key={reloadKey} eduOnly={eduOnly} subsOnly={subsOnly} />
      ) : (
        <GuestFeed />
      )}
    </main>
  );
}
