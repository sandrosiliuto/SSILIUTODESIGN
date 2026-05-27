import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SSILIUTODESIGN · Art & Technology Studio",
  description:
    "Portfolio de Sandro Siliuto. Diseño web 3D interactivo, experiencias inmersivas y desarrollo frontend de alto impacto.",
  metadataBase: new URL("https://ssiliutodesign.vercel.app"),
  openGraph: {
    title: "SSILIUTODESIGN · Art & Technology Studio",
    description: "Diseño web 3D interactivo y experiencias inmersivas.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} antialiased grain scanlines`}>
        {children}
      </body>
    </html>
  );
}
