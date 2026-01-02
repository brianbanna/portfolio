import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://brianbanna.com"),
  title: {
    default: "Brian Banna - Portfolio",
    template: "%s | Brian Banna",
  },
  description: "Data Science master's student at EPFL focused on quantitative finance, systematic trading, and commodities.",
  openGraph: {
    title: "Brian Banna Portfolio",
    description:
      "Data Science master's student at EPFL focused on quantitative finance, systematic trading, and commodities.",
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
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={["dark", inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body
        className={`bg-bg transition-colors duration-300 ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        {children}
      </body>
    </html>
  );
}
