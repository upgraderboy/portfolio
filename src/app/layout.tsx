import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import SideBar from "@/components/SideBar";
import ScrollReveal from "@/components/ScrollReveal";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Upgrader Boy — Superior Senior Software Engineer",
  description:
    "Full Stack Software Engineer specializing in MERN, Next.js, DevOps, AI & ML. Building modern, scalable, and high-performance web applications.",
  keywords: [
    "Upgrader Boy",
    "Full Stack Developer",
    "Senior Software Engineer",
    "Next.js",
    "React",
    "MERN",
    "Web Developer",
    "Ankit Bhuria",
  ],
  authors: [{ name: "Upgrader Boy" }],
  openGraph: {
    title: "Upgrader Boy — Superior Senior Software Engineer",
    description:
      "Full Stack Software Engineer building modern, scalable, high-performance web applications.",
    url: "https://upgraderboy.com",
    siteName: "Upgrader Boy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        <SideBar />
        {children}
        <ScrollReveal />
      </body>
      <Script src="/scripts/script.js" />
    </html>
  );
}
