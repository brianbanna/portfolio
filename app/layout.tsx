import "../global.css";
import { Inter, Fraunces, JetBrains_Mono } from "@next/font/google";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://brianbanna.com"),
  title: {
    default: "Brian Banna — Quantitative Research",
    template: "%s | Brian Banna",
  },
  description:
    "Brian Banna — Data Science at EPFL. Quantitative modelling, systematic trading strategies, and commodity markets research.",
  openGraph: {
    title: "Brian Banna — Quantitative Research",
    description:
      "Data Science master's student at EPFL focused on quantitative finance, systematic trading, and commodity markets.",
    url: "https://brianbanna.com",
    siteName: "Brian Banna",
    images: [
      {
        url: "https://brianbanna.com/og.png",
        width: 1920,
        height: 1080,
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
    title: "Brian Banna",
    card: "summary_large_image",
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

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
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
        fraunces.variable,
        jetbrains.variable,
      ].join(" ")}
    >
      <head>
        <Analytics />
      </head>
      <body className="bg-bg text-fg font-sans antialiased selection:bg-accent/30 selection:text-fg">
        {children}
      </body>
    </html>
  );
}
