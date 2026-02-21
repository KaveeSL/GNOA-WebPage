import AnimatedContent from "@/components/animated-content";
import SectionTitle from "@/components/section-title";
import { team } from "@/data/team";
import { HandshakeIcon } from "lucide-react";

export default function OurTeamSection() {
    return (
        <section id="team" className="border-b border-gray-200 px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="pt-20 pb-32 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                <SectionTitle
                    icon={HandshakeIcon}
                    title="Executive Committee"
                    subtitle="Dedicated leaders representing 31,000+ nursing officers across Sri Lanka's public healthcare system."
                />
                <div className="flex flex-wrap items-center justify-center gap-10 md:gap-6 mt-24">
                    {team.map((member, index) => (
                        <AnimatedContent delay={index * 0.10} key={index} className="flex flex-col transition-all duration-300 hover:scale-105">
                            <div className="relative overflow-hidden rounded-lg group">
                                <img src={member.image} alt={member.name} className="w-52 h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <h3 className="text-lg font-medium mt-2" style={{ color: '#762727' }}>{member.name}</h3>
                            <p className="text-zinc-500 font-medium">{member.role}</p>
                        </AnimatedContent>
                    ))}
                </div>
            </div>
        </section>
    )
}