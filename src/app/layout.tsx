import type { Metadata } from "next";
import "../styles/pages/home.css";
import "../styles/components/card.css";

export const metadata: Metadata = {
  title: "Task Timer",
  description: "Task Timer migrated to Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-full flex flex-col">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
