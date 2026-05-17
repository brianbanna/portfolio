import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://brianbanna.com/sitemap.xml",
    host: "https://brianbanna.com",
  };
}
