import { Urbanist } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import LenisScroll from "@/components/lenis";

const urbanist = Urbanist({
    variable: "--font-urbanist",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "GNOA Sri Lanka – Government Nursing Officers' Association",
        template: "%s | GNOA Sri Lanka",
    },
    description:
        "Government Nursing Officers' Association (GNOA) Sri Lanka - Representing 31,000+ nursing officers in the public healthcare system. Advocating for rights, welfare, and professional development.",
    keywords: [
        "GNOA",
        "Government Nursing Officers Association",
        "Sri Lanka nursing",
        "nursing officers",
        "healthcare workers",
        "nursing union",
        "Sri Lanka healthcare",
        "nursing advocacy",
    ],
    authors: [{ name: "GNOA Sri Lanka" }],
    creator: "GNOA Sri Lanka",
    applicationName: "GNOA Sri Lanka",
    icons: {
        icon: [
            { url: '/assets/gnoalogo.png', type: 'image/png', sizes: 'any' },
        ],
        shortcut: '/assets/gnoalogo.png',
        apple: '/assets/gnoalogo.png',
    },
    appleWebApp: {
        title: "GNOA Sri Lanka",
        capable: true,
        statusBarStyle: "default",
    },
    openGraph: {
        title: "GNOA Sri Lanka – Government Nursing Officers' Association",
        description:
            "Representing 31,000+ nursing officers in Sri Lanka's public healthcare system. Advocating for rights, welfare, and professional development.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GNOA Sri Lanka – Government Nursing Officers' Association",
        description:
            "Representing 31,000+ nursing officers in Sri Lanka's public healthcare system.",
    },
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={urbanist.variable}>
            <head>
                <link rel="preload" as="image" href="/assets/hero-gradient-bg.png" fetchPriority="high" />
                <link rel="preload" as="image" href="/assets/bgimg.webp" fetchPriority="high" />
            </head>
            <body className={`${urbanist.className} antialiased`}>
                <LenisScroll />
                {children}
            </body>
        </html>
    );
}
