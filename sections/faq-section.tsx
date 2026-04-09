"use client";

import AnimatedContent from "@/components/animated-content";
import SectionTitle from "@/components/section-title";
import WhatsAppIcon from "@/components/whatsapp-icon";
import { faqs } from "@/data/faqs";
import { ChevronDownIcon, CircleQuestionMarkIcon } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";
import { WHATSAPP_HREF } from "@/lib/whatsapp";

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
                            <h3 className="text-base sm:text-lg text-white text-balance pr-2">
                                {translations[language].faq.helpText}
                            </h3>

                            <a
                                href={WHATSAPP_HREF}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#762727] shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-50/80 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                aria-label={translations[language].faq.whatsappAria}
                                title={translations[language].faq.whatsappAria}
                            >
                                <WhatsAppIcon size={26} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}