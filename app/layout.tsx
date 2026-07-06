import "../global.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://brianbanna.com"),
  title: {
    default: "Brian Banna · Commodity Markets",
    template: "%s | Brian Banna",
  },
  description:
    "Quant Analyst Intern at Cargill. MSc Data Science with a minor in Financial Engineering at EPFL. Models that turn physical fundamentals into views on curves, spreads and regimes.",
  alternates: {
    canonical: "https://brianbanna.com/",
  },
  authors: [{ name: "Brian Banna", url: "https://brianbanna.com/" }],
  creator: "Brian Banna",
  publisher: "Brian Banna",
  keywords: [
    "Brian Banna",
    "Cargill",
    "Financial Engineering",
    "commodity trading",
    "commodity markets",
    "commodity markets analysis",
    "futures curves",
    "spread relationships",
    "market regimes",
    "systematic trading",
    "EPFL",
  ],
  openGraph: {
    title: "Brian Banna · Commodity Markets",
    description:
      "Quant Analyst Intern at Cargill. MSc Data Science with a minor in Financial Engineering at EPFL. Models that turn physical fundamentals into views on curves, spreads and regimes.",
    url: "https://brianbanna.com/",
    siteName: "Brian Banna",
    images: [
      {
        url: "https://brianbanna.com/og-home.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Brian Banna · Commodity Markets",
    description:
      "Quant Analyst Intern at Cargill. MSc Data Science with a minor in Financial Engineering at EPFL. Models that turn physical fundamentals into views on curves, spreads and regimes.",
    images: ["https://brianbanna.com/og-home.png"],
  },
  icons: {
    shortcut: "/favicon.svg",
    icon: "/favicon.svg",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Brian Banna",
    jobTitle: "Quantitative Analyst Intern",
    worksFor: { "@type": "Organization", name: "Cargill" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "EPFL" },
    url: "https://brianbanna.com",
    sameAs: [
      "https://github.com/brianbanna",
      "https://linkedin.com/in/brianbanna",
    ],
    knowsAbout: [
      "Commodity markets",
      "Futures curves",
      "Systematic trading",
      "Quantitative finance",
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Brian Banna",
  url: "https://brianbanna.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-fg font-sans antialiased selection:bg-accent/30 selection:text-fg">
        <script
          type="application/ld+json"
          // rome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
        />
        <script
          type="application/ld+json"
          // rome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
