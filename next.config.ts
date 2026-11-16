import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // Old host -> new domain (keeps any path).
      {
        source: "/:path*",
        has: [{ type: "host", value: "globalbizzhub.vercel.app" }],
        destination: "https://www.globalbizzhub.com/:path*",
        permanent: true,
      },
      // Short city URLs (e.g. /multan) never existed as routes;
      // the real pages live at /directories/<country>/<city>.
      {
        source: "/faisalabad",
        destination: "https://www.globalbizzhub.com/directories/pakistan/faisalabad",
        permanent: true,
      },
      {
        source: "/gujranwala",
        destination: "https://www.globalbizzhub.com/directories/pakistan/gujranwala",
        permanent: true,
      },
      {
        source: "/hyderabad",
        destination: "https://www.globalbizzhub.com/directories/pakistan/hyderabad",
        permanent: true,
      },
      {
        source: "/islamabad",
        destination: "https://www.globalbizzhub.com/directories/pakistan/islamabad",
        permanent: true,
      },
      {
        source: "/karachi",
        destination: "https://www.globalbizzhub.com/directories/pakistan/karachi",
        permanent: true,
      },
      {
        source: "/lahore",
        destination: "https://www.globalbizzhub.com/directories/pakistan/lahore",
        permanent: true,
      },
      {
        source: "/multan",
        destination: "https://www.globalbizzhub.com/directories/pakistan/multan",
        permanent: true,
      },
      {
        source: "/peshawar",
        destination: "https://www.globalbizzhub.com/directories/pakistan/peshawar",
        permanent: true,
      },
      {
        source: "/rawalpindi",
        destination: "https://www.globalbizzhub.com/directories/pakistan/rawalpindi",
        permanent: true,
      },
      {
        source: "/sialkot",
        destination: "https://www.globalbizzhub.com/directories/pakistan/sialkot",
        permanent: true,
      },
      {
        source: "/sukkur",
        destination: "https://www.globalbizzhub.com/directories/pakistan/sukkur",
        permanent: true,
      },
      {
        source: "/austin",
        destination: "https://www.globalbizzhub.com/directories/usa/austin",
        permanent: true,
      },
      {
        source: "/buffalo",
        destination: "https://www.globalbizzhub.com/directories/usa/buffalo",
        permanent: true,
      },
      {
        source: "/chicago",
        destination: "https://www.globalbizzhub.com/directories/usa/chicago",
        permanent: true,
      },
      {
        source: "/dallas",
        destination: "https://www.globalbizzhub.com/directories/usa/dallas",
        permanent: true,
      },
      {
        source: "/houston",
        destination: "https://www.globalbizzhub.com/directories/usa/houston",
        permanent: true,
      },
      {
        source: "/los-angeles",
        destination: "https://www.globalbizzhub.com/directories/usa/los-angeles",
        permanent: true,
      },
      {
        source: "/new-york-city",
        destination: "https://www.globalbizzhub.com/directories/usa/new-york-city",
        permanent: true,
      },
      {
        source: "/san-diego",
        destination: "https://www.globalbizzhub.com/directories/usa/san-diego",
        permanent: true,
      },
      {
        source: "/san-francisco",
        destination: "https://www.globalbizzhub.com/directories/usa/san-francisco",
        permanent: true,
      },
      {
        source: "/seattle",
        destination: "https://www.globalbizzhub.com/directories/usa/seattle",
        permanent: true,
      },
      {
        source: "/belfast",
        destination: "https://www.globalbizzhub.com/directories/uk/belfast",
        permanent: true,
      },
      {
        source: "/birmingham",
        destination: "https://www.globalbizzhub.com/directories/uk/birmingham",
        permanent: true,
      },
      {
        source: "/bristol",
        destination: "https://www.globalbizzhub.com/directories/uk/bristol",
        permanent: true,
      },
      {
        source: "/cardiff",
        destination: "https://www.globalbizzhub.com/directories/uk/cardiff",
        permanent: true,
      },
      {
        source: "/edinburgh",
        destination: "https://www.globalbizzhub.com/directories/uk/edinburgh",
        permanent: true,
      },
      {
        source: "/glasgow",
        destination: "https://www.globalbizzhub.com/directories/uk/glasgow",
        permanent: true,
      },
      {
        source: "/leeds",
        destination: "https://www.globalbizzhub.com/directories/uk/leeds",
        permanent: true,
      },
      {
        source: "/london",
        destination: "https://www.globalbizzhub.com/directories/uk/london",
        permanent: true,
      },
      {
        source: "/manchester",
        destination: "https://www.globalbizzhub.com/directories/uk/manchester",
        permanent: true,
      },
      // Common short forms and near-misses.
      {
        source: "/new-york",
        destination: "https://www.globalbizzhub.com/directories/usa/new-york-city",
        permanent: true,
      },
      {
        source: "/pakistan",
        destination: "https://www.globalbizzhub.com/directories/pakistan",
        permanent: true,
      },
      {
        source: "/usa",
        destination: "https://www.globalbizzhub.com/directories/usa",
        permanent: true,
      },
      {
        source: "/uk",
        destination: "https://www.globalbizzhub.com/directories/uk",
        permanent: true,
      },
      {
        source: "/business",
        destination: "https://www.globalbizzhub.com/directories",
        permanent: true,
      },
      // Junk URL Google found once (/$) -> home.
      {
        source: "/$",
        destination: "https://www.globalbizzhub.com/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
