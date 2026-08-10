"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/section-title";
import { PlayIcon, YoutubeIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";

interface VideoData {
    id: number;
    video_id: string;
    title: string;
    description?: string;
}

function extractVideoId(urlOrId: string): string {
    if (!urlOrId) return "";
    const trimmed = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : trimmed;
}

const SLIDE_INTERVAL_MS = 8000;

export default function VideosSection() {
    const { language } = useLanguage();
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(2);
    const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

    useEffect(() => {
        fetch("/api/videos")
            .then((res) => res.json())
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (typeof window === "undefined") return;
            setVisibleCount(window.innerWidth >= 768 ? 2 : 1);
        };
        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    useEffect(() => {
        if (selectedVideo) return;
        if (videos.length <= visibleCount) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                return next > videos.length - visibleCount ? 0 : next;
            });
        }, SLIDE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [videos.length, visibleCount, selectedVideo]);

    useEffect(() => {
        document.body.style.overflow = selectedVideo ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedVideo]);

    useEffect(() => {
        if (!selectedVideo) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedVideo(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selectedVideo]);

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

    const selectedVideoId = selectedVideo ? extractVideoId(selectedVideo.video_id) : "";
    const canSlide = videos.length > visibleCount;
    const maxIndex = videos.length - visibleCount;

    const slidePrev = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const slideNext = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    return (
        <section id="videos" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
            <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                <SectionTitle
                    icon={PlayIcon}
                    title={translations[language].videos.title}
                    subtitle={translations[language].videos.subtitle}
                />

                {videos.length > 0 ? (
                    <div className="mt-16 w-full max-w-6xl relative">
                        {canSlide && (
                            <>
                                <button
                                    type="button"
                                    onClick={slidePrev}
                                    className="absolute left-0 top-[28%] md:top-[32%] -translate-y-1/2 z-10 p-2 md:p-3 rounded-full border-2 bg-white shadow-lg transition-[transform,opacity,colors,background-color,box-shadow] duration-200 hover:scale-105 hover:shadow-xl -translate-x-1 md:-translate-x-4"
                                    style={{ borderColor: "#762727", color: "#762727" }}
                                    aria-label="Previous videos"
                                >
                                    <ChevronLeftIcon size={22} />
                                </button>
                                <button
                                    type="button"
                                    onClick={slideNext}
                                    className="absolute right-0 top-[28%] md:top-[32%] -translate-y-1/2 z-10 p-2 md:p-3 rounded-full border-2 bg-white shadow-lg transition-[transform,opacity,colors,background-color,box-shadow] duration-200 hover:scale-105 hover:shadow-xl translate-x-1 md:translate-x-4"
                                    style={{ borderColor: "#762727", color: "#762727" }}
                                    aria-label="Next videos"
                                >
                                    <ChevronRightIcon size={22} />
                                </button>
                            </>
                        )}

                        <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                            }}
                        >
                            {videos.map((video, index) => {
                                const cleanVideoId = extractVideoId(video.video_id);
                                const isValid = cleanVideoId.length === 11;

                                return (
                                    <div
                                        key={video.id || index}
                                        className="flex-shrink-0 w-full md:w-1/2 px-4 flex flex-col"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => isValid && setSelectedVideo(video)}
                                            disabled={!isValid}
                                            className="group relative w-full aspect-video rounded-xl overflow-hidden shadow-lg transition-[transform,opacity,colors,background-color,box-shadow] duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed text-left"
                                            style={{ focusRingColor: "#762727" } as React.CSSProperties}
                                        >
                                            {isValid ? (
                                                <>
                                                    <img
                                                        src={`https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`}
                                                        alt={video.title}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-200" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div
                                                            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110"
                                                            style={{ backgroundColor: "rgba(118, 39, 39, 0.9)" }}
                                                        >
                                                            <PlayIcon
                                                                size={28}
                                                                className="text-white ml-1"
                                                                fill="white"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                                    <div className="text-center px-4">
                                                        <PlayIcon
                                                            className="size-16 mx-auto mb-4"
                                                            style={{ color: "#762727" }}
                                                        />
                                                        <p className="text-gray-600 font-medium">
                                                            {video.title || `Video ${index + 1}`}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            {cleanVideoId
                                                                ? "Invalid video ID"
                                                                : "Video link will be added"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                        <h3
                                            className="text-lg font-semibold mt-4 mb-2"
                                            style={{ color: "#762727" }}
                                        >
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-sm text-gray-600">{video.description}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        </div>

                        {canSlide && (
                            <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setCurrentIndex(i)}
                                        className="h-2 rounded-full transition-[transform,opacity,colors,background-color,box-shadow] duration-200"
                                        style={{
                                            width: currentIndex === i ? "1.5rem" : "0.5rem",
                                            backgroundColor:
                                                currentIndex === i ? "#762727" : "rgba(118, 39, 39, 0.25)",
                                        }}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-16 text-center text-gray-500">
                        {translations[language].videos.empty}
                    </div>
                )}

                {/* Video popup */}
                {selectedVideo && selectedVideoId.length === 11 && (
                    <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col">
                        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 shrink-0">
                            <p className="text-white/90 text-sm md:text-base font-medium truncate min-w-0">
                                {selectedVideo.title}
                            </p>
                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
                                className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                aria-label="Close"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 md:px-8 md:pb-8 min-h-0">
                            <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                                    title={selectedVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                            {selectedVideo.description && (
                                <p className="text-sm text-white/70 mt-4 max-w-4xl w-full text-center md:text-left">
                                    {selectedVideo.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <a
                    href="https://www.youtube.com/@gnoa2976/featured"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white text-xs md:text-sm font-medium transition-[transform,opacity,colors,background-color,box-shadow] duration-200 hover:opacity-90 flex items-center gap-1.5 justify-center"
                    style={{ backgroundColor: "#FF0000" }}
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
    );
}
