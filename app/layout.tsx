import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--font-nunito", display: "swap" });
const bagel = Bagel_Fat_One({ subsets: ["latin"], weight: "400", variable: "--font-bagel", display: "swap" });

export const metadata: Metadata = {
  title: "Dulce Crocs",
  description: "Crocs para grandes y chiquitos en Costa Rica. Armá tu lista, mandala por WhatsApp y pagá por SINPE Móvil.",
};

export const viewport: Viewport = { themeColor: "#F3E8F9" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} ${bagel.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
