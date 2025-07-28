import React, { useState, useRef, useEffect } from 'react';

const LazyVideo = ({
    src,
    className = '',
    placeholder = null,
    autoPlay = false,
    loop = false,
    muted = true,
    playsInline = true,
    preload = "metadata",
    onError = null,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [error, setError] = useState(false);
    const videoRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoadedData = () => {
        setIsLoaded(true);
    };

    const handleError = (e) => {
        setError(true);
        if (onError) {
            onError(e);
        }
    };

    return (
        <div ref={videoRef} className={`lazy-video-container ${className}`} {...props}>
            {(!isInView || error) && placeholder && (
                <div className="lazy-video-placeholder">
                    {placeholder}
                </div>
            )}
            {isInView && !error && (
                <video
                    src={src}
                    className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        } ${className}`}
                    autoPlay={autoPlay}
                    loop={loop}
                    muted={muted}
                    playsInline={playsInline}
                    preload={preload}
                    onLoadedData={handleLoadedData}
                    onError={handleError}
                    {...props}
                />
            )}
        </div>
    );
};

export default LazyVideo;
