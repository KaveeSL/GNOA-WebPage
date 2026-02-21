"use client";
import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface BannerData {
    id: number;
    message: string;
    link_text?: string;
    link_url?: string;
    is_active: boolean;
}

export default function Banner() {
    const [banner, setBanner] = useState<BannerData | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Fetch active banner on every page load
        fetch('/api/banner')
            .then(res => {
                if (!res.ok) {
                    console.log('Banner API not ok:', res.status);
                    return null;
                }
                return res.json();
            })
            .then(data => {
                console.log('Banner data received:', data);
                // Handle null response (no banner) or check if banner exists and is active
                if (data && data.id) {
                    // Check is_active explicitly - MySQL returns 1 for true, 0 for false
                    if (data.is_active === true || data.is_active === 1 || data.is_active === '1') {
                        setIsAnimating(true);
                        setBanner(data);
                        setIsDismissed(false); // Reset dismissed state on each page load
                        setIsVisible(true); // Reset visible state on each page load
                        // Trigger animation
                        setTimeout(() => setIsAnimating(false), 500);
                    }
                } else {
                    console.log('No banner data or banner is inactive');
                }
            })
            .catch(err => {
                console.error('Error fetching banner:', err);
            });
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // Don't save to sessionStorage - banner will reappear on page refresh
    };

    // If no banner, return empty div to maintain spacing (or return null if you don't want space)
    if (!banner || !isVisible || isDismissed) {
        // Return null so navbar goes back to top-0
        return null;
    }

    return (
        <div 
            data-banner="true" 
            className="fixed top-0 left-0 right-0 z-[101] isolate flex items-center justify-center gap-x-2 sm:gap-x-4 md:gap-x-6 bg-gray-50 px-2 py-2 sm:px-3.5 sm:py-2.5 border-b border-gray-200 w-full min-h-[49px] md:min-h-[57px] animate-[slideDown_0.5s_ease-out] pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
        >
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                    className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#77282b] to-[#9a3d40] opacity-20"
                />
            </div>
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                    className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#77282b] to-[#9a3d40] opacity-20"
                />
            </div>
            <div className="flex-shrink-0 absolute right-2 sm:right-4">
                <button 
                    type="button" 
                    className="-m-2 sm:-m-3 p-2 sm:p-3 focus-visible:outline-offset-4 cursor-pointer hover:bg-gray-200 rounded-full transition-colors duration-200 z-10"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDismiss();
                    }}
                    aria-label="Dismiss banner"
                >
                    <span className="sr-only">Dismiss</span>
                    <XIcon aria-hidden="true" className="size-4 sm:size-5 text-gray-900 pointer-events-none" />
                </button>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-2 max-w-4xl mx-auto px-8 sm:px-12">
                <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-gray-900 text-center break-words">
                    {banner.message}
                </p>
                {banner.link_text && banner.link_url && (
                    <a
                        href={banner.link_url}
                        target={banner.link_url.startsWith('http') ? '_blank' : '_self'}
                        rel={banner.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex-none rounded-full px-2.5 py-1 sm:px-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300 whitespace-nowrap"
                        style={{ backgroundColor: '#762727' }}
                    >
                        {banner.link_text} <span aria-hidden="true" className="hidden sm:inline">&rarr;</span>
                    </a>
                )}
            </div>
        </div>
    );
}
