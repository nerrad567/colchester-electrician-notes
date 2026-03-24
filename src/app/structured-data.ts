import { SITE } from "@/lib/constants";

export function getHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        publisher: { "@id": `${SITE.url}/#business` },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE.url}/#business`,
        name: SITE.business,
        url: SITE.businessUrl,
        areaServed: ["Colchester", "North Essex"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Colchester",
          addressRegion: "Essex",
          addressCountry: "GB",
        },
        knowsAbout: [
          "EICR",
          "Electrical fault finding",
          "Consumer unit upgrades",
          "EV charger installation",
          "Earthing arrangements (TN-S/TN-C-S/PME)",
        ],
      },
    ],
  };
}

export function getArticleStructuredData(article: {
  title: string;
  description: string;
  slug: string;
  readTime: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE.url}/posts/${article.slug}#article`,
    mainEntityOfPage: {
      "@id": `${SITE.url}/posts/${article.slug}`,
    },
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: SITE.author,
      url: SITE.businessUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.business,
      url: SITE.businessUrl,
    },
  };
}
