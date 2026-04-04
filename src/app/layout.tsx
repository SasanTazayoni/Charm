import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://charm-nail-salon.vercel.app"),
  title: "Charm | Professional Nail Artist",
  description:
    "Charm by Mirjana — professional nail artist based in Bijeljina, Bosnia & Herzegovina, specialising in nail art, gel nails, and manicure. Book your appointment today.",
  keywords: [
    "Charm",
    "Charm by Mirjana",
    "Charm nail salon",
    "Mirjana Vuković",
    "nail artist Bijeljina",
    "nail salon Bijeljina",
    "professional nail artist",
    "nail art Bosnia",
    "nail artist Bosnia Herzegovina",
    "Bijeljina",
    "Bosnia Herzegovina",
    "Republika Srpska",
    "nail art",
    "gel nails",
    "gel lac",
    "gel manicure",
    "acrylic nails",
    "manicure",
    "custom nail art",
    "nail designs",
    "nail technician",
    "nail artist",
    "beauty salon Bijeljina",
    "nokti Bijeljina",
    "manikir Bijeljina",
    "gel nokti",
    "uljepšavanje nokti",
  ],
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Mirjana Vuković Đorđić" }],
  creator: "Mirjana Vuković Đorđić",
  openGraph: {
    title: "Charm | Professional Nail Artist",
    description:
      "Charm by Mirjana — professional nail artist based in Bijeljina, Bosnia & Herzegovina, specialising in nail art, gel nails, and manicure. Book your appointment today.",
    type: "website",
    locale: "en_US",
    siteName: "Charm",
    images: [
      {
        url: "/og-image.png",
        alt: "Charm - Professional Nail Artist",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Charm",
  description:
    "Professional nail artist based in Bijeljina, Bosnia & Herzegovina, specialising in nail art, gel nails, and manicure.",
  telephone: "+38766955693",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Trnjaci Glavna",
    addressLocality: "Bijeljina",
    addressCountry: "BA",
  },
  sameAs: ["https://www.instagram.com/charm_bymirjana"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Nail Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Nail Art" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gel Nails" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gel Lac" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manicure" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Acrylic Nails" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rubber Base" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
