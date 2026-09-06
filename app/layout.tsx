import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description:
    "Una plataforma para jugar online y competir por la mayor cantidad de puntos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${pressStart2P.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Arcade background layers (fixed, behind content) */}
        <div className="av-bg" aria-hidden="true" />
        <div className="av-noise" aria-hidden="true" />
        {/* App frame — all page content lives inside #root */}
        <div id="root">
          <div className="av-main">{children}</div>
        </div>
      </body>
    </html>
  );
}
