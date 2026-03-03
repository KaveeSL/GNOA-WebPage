 "use client";

import AnimatedContent from "@/components/animated-content";
import SectionTitle from "@/components/section-title";
import { faqs } from "@/data/faqs";
import { ChevronDownIcon, CircleQuestionMarkIcon } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";

export default function FaqSection() {
    const { language } = useLanguage();
    return (
        <section className="border-y border-gray-200">
            <div className="px-4 md:px-16 lg:px-24 xl:px-32">
                <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                    <SectionTitle
                        icon={CircleQuestionMarkIcon}
                        title={translations[language].faq.title}
                        subtitle={translations[language].faq.subtitle}
                    />
                </div>
            </div>
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 border-x border-gray-200 max-w-7xl mx-auto">
                    <div className="p-4 pt-20 md:p-20 space-y-6">
                        {faqs.map((faq, index) => {
                            const tItem = (translations[language] as any).faqItems?.[index] as
                                | { question: string; answer: string }
                                | undefined;
                            const question = tItem?.question ?? faq.question;
                            const answer = tItem?.answer ?? faq.answer;

                            return (
                                <AnimatedContent key={index}>
                                    <details className="group bg-gray-50 border border-gray-200 rounded-xl" open={index === 0}>
                                        <summary className="flex items-center justify-between p-6 select-none">
                                            <h3 className="font-medium text-base">{question}</h3>
                                            <ChevronDownIcon size={20} className="group-open:rotate-180" />
                                        </summary>
                                        <p className="text-sm/6 text-zinc-500 max-w-md p-6 pt-0">
                                            {answer}
                                        </p>
                                    </details>
                                </AnimatedContent>
                            );
                        })}
                    </div>
                    <div className="p-4 pt-20 md:p-20">
                        <div className="md:sticky md:top-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 p-4 sm:p-6 w-full rounded-xl mt-12 transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#762727' }}>
                            <h3 className="text-base sm:text-lg text-white text-balance">
                                {translations[language].faq.helpText}
                            </h3>

                            <a
                                href="#!"
                                className="bg-white w-full sm:w-max shrink-0 hover:bg-gray-100 px-5 py-2 rounded-full transition-all duration-300 text-center"
                            >
                                {translations[language].faq.contact}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}