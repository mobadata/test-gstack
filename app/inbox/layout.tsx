import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox — gstack-instagram",
  description: "Validation des brouillons de réponse aux commentaires Instagram.",
};

export default function InboxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
