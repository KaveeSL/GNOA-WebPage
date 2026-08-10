 "use client";

import CountUp from "@/components/count-number";
import AnimatedContent from "@/components/animated-content";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";

export default function StatsSection() {
    const { language } = useLanguage();
    return (
        <section className="border-y border-gray-200 py-10 px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnimatedContent delay={0.04} distance={0} className="flex flex-col items-center gap-4 text-center">
                    <h3 className="text-4xl font-semibold font-urbanist" style={{ color: '#762727' }}>
                        <CountUp from={0} to={31000} />+
                    </h3>
                    <p className="text-gray-500">
                        {translations[language].stats.members}
                    </p>
                </AnimatedContent>

                <AnimatedContent delay={0.08} distance={0} className="flex flex-col items-center gap-4 text-center">
                    <h3 className="text-4xl font-semibold font-urbanist" style={{ color: '#762727' }}>
                        <CountUp from={0} to={44} />+
                    </h3>
                    <p className="text-gray-500">
                        {translations[language].stats.years}
                    </p>
                </AnimatedContent>

                <AnimatedContent delay={0.12} distance={0} className="flex flex-col items-center gap-4 text-center">
                    <h3 className="text-4xl font-semibold font-urbanist" style={{ color: '#762727' }}>
                        <CountUp from={0} to={100} />%
                    </h3>
                    <p className="text-gray-500">
                        {translations[language].stats.coverage}
                    </p>
                </AnimatedContent>

                <AnimatedContent delay={0.16} distance={0} className="flex flex-col items-center gap-4 text-center">
                    <h3 className="text-4xl font-semibold font-urbanist" style={{ color: '#762727' }}>
                        <CountUp from={0} to={25} />+
                    </h3>
                    <p className="text-gray-500">
                        {translations[language].stats.districts}
                    </p>
                </AnimatedContent>
            </div>
        </section>
    )
}