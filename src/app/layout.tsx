import type { Metadata } from "next";
import {
  Caveat,
  Kalam,
  Fraunces,
  Inter,
  Lato,
  Rubik,
  Lora,
  Playfair_Display,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const kalam = Kalam({ variable: "--font-kalam", subsets: ["latin"], weight: ["300", "400", "700"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["SOFT", "WONK"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["300", "400", "700", "900"] });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "easycv — handcrafted resumes, made fast",
    template: "%s · easycv",
  },
  description:
    "A drag-and-drop resume builder with twelve hand-picked templates. No accounts. No backend. Just you and a fresh page.",
  applicationName: "easycv",
  keywords: [
    "resume builder",
    "free resume templates",
    "cv builder",
    "ATS resume",
    "cover letter",
    "JSON Resume",
    "no signup resume",
    "local resume builder",
  ],
  authors: [{ name: "easycv" }],
  openGraph: {
    title: "easycv — handcrafted resumes, made fast",
    description:
      "Drag-and-drop, 12 templates, full customization. No signup, no cloud. Yours forever.",
    siteName: "easycv",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "easycv — handcrafted resumes, made fast",
    description:
      "Drag-and-drop, 12 templates, full customization. No signup, no cloud.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    caveat.variable,
    kalam.variable,
    fraunces.variable,
    inter.variable,
    lato.variable,
    rubik.variable,
    lora.variable,
    playfair.variable,
    jetbrains.variable,
  ].join(" ");

  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-cocoa">{children}</body>
    </html>
  );
}
