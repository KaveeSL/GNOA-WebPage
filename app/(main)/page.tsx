import FaqSection from "@/sections/faq-section";
import FeaturesSection from "@/sections/features-section";
import HeroSection from "@/sections/hero-section";
import MembershipSection from "@/sections/membership-section";
import OurTeamSection from "@/sections/our-team";
import StatsSection from "@/sections/stats-section";
import GallerySection from "@/sections/gallery-section";
import VideosSection from "@/sections/videos-section";
import NewsSection from "@/sections/news-section";
import LocationSection from "@/sections/location-section";

export default function Page() {
    return (
        <main>
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <MembershipSection />
            <NewsSection />
            <VideosSection />
            <FaqSection />
            <OurTeamSection />
            <GallerySection />
            <LocationSection />
        </main>
    );
}
