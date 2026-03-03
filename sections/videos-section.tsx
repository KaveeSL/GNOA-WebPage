"use client";

import { useState, useEffect } from "react";
import AnimatedContent from "@/components/animated-content";
import SectionTitle from "@/components/section-title";
import { PlayIcon, YoutubeIcon } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";

interface VideoData {
    id: number;
    video_id: string;
    title: string;
    description?: string;
}

export default function VideosSection() {
    const { language } = useLanguage();
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(2);

    useEffect(() => {
        fetch('/api/videos')
            .then(res => res.json())
            .then(data => {
                setVideos(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // Update visible count on resize
    useEffect(() => {
        const updateVisibleCount = () => {
            if (typeof window === 'undefined') return;
            if (window.innerWidth >= 768) setVisibleCount(2); // md: 2 videos
            else setVisibleCount(1); // mobile: 1 video
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    // Auto-slide every 3 seconds
    useEffect(() => {
        if (videos.length <= visibleCount) return; // Don't slide if not enough videos
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                // If we've reached the end, loop back to start
                return next > videos.length - visibleCount ? 0 : next;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [videos.length, visibleCount]);

    if (loading) {
        return (
            <section id="videos" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
                <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                    <SectionTitle
                        icon={PlayIcon}
                        title={translations[language].videos.title}
                        subtitle={translations[language].videos.subtitle}
                    />
                    <div className="mt-16 text-center text-gray-500">
                        {translations[language].videos.loading}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="videos" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
            <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                <SectionTitle
                    icon={PlayIcon}
                    title={translations[language].videos.title}
                    subtitle={translations[language].videos.subtitle}
                />
                
                {videos.length > 0 ? (
                    <div className="mt-16 w-full max-w-6xl overflow-hidden">
                        <div 
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
                        >
                            {videos.map((video, index) => {
                                // Extract clean video ID from stored value (in case full URL was stored)
                                const extractVideoId = (urlOrId: string): string => {
                                    if (!urlOrId) return '';
                                    // If it's already just an ID (11 characters)
                                    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId.trim())) {
                                        return urlOrId.trim();
                                    }
                                    // Extract from URL
                                    const match = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/);
                                    return match ? match[1] : urlOrId.trim();
                                };

                                const cleanVideoId = extractVideoId(video.video_id);
                                
                                return (
                                <div key={video.id || index} className="flex-shrink-0 w-full md:w-1/2 px-4 flex flex-col">
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg transition-all duration-300">
                                        {cleanVideoId && cleanVideoId.length === 11 ? (
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${cleanVideoId}?rel=0&modestbranding=1&showinfo=0&controls=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                                                title={video.title}
                                                frameBorder="0"
                                                style={{ 
                                                    border: 'none', 
                                                    margin: 0, 
                                                    padding: 0,
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                loading="lazy"
                                            ></iframe>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                                <div className="text-center">
                                                    <PlayIcon className="size-16 mx-auto mb-4" style={{ color: '#762727' }} />
                                                    <p className="text-gray-600 font-medium">{video.title || `Video ${index + 1}`}</p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {cleanVideoId ? 'Invalid video ID' : 'Video link will be added'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold mt-4 mb-2" style={{ color: '#762727' }}>{video.title}</h3>
                                    {video.description && (
                                        <p className="text-sm text-gray-600">{video.description}</p>
                                    )}
                                </div>
                            );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="mt-16 text-center text-gray-500">
                        {translations[language].videos.empty}
                    </div>
                )}
                
                <a 
                    href="https://www.youtube.com/@gnoa2976/featured" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white text-xs md:text-sm font-medium transition-all duration-300 hover:opacity-90 flex items-center gap-1.5 justify-center" 
                    style={{ backgroundColor: '#FF0000' }}
                >
                    <YoutubeIcon size={14} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">
                        {translations[language].videos.ytFull}
                    </span>
                    <span className="sm:hidden">
                        {translations[language].videos.ytShort}
                    </span>
                </a>
            </div>
        </section>
    )
}
