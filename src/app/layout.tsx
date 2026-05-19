import type { Metadata } from "next";
import { Open_Sans, Oxygen_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const oxygenMono = Oxygen_Mono({
  subsets: ["latin"],
  variable: "--font-oxygen-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Por onde começo hoje? — Sprint IA",
  description:
    "Dashboard de início de dia — saiba por onde começar antes de iniciar o trabalho.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${openSans.variable} ${oxygenMono.variable}`}>
      <body>
        {children}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <Script
          src="https://apis.google.com/js/api.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
