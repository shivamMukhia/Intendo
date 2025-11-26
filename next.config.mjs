/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.ytimg.com",   // for video thumbnails
      "yt3.ggpht.com", // for channel profile images
    ],
  },
};

export default nextConfig;

// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       "i.ytimg.com",   // for video thumbnails
//       "yt3.ggpht.com", // for channel profile images
//     ],
//   },
// };

// module.exports = nextConfig;
