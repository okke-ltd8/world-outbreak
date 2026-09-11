import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.siteName} — Servidor de Minecraft`,
    description: settings.serverDescription,
    icons: settings.faviconUrl ? [{ url: settings.faviconUrl }] : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="pt-BR" className={`${oswald.variable} ${inter.variable} ${mono.variable}`}>
      <body className="font-body bg-outbreak-bg text-outbreak-fog antialiased min-h-screen flex flex-col texture-noise">
        <Providers>
          <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
          <main className="flex-1">{children}</main>
          <Footer
            siteName={settings.siteName}
            discordInvite={settings.discordInvite}
            instagramUrl={settings.instagramUrl}
            tiktokUrl={settings.tiktokUrl}
            youtubeUrl={settings.youtubeUrl}
          />
        </Providers>
      </body>
    </html>
  );
}
