import SectionTitle from "@/components/section-title";
import { ArrowUpRightIcon, SparkleIcon } from "lucide-react";
import { features } from "@/data/features";
import AnimatedContent from "@/components/animated-content";

export default function FeaturesSection() {
    return (
        <section id="features" className="px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="grid grid-cols-1 md:grid-cols-2 border-x md:divide-x border-gray-200 divide-gray-200 max-w-7xl mx-auto">
                <div>
                    <div className="p-4 pt-16 md:p-16 flex flex-col items-start md:sticky md:top-26">
                        <SectionTitle
                            dir="left"
                            icon={SparkleIcon}
                            title="Our Mission & Services"
                            subtitle="Dedicated to protecting the rights, welfare, and professional development of government nursing officers across Sri Lanka's public healthcare system."
                        />
                        <AnimatedContent className="p-4 md:p-6 w-full rounded-xl mt-12 transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#762727' }}>
                            <p className="text-lg text-white">
                                Representing 31,000+ nursing officers in policy discussions, negotiations, and advocacy efforts.
                            </p>

                            <a href="#team" className="bg-white w-max hover:bg-gray-100 px-5 py-2 rounded-full mt-6 flex items-center gap-1 transition-all duration-300" >
                                Meet Our Leadership
                                <ArrowUpRightIcon size={20} />
                            </a>
                        </AnimatedContent>
                    </div>
                </div>
                <div className="p-4 pt-16 md:p-16 space-y-6">
                    {features.map((feature, index) => (
                        <AnimatedContent key={index} delay={index * 0.1} className={`${feature.cardBg} flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                            <div className={`p-2 text-white rounded-md transition-transform duration-300 hover:scale-110 ${feature.iconBg === 'bg-[#762727]' ? '' : feature.iconBg}`} style={feature.iconBg === 'bg-[#762727]' ? { backgroundColor: '#762727' } : {}}>
                                <feature.icon />
                            </div>
                            <p className="text-base font-medium mt-4">{feature.title}</p>
                            <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
                        </AnimatedContent>
                    ))}
                </div>
            </div>
        </section>
    )
}