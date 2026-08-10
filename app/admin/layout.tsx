export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="font-urbanist antialiased">{children}</div>;
}
