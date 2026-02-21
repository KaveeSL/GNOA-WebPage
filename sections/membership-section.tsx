import AnimatedContent from "@/components/animated-content";
import SectionTitle from "@/components/section-title";
import { UserPlusIcon, CheckCircleIcon, UsersIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";

export default function MembershipSection() {
    return (
        <section className="relative bg-[url('/assets/hero-gradient-bg.png')] bg-cover bg-center bg-no-repeat px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/assets/bg2.png')] bg-cover bg-center bg-no-repeat opacity-30" style={{ zIndex: 0, backgroundAttachment: 'fixed' }}></div>
            <div className="relative p-4 pt-20 pb-24 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200" style={{ zIndex: 1 }}>
                <SectionTitle
                    icon={UserPlusIcon}
                    title="Join the GNOA Community"
                    subtitle="Become a member of the Government Nursing Officers' Association and be part of a professional community dedicated to excellence in healthcare."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
                    <AnimatedContent delay={0.1} className="flex flex-col items-center text-center p-6 rounded-xl bg-white/50 backdrop-blur border border-white transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#762727' }}>
                            <CheckCircleIcon className="size-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#762727' }}>Professional Support</h3>
                        <p className="text-sm text-gray-700">Access resources and support to advance your nursing career.</p>
                    </AnimatedContent>

                    <AnimatedContent delay={0.2} className="flex flex-col items-center text-center p-6 rounded-xl bg-white/50 backdrop-blur border border-white transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#762727' }}>
                            <UsersIcon className="size-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#762727' }}>Community Network</h3>
                        <p className="text-sm text-gray-700">Connect with fellow nursing professionals across Sri Lanka.</p>
                    </AnimatedContent>

                    <AnimatedContent delay={0.3} className="flex flex-col items-center text-center p-6 rounded-xl bg-white/50 backdrop-blur border border-white transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#762727' }}>
                            <FileTextIcon className="size-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#762727' }}>Easy Application</h3>
                        <p className="text-sm text-gray-700">Simple and secure online application process.</p>
                    </AnimatedContent>
                </div>

                <AnimatedContent delay={0.4} className="mt-16 text-center">
                    <p className="text-xl font-medium text-gray-800 mb-8">
                        Ready to take the next step in your professional journey?
                    </p>
                    <Link 
                        href="https://gnoa.notesandmore.space/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 md:py-2.5 px-8 border text-white text-center rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: '#762727', borderColor: '#762727' }}
                    >
                        Start Your Application Now
                    </Link>
                </AnimatedContent>
            </div>
        </section>
    )
}
