'use client';

import React, { useEffect, useRef } from 'react';

interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    container?: Element | string | null;
    distance?: number;
    direction?: 'vertical' | 'horizontal';
    reverse?: boolean;
    duration?: number;
    ease?: string;
    initialOpacity?: number;
    animateOpacity?: boolean;
    scale?: number;
    threshold?: number;
    delay?: number;
    disappearAfter?: number;
    disappearDuration?: number;
    disappearEase?: string;
    onComplete?: () => void;
    onDisappearanceComplete?: () => void;
}

/**
 * Lightweight scroll reveal — CSS + IntersectionObserver only.
 * No GSAP/ScrollTrigger (those were fighting sticky layout and Lenis during scroll).
 */
const AnimatedContent: React.FC<AnimatedContentProps> = ({
    children,
    distance = 16,
    direction = 'vertical',
    reverse = false,
    duration = 0.28,
    delay = 0,
    threshold = 0.12,
    className = '',
    style,
    onComplete,
    // unused legacy props kept for call-site compatibility
    container: _container,
    ease: _ease,
    initialOpacity: _initialOpacity,
    animateOpacity: _animateOpacity,
    scale: _scale,
    disappearAfter: _disappearAfter,
    disappearDuration: _disappearDuration,
    disappearEase: _disappearEase,
    onDisappearanceComplete: _onDisappearanceComplete,
    ...props
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const axis = direction === 'horizontal' ? 'X' : 'Y';
    const offset = reverse ? -distance : distance;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.classList.add('is-revealed');
            onComplete?.();
            return;
        }

        // Already in view on first paint — show immediately (no scroll jank on load)
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * (1 - threshold) && rect.bottom > 0;
        if (inView) {
            // slight delay so first paint stays stable
            const id = window.setTimeout(() => {
                el.classList.add('is-revealed');
                onComplete?.();
            }, Math.max(0, delay * 1000));
            return () => window.clearTimeout(id);
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                el.classList.add('is-revealed');
                io.disconnect();
                if (onComplete) {
                    window.setTimeout(onComplete, (delay + duration) * 1000);
                }
            },
            {
                threshold: Math.min(threshold, 0.2),
                rootMargin: '0px 0px -8% 0px',
            }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [delay, duration, threshold, onComplete]);

    return (
        <div
            ref={ref}
            className={`reveal-content ${distance !== 0 ? 'reveal-move' : ''} ${className}`}
            style={
                {
                    '--reveal-duration': `${duration}s`,
                    '--reveal-delay': `${delay}s`,
                    ...(distance !== 0
                        ? { '--reveal-offset': `translate${axis}(${offset}px)` }
                        : null),
                    ...style,
                } as React.CSSProperties
            }
            {...props}
        >
            {children}
        </div>
    );
};

export default AnimatedContent;
