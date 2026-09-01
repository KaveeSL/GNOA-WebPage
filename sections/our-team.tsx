"use client";

import Link from "next/link";
import { ArrowRightIcon, HandshakeIcon } from "lucide-react";
import AnimatedContent from "@/components/animated-content";
import SectionTitle from "@/components/section-title";
import { team } from "@/data/team";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";

export default function OurTeamSection() {
    const { language } = useLanguage();
    const t = translations[language].team;
    return (
        <section id="team" className="border-b border-gray-200 px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="pt-20 pb-32 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                <SectionTitle
                    icon={HandshakeIcon}
                    title={t.title}
                    subtitle={t.subtitle}
                />
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-6 mt-12 md:mt-24 px-1">
                    {team.map((member, index) => (
                        <AnimatedContent delay={index * 0.04} distance={12} key={index} className="flex flex-col items-center max-w-[11.5rem] sm:max-w-none">
                            <div className="relative overflow-hidden rounded-lg group w-40 h-52 sm:w-52 sm:h-64">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium mt-2 text-center leading-snug" style={{ color: '#762727' }}>{member.name}</h3>
                            <p className="text-zinc-500 font-medium text-sm sm:text-base">{member.role}</p>
                        </AnimatedContent>
                    ))}
                </div>
                <div className="mt-8 sm:mt-12 flex justify-center w-full px-4">
                    <Link
                        href="/executive-committee"
                        className="inline-flex w-full max-w-sm sm:w-auto sm:max-w-none items-center justify-center gap-2 rounded-full border-2 border-[#762727] bg-white px-5 sm:px-6 py-3 text-sm font-bold text-[#762727] transition-colors duration-200 hover:bg-[#762727] hover:text-white active:bg-[#5f1f1f] active:text-white text-center"
                    >
                        {t.viewFull}
                        <ArrowRightIcon size={14} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
