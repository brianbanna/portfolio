import "../global.css";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
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
    canonical: "https://brianbanna.com",
  },
  authors: [{ name: "Brian Banna", url: "https://brianbanna.com" }],
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
    url: "https://brianbanna.com",
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

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        "dark",
        inter.variable,
        sourceSerif.variable,
        jetbrains.variable,
      ].join(" ")}
    >
      <body className="bg-bg text-fg font-sans antialiased selection:bg-accent/30 selection:text-fg">
        {children}
      </body>
    </html>
  );
}
