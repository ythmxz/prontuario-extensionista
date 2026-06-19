import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prontuário Extensionista",
  description: "Sistema do Núcleo Jovem Bom de Vida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}