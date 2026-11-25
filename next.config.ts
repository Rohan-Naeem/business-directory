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
      // the real pages live at /<country>/<city>.
      {
        source: "/faisalabad",
        destination: "https://www.globalbizzhub.com/pakistan/faisalabad",
        permanent: true,
      },
      {
        source: "/gujranwala",
        destination: "https://www.globalbizzhub.com/pakistan/gujranwala",
        permanent: true,
      },
      {
        source: "/hyderabad",
        destination: "https://www.globalbizzhub.com/pakistan/hyderabad",
        permanent: true,
      },
      {
        source: "/islamabad",
        destination: "https://www.globalbizzhub.com/pakistan/islamabad",
        permanent: true,
      },
      {
        source: "/karachi",
        destination: "https://www.globalbizzhub.com/pakistan/karachi",
        permanent: true,
      },
      {
        source: "/lahore",
        destination: "https://www.globalbizzhub.com/pakistan/lahore",
        permanent: true,
      },
      {
        source: "/multan",
        destination: "https://www.globalbizzhub.com/pakistan/multan",
        permanent: true,
      },
      {
        source: "/peshawar",
        destination: "https://www.globalbizzhub.com/pakistan/peshawar",
        permanent: true,
      },
      {
        source: "/rawalpindi",
        destination: "https://www.globalbizzhub.com/pakistan/rawalpindi",
        permanent: true,
      },
      {
        source: "/sialkot",
        destination: "https://www.globalbizzhub.com/pakistan/sialkot",
        permanent: true,
      },
      {
        source: "/sukkur",
        destination: "https://www.globalbizzhub.com/pakistan/sukkur",
        permanent: true,
      },
      {
        source: "/austin",
        destination: "https://www.globalbizzhub.com/usa/austin",
        permanent: true,
      },
      {
        source: "/buffalo",
        destination: "https://www.globalbizzhub.com/usa/buffalo",
        permanent: true,
      },
      {
        source: "/chicago",
        destination: "https://www.globalbizzhub.com/usa/chicago",
        permanent: true,
      },
      {
        source: "/dallas",
        destination: "https://www.globalbizzhub.com/usa/dallas",
        permanent: true,
      },
      {
        source: "/houston",
        destination: "https://www.globalbizzhub.com/usa/houston",
        permanent: true,
      },
      {
        source: "/los-angeles",
        destination: "https://www.globalbizzhub.com/usa/los-angeles",
        permanent: true,
      },
      {
        source: "/new-york-city",
        destination: "https://www.globalbizzhub.com/usa/new-york-city",
        permanent: true,
      },
      {
        source: "/san-diego",
        destination: "https://www.globalbizzhub.com/usa/san-diego",
        permanent: true,
      },
      {
        source: "/san-francisco",
        destination: "https://www.globalbizzhub.com/usa/san-francisco",
        permanent: true,
      },
      {
        source: "/seattle",
        destination: "https://www.globalbizzhub.com/usa/seattle",
        permanent: true,
      },
      {
        source: "/belfast",
        destination: "https://www.globalbizzhub.com/uk/belfast",
        permanent: true,
      },
      {
        source: "/birmingham",
        destination: "https://www.globalbizzhub.com/uk/birmingham",
        permanent: true,
      },
      {
        source: "/bristol",
        destination: "https://www.globalbizzhub.com/uk/bristol",
        permanent: true,
      },
      {
        source: "/cardiff",
        destination: "https://www.globalbizzhub.com/uk/cardiff",
        permanent: true,
      },
      {
        source: "/edinburgh",
        destination: "https://www.globalbizzhub.com/uk/edinburgh",
        permanent: true,
      },
      {
        source: "/glasgow",
        destination: "https://www.globalbizzhub.com/uk/glasgow",
        permanent: true,
      },
      {
        source: "/leeds",
        destination: "https://www.globalbizzhub.com/uk/leeds",
        permanent: true,
      },
      {
        source: "/london",
        destination: "https://www.globalbizzhub.com/uk/london",
        permanent: true,
      },
      {
        source: "/manchester",
        destination: "https://www.globalbizzhub.com/uk/manchester",
        permanent: true,
      },
      // Common short forms and near-misses.
      {
        source: "/new-york",
        destination: "https://www.globalbizzhub.com/usa/new-york-city",
        permanent: true,
      },
      // Old /directories/* URLs -> the new short URLs (Phase 1, 19 Nov 2026).
      // Redirects run before routing, so these also shadow the old
      // src/app/directories/* pages still on GitHub (snapshot push cannot
      // delete files — remove them via GitHub web UI later).
      {
        source: "/directories/:country/:city",
        destination: "https://www.globalbizzhub.com/:country/:city",
        permanent: true,
      },
      {
        source: "/directories/:country",
        destination: "https://www.globalbizzhub.com/:country",
        permanent: true,
      },
      {
        source: "/directories",
        destination: "https://www.globalbizzhub.com/",
        permanent: true,
      },
      {
        source: "/business",
        destination: "https://www.globalbizzhub.com/",
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
