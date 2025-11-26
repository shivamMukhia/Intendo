/** @format */

"use client";
import Image from "next/image";
import Link from "next/link";

export default function VideoCard({
	thumbnail,
	title,
	channelImage,
	channelName,
	views,
	timestamp,
	videoId,
	small = false,
}) {
	return (
		<Link href={`/watch?v=${videoId}`}>
			<div
				className={`flex ${
					small ? "flex-row gap-3" : "flex-col"
				} w-full max-w-sm cursor-pointer`}>
				{/* Thumbnail */}
				<div
					className={`relative ${
						small ? "w-40 h-24" : "w-full h-48"
					} bg-gray-200 rounded-lg overflow-hidden`}>
					<Image
						src={thumbnail}
						alt={title}
						fill
						className='object-cover'
						sizes='100vw'
					/>
				</div>

				{/* Video Info */}
				<div className={`${small ? "flex-1" : "mt-3"} flex gap-3`}>
					{/* Channel Image */}
					{!small && (
						<Image
							src={channelImage}
							alt={channelName}
							width={40}
							height={40}
							className='w-10 h-10 rounded-full object-cover shrink-0'
						/>
					)}

					<div>
						<h3 className='text-sm font-semibold line-clamp-2'>{title}</h3>
						<p className='text-xs text-gray-600'>{channelName}</p>
						<p className='text-xs text-gray-500'>
							{views} • {timestamp}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
}
