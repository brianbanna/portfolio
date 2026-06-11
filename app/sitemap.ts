import { MetadataRoute } from "next";
import { allNotes } from "contentlayer/generated";

const baseUrl = "https://brianbanna.com";

// lastModified = each page's last meaningful content commit
export default function sitemap(): MetadataRoute.Sitemap {
  const publishedNotes = allNotes.filter((n) => n.published);
  const noteEntries: MetadataRoute.Sitemap =
    publishedNotes.length === 0
      ? []
      : [
          {
            url: `${baseUrl}/notes/`,
            lastModified: new Date(
              Math.max(
                ...publishedNotes.map((n) => new Date(n.date).getTime())
              )
            ),
            changeFrequency: "weekly",
            priority: 0.6,
          },
          ...publishedNotes.map((n) => ({
            url: `${baseUrl}/notes/${n.slug}/`,
            lastModified: new Date(n.date),
            changeFrequency: "monthly" as const,
            priority: 0.5,
          })),
        ];

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date("2026-05-17"),
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
    ...noteEntries,
  ];
}
