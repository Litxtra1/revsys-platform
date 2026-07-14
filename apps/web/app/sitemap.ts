import type { MetadataRoute } from "next";
import { getPublicConfig } from "@revsys/shared";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicConfig().NEXT_PUBLIC_APP_URL;
  const entries: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/scanner", changeFrequency: "weekly", priority: 0.9 },
    { path: "/products", changeFrequency: "monthly", priority: 0.8 },
    { path: "/calculator", changeFrequency: "monthly", priority: 0.7 },
    { path: "/demo", changeFrequency: "monthly", priority: 0.7 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  ];

  return entries.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
