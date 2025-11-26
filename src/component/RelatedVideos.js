'use client';

import VideoCard from '@/component/videoCard';

export default function RelatedVideos({ videos }) {
  return (
    <div>
      <h2 className="font-bold mb-2">Up Next</h2>
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            thumbnail={video.snippet.thumbnails.medium.url}
            title={video.snippet.title}
            channelName={video.snippet.channelTitle}
            views={`${parseInt(video.statistics.viewCount).toLocaleString()} views`}
            timestamp={new Date(video.snippet.publishedAt).toDateString()}
            videoId={video.id}
            small
          />
        ))}
      </div>
    </div>
  );
}
