 "use client";

import { FacebookIcon, YoutubeIcon } from "lucide-react";
import Image from "next/image";
import AnimatedContent from "./animated-content";
import { useLanguage } from "./language-context";
import { translations } from "@/lib/i18n";

export default function Footer() {
    const { language } = useLanguage();
    return (
        <footer className="px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="border-x border-gray-200 px-4 md:px-12 max-w-7xl mx-auto pt-40">
                <div className="flex flex-col md:flex-row items-start md:items-start justify-between relative p-8 md:p-12 overflow-hidden pb-32 md:pb-42 rounded-t-2xl gap-8 md:gap-0" style={{ background: 'linear-gradient(to top, rgba(118, 39, 39, 0.1), rgba(118, 39, 39, 0.05))' }}>
                    <Image
                        src="/assets/GNOA.png"
                        alt="GNOA Logo"
                        width={200}
                        height={200}
                        className="h-32 md:h-48 lg:h-64 w-auto absolute -bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 opacity-7 select-none pointer-events-none"
                    />
                    <AnimatedContent distance={40} className="max-w-72">
                        <Image
                            src="/assets/gnoalogo.png"
                            alt="GNOA Logo"
                            width={100}
                            height={30}
                            className="h-8 w-auto"
                        />
                        <p className="text-zinc-500 mt-4 pb-6">
                            {translations[language].footer.description}
                        </p>
                        
                        <p className="text-gray-500 py-0">Copyright 2026 © GNOA Sri Lanka <br />
                        All Rights Reserved.</p>
                    </AnimatedContent>
                    <AnimatedContent distance={40} className="flex flex-col">
                        <p className="uppercase font-semibold text-base mb-6" style={{ color: '#762727' }}>
                            {translations[language].footer.connectWithUs}
                        </p>
                        <div className="flex flex-col gap-3">
                            <a 
                                href="https://www.facebook.com/gnoa.nhsl/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 transition-all duration-300 hover:scale-105" 
                                style={{ color: '#762727' }}
                            >
                                <FacebookIcon size={20} />
                                <span>{translations[language].footer.facebook}</span>
                            </a>
                            <a 
                                href="https://www.youtube.com/@gnoa2976/featured" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 transition-all duration-300 hover:scale-105" 
                                style={{ color: '#762727' }}
                            >
                                <YoutubeIcon size={20} />
                                <span>{translations[language].footer.youtube}</span>
                            </a>
                        </div>
                    </AnimatedContent>
                </div>
            </div>
        </footer>
    );
}