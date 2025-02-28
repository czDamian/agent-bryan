import localFont from "next/font/local";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const coolvetica = localFont({
  src: [
    {
      path: "./font/Coolvetica.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-coolvetica",
});

export const metadata = {
  title: "Agent Bryan",
  description: "Agent Bryan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${coolvetica.variable} ${rubik.variable} font-rubik  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
