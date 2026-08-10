"use client";

import { useState, useEffect } from "react";
import AnimatedContent from "@/components/animated-content";
import SectionTitle from "@/components/section-title";
import { ImageIcon, XIcon, FacebookIcon } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/i18n";

interface PhotoCard {
    id: number;
    image: string;
    title: string;
    description: string;
    category?: string;
}

export default function TestimonialSection() {
    const { language } = useLanguage();
    const [photoCards, setPhotoCards] = useState<PhotoCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState<PhotoCard | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);

    useEffect(() => {
        fetch('/api/photo-cards')
            .then(res => res.json())
            .then(data => {
                setPhotoCards(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedCard) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedCard]);

    // Auto-advance every 3 seconds for desktop
    useEffect(() => {
        if (photoCards.length <= 1) return;
        
        const interval = setInterval(() => {
            setActiveIndex((prev) => {
                return (prev + 1) % photoCards.length;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [photoCards.length]);

    // Auto-slide every 3 seconds for mobile
    useEffect(() => {
        if (photoCards.length <= 1) return;
        
        const interval = setInterval(() => {
            setMobileIndex((prev) => {
                return (prev + 1) % photoCards.length;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [photoCards.length]);

    if (loading) {
        return (
            <section id="testimonials" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
                <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                    <SectionTitle
                        icon={ImageIcon}
                        title={translations[language].testimonial.title}
                        subtitle={translations[language].testimonial.subtitle}
                    />
                    <div className="mt-24 text-center text-gray-500">
                        {translations[language].testimonial.loading}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="testimonials" className="px-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
            <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
                <SectionTitle
                    icon={ImageIcon}
                    title={translations[language].testimonial.title}
                    subtitle={translations[language].testimonial.subtitle}
                />
                {photoCards.length > 0 ? (
                    <>
                        {/* Mobile Sliding Carousel */}
                        <div className="mt-24 w-full max-w-7xl mx-auto px-4 md:hidden">
                            <div className="relative overflow-hidden">
                                <div 
                                    className="flex transition-transform duration-200 ease-in-out"
                                    style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
                                >
                                    {photoCards.map((card, index) => (
                                    <div key={card.id || index} className="flex-shrink-0 w-full px-2">
                                        <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 transition-[transform,opacity,colors,background-color,box-shadow] duration-200 hover:scale-105 cursor-pointer" onClick={() => setSelectedCard(card)}>
                                            <div className="relative h-64 overflow-hidden">
                                                <Image
                                                    src={card.image}
                                                    alt={card.title}
                                                    fill
                                                    className="object-cover transition-transform duration-200 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                                {card.category && (
                                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm" style={{ backgroundColor: 'rgba(118, 39, 39, 0.8)' }}>
                                                        {card.category}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-base font-semibold mb-2" style={{ color: '#762727' }}>{card.title}</h3>
                                                <p className="text-xs text-gray-600 leading-relaxed">{card.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Expanding Cards */}
                        <div className="mt-24 w-full max-w-6xl mx-auto px-4 hidden md:block">
                            <div className="flex flex-row items-stretch overflow-hidden min-h-[400px] h-[400px] gap-2.5">
                                {photoCards.map((card, index) => {
                                    const isActive = activeIndex === index;
                                    return (
                                    <div
                                        key={card.id || index}
                                        className={`relative overflow-hidden cursor-pointer border border-gray-200 ${
                                            isActive 
                                                ? 'flex-[10000] max-w-[600px] rounded-[40px] m-0' 
                                                : 'flex-1 min-w-[60px] rounded-[30px] m-2.5'
                                        }`}
                                    style={{
                                        backgroundImage: `url(${card.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundColor: '#E6E9ED',
                                        willChange: isActive ? 'flex, border-radius, margin' : 'auto',
                                        transition: isActive 
                                            ? 'flex 0.35s cubic-bezier(0.23, 1, 0.32, 1), border-radius 0.35s cubic-bezier(0.23, 1, 0.32, 1), margin 0.35s cubic-bezier(0.23, 1, 0.32, 1)'
                                            : 'flex 0.35s cubic-bezier(0.23, 1, 0.32, 1), border-radius 0.35s cubic-bezier(0.23, 1, 0.32, 1), margin 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)',
                                        WebkitTransform: 'translateZ(0)',
                                        isolation: 'isolate',
                                        contain: 'layout style paint'
                                    }}
                                    onClick={() => {
                                        if (isActive) {
                                            setSelectedCard(card);
                                        } else {
                                            setActiveIndex(index);
                                        }
                                    }}
                                >
                                    {/* Background overlay for depth */}
                                    <div 
                                        className="absolute inset-0"
                                        style={{
                                            background: isActive 
                                                ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)'
                                                : 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)',
                                            transition: 'background 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    
                                    {/* Label */}
                                    <div 
                                        className="absolute right-0 flex items-center"
                                        style={{
                                            bottom: isActive ? '20px' : '10px',
                                            left: isActive ? '20px' : '10px',
                                            height: isActive ? 'auto' : '40px',
                                            willChange: isActive ? 'bottom, left, height' : 'auto',
                                            transition: isActive 
                                                ? 'bottom 0.35s cubic-bezier(0.23, 1, 0.32, 1), left 0.35s cubic-bezier(0.23, 1, 0.32, 1), height 0.35s cubic-bezier(0.23, 1, 0.32, 1)'
                                                : 'bottom 0.35s cubic-bezier(0.23, 1, 0.32, 1), left 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'translateZ(0)',
                                            WebkitTransform: 'translateZ(0)'
                                        }}
                                    >
                                        {/* Icon */}
                                        <div 
                                            className="flex-shrink-0 flex flex-row justify-center items-center min-w-10 max-w-10 h-10 rounded-full bg-white"
                                            style={{ 
                                                color: '#762727',
                                                willChange: 'transform',
                                                backfaceVisibility: 'hidden',
                                                WebkitBackfaceVisibility: 'hidden',
                                                transform: 'translateZ(0)',
                                                WebkitTransform: 'translateZ(0)'
                                            }}
                                        >
                                            <ImageIcon size={20} />
                                        </div>
                                        
                                        {/* Info */}
                                        <div 
                                            className="flex flex-col justify-center ml-2.5 text-white max-w-[calc(100%-3rem)]"
                                            style={{
                                                opacity: isActive ? 1 : 0,
                                                transform: isActive ? 'translate3d(0, 0, 0)' : 'translate3d(20px, 0, 0)',
                                                pointerEvents: isActive ? 'auto' : 'none',
                                                willChange: 'opacity, transform',
                                                transition: 'opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1) 0.05s, transform 0.3s cubic-bezier(0.23, 1, 0.32, 1) 0.05s',
                                                backfaceVisibility: 'hidden',
                                                WebkitBackfaceVisibility: 'hidden'
                                            }}
                                        >
                                            <div className="relative font-bold text-xl">
                                                {card.title}
                                            </div>
                                            <div 
                                                className="relative text-sm line-clamp-2"
                                                style={{
                                                    transition: 'opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1) 0.08s'
                                                }}
                                            >
                                                {card.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-24 text-center text-gray-500">
                        {translations[language].testimonial.empty}
                    </div>
                )}

                {/* Modal/Popup */}
                {selectedCard && (
                    <div 
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setSelectedCard(null)}
                    >
                        <div 
                            className="relative max-w-4xl w-full max-h-[90vh] bg-white/95 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.20)] overflow-hidden transition-[transform,opacity,colors,background-color,box-shadow] duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-[transform,opacity,colors,background-color,box-shadow] duration-200 hover:scale-110 hover:bg-white"
                                style={{ color: '#762727' }}
                                aria-label="Close"
                            >
                                <XIcon size={24} />
                            </button>

                            {/* Image */}
                            <div className="relative w-full h-[60vh] min-h-[400px] bg-gray-100">
                                <Image
                                    src={selectedCard.image}
                                    alt={selectedCard.title}
                                    fill
                                    className="object-contain"
                                />
                                {selectedCard.category && (
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm" style={{ backgroundColor: 'rgba(118, 39, 39, 0.8)' }}>
                                        {selectedCard.category}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#762727' }}>
                                    {selectedCard.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {selectedCard.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <a 
                    href="https://www.facebook.com/gnoa.nhsl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white text-xs md:text-sm font-medium transition-[transform,opacity,colors,background-color,box-shadow] duration-200 hover:opacity-90 flex items-center gap-1.5 justify-center" 
                    style={{ backgroundColor: '#1877F2' }}
                >
                    <FacebookIcon size={14} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">
                        {translations[language].testimonial.fbFull}
                    </span>
                    <span className="sm:hidden">
                        {translations[language].testimonial.fbShort}
                    </span>
                </a>
            </div>
        </section>
    )
}