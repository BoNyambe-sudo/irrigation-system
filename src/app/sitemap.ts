import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://example.com", lastModified: new Date() },
    { url: "https://example.com/systems", lastModified: new Date() },
    { url: "https://example.com/order", lastModified: new Date() },
    { url: "https://example.com/terms", lastModified: new Date() },
    { url: "https://example.com/privacy", lastModified: new Date() },
  ];
}
