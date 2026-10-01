import { MetadataRoute } from "next";

const baseUrl = "https://brianbanna.com";

// lastModified = each page's last meaningful content commit; the homepage is
// regenerated every build, so it carries the build date
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/power-price-transmission/`,
      lastModified: new Date("2026-04-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/commodity-curve-factors/`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/systematic-regime-trading/`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
