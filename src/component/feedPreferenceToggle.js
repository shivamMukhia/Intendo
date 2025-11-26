"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSubscriptions } from "@/context/subscriptionContext"; // import context

export default function FeedPreferenceToggles() {
  const { hideFeed, setHideFeed, eduOnly, setEduOnly, subsOnly, setSubsOnly } =
    useSubscriptions();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="hideFeed">Hide Home Feed</Label>
        <Switch id="hideFeed" checked={hideFeed} onCheckedChange={setHideFeed} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="eduOnly">Education Only</Label>
        <Switch id="eduOnly" checked={eduOnly} onCheckedChange={setEduOnly} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="subsOnly">Subscribed Only</Label>
        <Switch id="subsOnly" checked={subsOnly} onCheckedChange={setSubsOnly} />
      </div>
    </div>
  );
}
