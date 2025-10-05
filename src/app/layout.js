import "./globals.css";

export const metadata = {
  title: "Time Tracker",
  description: "Developer Productivity Tracking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
