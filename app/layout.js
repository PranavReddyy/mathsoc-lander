import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { PageFooter } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { MathBackground } from "@/components/MathBackground";
import { Analytics } from "@vercel/analytics/react";
import { LoadingScreen } from '@/components/laoding-screen';

// Font definitions
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: '%s | MathSoc',
    default: 'MathSoc | Mahindra University',
  },
  description: "Official Mathematics Society at Mahindra University",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen />
          <MathBackground />
          <Navbar />
          {children}
          <PageFooter />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}