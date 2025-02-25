import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Agent Bryan",
  description: "Agent Bryan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${rubik.variable} font-rubik  antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
