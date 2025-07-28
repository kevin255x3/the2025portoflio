import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './Navbar';
import LazyImage from './LazyImage';
import LazyVideo from './LazyVideo';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const AdaptiveText = ({ children, className = "", isButton = false }) => {
    const textRef = useRef(null);
    const [textStyle, setTextStyle] = useState({});

    useEffect(() => {
        const updateTextColor = () => {
            if (!textRef.current) return;

            const textRect = textRef.current.getBoundingClientRect();
            const imageElement = document.querySelector('#about-image');

            if (imageElement) {
                const imageRect = imageElement.getBoundingClientRect();

                // Check if text overlaps with image
                const isOverlapping = !(textRect.right < imageRect.left ||
                    textRect.left > imageRect.right ||
                    textRect.bottom < imageRect.top ||
                    textRect.top > imageRect.bottom);

                if (isOverlapping) {
                    if (isButton) {
                        // For buttons, apply white text and white border when overlapping
                        setTextStyle({
                            color: 'white',
                            borderColor: 'white'
                        });
                    } else {
                        // Calculate gradient based on overlap for text
                        const gradientStop = Math.max(0, Math.min(100,
                            ((imageRect.left - textRect.left) / textRect.width) * 100
                        ));

                        setTextStyle({
                            background: `linear-gradient(to right, black ${gradientStop}%, white ${gradientStop}%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        });
                    }
                } else {
                    if (isButton) {
                        setTextStyle({
                            color: 'black',
                            borderColor: 'black'
                        });
                    } else {
                        setTextStyle({ color: 'black' });
                    }
                }
            }
        };

        updateTextColor();
        window.addEventListener('resize', updateTextColor);
        window.addEventListener('scroll', updateTextColor);

        return () => {
            window.removeEventListener('resize', updateTextColor);
            window.removeEventListener('scroll', updateTextColor);
        };
    }, [isButton]);

    return (
        <div ref={textRef} className={className} style={textStyle}>
            {children}
        </div>
    );
};

const ProjectListItem = ({ project, navigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showHoverImage, setShowHoverImage] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // Changed from 768 to 1024 to include tablets
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleProjectClick = () => {
        if (project.projectId) {
            navigate(`/project/${project.projectId}`);
        }
    };

    const handleRowClick = () => {
        if (isMobile) {
            setIsExpanded(!isExpanded);
        }
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setShowHoverImage(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setShowHoverImage(false);
        }
    };

    const handleMouseMove = (e) => {
        if (!isMobile) {
            setMousePosition({ x: e.clientX, y: e.clientY });
        }
    };

    // Get the featured video (first video in images array) or first image
    const getPreviewMedia = () => {
        // Look for the first video file
        const videoFile = project.images.find(img => img.endsWith('.mp4'));
        if (videoFile) return { type: 'video', src: videoFile };

        // Fallback to first image
        return { type: 'image', src: project.images[0] };
    };

    const previewMedia = getPreviewMedia();

    return (
        <div className="border-b border-gray-200 relative">
            <div
                className={`grid grid-cols-12 gap-2 sm:gap-4 py-4 sm:py-6 transition-colors ${isMobile ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50'}`}
                onClick={handleRowClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {/* ID */}
                <div className="col-span-1 text-xs sm:text-sm font-mono text-gray-600">
                    {project.id}
                </div>

                {/* Project Name */}
                <div
                    className="col-span-4 sm:col-span-3 text-xs sm:text-sm font-mori-semibold cursor-pointer hover:underline"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick();
                    }}
                >
                    {project.name}
                </div>

                {/* Type/Categories - Hidden on small mobile */}
                <div className="col-span-3 sm:col-span-3 text-xs sm:text-sm text-gray-600 font-mori-regular hidden xs:block">
                    {project.type}
                </div>

                {/* Role - Hidden on mobile */}
                <div className="col-span-3 text-xs sm:text-sm text-gray-600 font-mori-regular hidden sm:block">
                    {project.role}
                </div>

                {/* Year */}
                <div className="col-span-2 sm:col-span-1 text-xs sm:text-sm text-gray-600 font-mori-regular">
                    {project.year}
                </div>

                {/* Expand Arrow - Only on mobile */}
                {isMobile && (
                    <div className="col-span-2 sm:col-span-1 text-right">
                        <span className={`text-xs sm:text-sm transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}>
                            ↓
                        </span>
                    </div>
                )}
            </div>

            {/* Desktop Hover Preview - Follows mouse */}
            {!isMobile && showHoverImage && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: mousePosition.x + 20,
                        top: mousePosition.y - 100,
                        transform: 'translate(0, -50%)'
                    }}
                >
                    <div className="w-64 h-40 bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-black/10">
                        {previewMedia.type === 'video' ? (
                            <video
                                src={previewMedia.src}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                onLoadStart={(e) => {
                                    e.target.play().catch(() => { });
                                }}
                            />
                        ) : (
                            <LazyImage
                                src={previewMedia.src}
                                alt={`${project.name} preview`}
                                className="w-full h-full object-cover"
                                placeholder={
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                                        LOADING...
                                    </div>
                                }
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">PREVIEW</div>`;
                                }}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Expanded Content with Smooth Animation */}
            {isMobile && (
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="pb-4 sm:pb-6 pl-4 sm:pl-8">
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto">
                            {project.images.map((image, idx) => (
                                <div key={idx} className="flex-shrink-0 w-20 h-12 sm:w-24 sm:h-16 bg-gray-200 rounded overflow-hidden">
                                    {image.endsWith('.mp4') ? (
                                        <LazyVideo
                                            src={image}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                            preload="metadata"
                                            placeholder={
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                                                    VIDEO
                                                </div>
                                            }
                                            onMouseEnter={(e) => e.target.play().catch(() => { })}
                                            onMouseLeave={(e) => e.target.pause()}
                                        />
                                    ) : (
                                        <LazyImage
                                            src={image}
                                            alt={`${project.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            placeholder={
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                                                    IMG
                                                </div>
                                            }
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>`;
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PortfolioPage = () => {
    const navigate = useNavigate();

    // Refs for sections
    const heroRef = useRef(null);
    const philosophyRef = useRef(null);
    const workRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    const footerRef = useRef(null);

    // Transform existing projects data to match new format
    const projects = [
        {
            id: "01.",
            name: "FONTS.LOCAL",
            type: "WEB DEVELOPMENT . UI/UX . 3D",
            role: "DEVELOPER, DESIGNER, 3D ARTIST",
            year: "2025",
            projectId: "01",
            images: ["/fontslocalproject/fontslocal.mp4", "/img/fontlocalcover.jpg", "/fontslocalproject/galleryimages/fl1.png", "/fontslocalproject/galleryimages/fl2.png", "/fontslocalproject/galleryimages/fl3.png", "/fontslocalproject/galleryimages/fl4.png"]
        },
        {
            id: "02.",
            name: "DOUBLEBACK CONCEPT STORE",
            type: "UI/UX . DESIGN . BRANDING",
            role: "DESIGNER, DEVELOPER",
            year: "2025",
            projectId: "02",
            images: ["/doublebackproject/dbconceptvid.mp4", "/img/dbconceptcover.jpg", "/doublebackproject/galleryimages/db1.png", "/doublebackproject/galleryimages/db2.png", "/doublebackproject/galleryimages/db3.png", "/doublebackproject/galleryimages/db4.png"]
        },
        {
            id: "03.",
            name: "COURTFINDER+",
            type: "WEB DEVELOPMENT . UI/UX",
            role: "DEVELOPER, DESIGNER",
            year: "2025",
            projectId: "03",
            images: ["/courtfinderproject/courtfinder.mp4", "/img/cfcover.JPG", "/courtfinderproject/galleryimages/cf1.png", "/courtfinderproject/galleryimages/cf2.png", "/courtfinderproject/galleryimages/cf3.png", "/courtfinderproject/galleryimages/cf4.png"]
        },
        {
            id: "04.",
            name: "KIAMVP",
            type: "3D . WEB DEVELOPMENT . DESIGN",
            role: "3D DEVELOPER, DESIGNER",
            year: "2025",
            projectId: "04",
            images: ["/kiamvp-project/kiamvpraceoptim2.mp4", "/img/kiacover.webp", "/kiamvp-project/galleryimages/mvp1.png", "/kiamvp-project/galleryimages/mvp2.png", "/kiamvp-project/galleryimages/mvp3.png", "/kiamvp-project/galleryimages/mvp4.png"]
        },
        {
            id: "05.",
            name: "TERRA LINKTREE REDESIGN",
            type: "WEB DEVELOPMENT . UI/UX",
            role: "DEVELOPER, DESIGNER",
            year: "2025",
            projectId: "05",
            images: ["/terraproject/terra_link.mp4", "/img/terracover.mp4", "/terraproject/galleryimages/g1.png", "/terraproject/galleryimages/g2.png", "/terraproject/galleryimages/g3.png"]
        },
        {
            id: "06.",
            name: "3D ART GALLERY",
            type: "THREE.JS . 3D . WEB DEVELOPMENT",
            role: "3D DEVELOPER, DESIGNER",
            year: "2025",
            projectId: "06",
            images: ["/threejs-project/threejsbuild.mp4", "/img/threejscover.jpeg", "/threejs-project/galleryimages/threejs1.png", "/threejs-project/galleryimages/threejs2.png", "/threejs-project/galleryimages/threejs3.png", "/threejs-project/galleryimages/threejs4.png"]
        }
    ];

    useEffect(() => {
        // Set initial opacity to 0 for all sections
        const sections = [
            { ref: heroRef, id: '#hero' },
            { ref: philosophyRef, id: '#philosophy' },
            { ref: workRef, id: '#work' },
            { ref: aboutRef, id: '#about' },
            { ref: contactRef, id: '#contact' },
            { ref: footerRef, id: '#footer' }
        ];

        sections.forEach(section => {
            if (section.ref.current) {
                gsap.set(section.ref.current, { opacity: 0 });
            }
        });

        // Create scroll triggers for each section with anchor-based control
        sections.forEach(section => {
            if (section.ref.current) {
                ScrollTrigger.create({
                    trigger: section.ref.current,
                    start: "top 75%",
                    end: "bottom 25%",
                    onEnter: () => {
                        gsap.to(section.ref.current, {
                            opacity: 1,
                            duration: 0.8,
                            ease: "power2.out"
                        });
                    },
                    onLeave: () => {
                        gsap.to(section.ref.current, {
                            opacity: 0,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    },
                    onEnterBack: () => {
                        gsap.to(section.ref.current, {
                            opacity: 1,
                            duration: 0.8,
                            ease: "power2.out"
                        });
                    },
                    onLeaveBack: () => {
                        gsap.to(section.ref.current, {
                            opacity: 0,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>Kevin Lazo - Creative Developer & Designer</title>
                <meta name="description" content="Kevin Lazo - Creative Developer & Designer in Surrey, BC" />
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Kevin Lazo - Creative Developer & Designer" />
                <meta property="og:description" content="Kevin Lazo - Creative Developer & Designer in Surrey, BC" />
                <meta property="og:url" content="https://madebykevinlazo.com" />
                {/* Twitter */}
                <meta name="twitter:title" content="Kevin Lazo - Creative Developer & Designer" />
                <meta name="twitter:description" content="Kevin Lazo - Creative Developer & Designer in Surrey, BC" />
            </Helmet>

            <Navbar />

            <div className="bg-white text-black min-h-screen">
                <style>{`
                    @font-face {
                        font-family: 'PP Mori';
                        src: url('/fonts/PPMori-Regular.woff') format('woff');
                        font-weight: 400;
                        font-style: normal;
                        font-display: swap;
                    }
                    
                    @font-face {
                        font-family: 'PP Mori';
                        src: url('/fonts/PPMori-SemiBold.woff') format('woff');
                        font-weight: 600;
                        font-style: normal;
                        font-display: swap;
                    }
                    
                    .font-mori-regular {
                        font-family: 'PP Mori', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-weight: 400;
                    }
                    
                    .font-mori-semibold {
                        font-family: 'PP Mori', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-weight: 600;
                    }

                    /* Custom breakpoint for extra small screens */
                    @media (min-width: 475px) {
                        .xs\\:block {
                            display: block;
                        }
                    }
                `}</style>

                {/* Hero Section with Justified Name */}
                <section id="hero" ref={heroRef} className="pt-16 sm:pt-20 pb-6 sm:pb-8">
                    <div className="px-4 sm:px-6 flex justify-between items-baseline">
                        <h1 className="text-[15vw] sm:text-[12vw] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-black leading-[0.85] tracking-tighter">
                            KEVIN
                        </h1>
                        <h1 className="text-[15vw] sm:text-[12vw] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-black leading-[0.85] tracking-tighter">
                            LAZO
                        </h1>
                    </div>

                    {/* Hero Video - Aligned with Text Edges */}
                    <div className="mt-6 sm:mt-8 px-4 sm:px-6">
                        <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] rounded-lg sm:rounded-xl overflow-hidden">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            >
                                <source src="/designphilosphyo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </section>

                {/* Philosophy Statement - Full Width */}
                <section id="philosophy" ref={philosophyRef} className="pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mori-regular leading-[1.1] mb-6 sm:mb-8 text-left w-full">
                        I believe in design rooted in clear thinking,<br />
                        built on systems that adapt and challenge<br />
                        the status quo.
                    </h2>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 sm:mb-16">
                        {['Design', 'Art Direction', 'Brand', 'Front end development'].map((skill) => (
                            <span
                                key={skill}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-black rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Dot Separator */}
                    <div className="flex justify-center mb-12 sm:mb-16">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"></div>
                    </div>
                </section>

                {/* Selected Work Section */}
                <section id="work" ref={workRef} className="px-4 sm:px-6">
                    {/* Section Header */}
                    <div className="flex justify-between items-start mb-12 sm:mb-16">
                        <div className="text-xs sm:text-sm text-gray-600 font-mori-semibold">2025</div>
                        <button
                            onClick={() => navigate('/portfolio')}
                            className="px-4 sm:px-6 py-2 sm:py-3 border border-black rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors"
                        >
                            View all
                        </button>
                    </div>

                    {/* Huge Section Title */}
                    <h3 className="text-[12vw] sm:text-[10vw] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-black leading-[0.85] tracking-tighter mb-16 sm:mb-20">
                        SELECTED WORK
                    </h3>

                    {/* Project List */}
                    <div className="space-y-0 mb-24 sm:mb-32">
                        {projects.map((project, index) => (
                            <ProjectListItem key={index} project={project} navigate={navigate} />
                        ))}
                    </div>
                </section>

                {/* About Section - Full Page Style */}
                <section id="about" ref={aboutRef} className="min-h-screen relative overflow-hidden bg-white">
                    {/* Background Image - Desktop Only (Large screens and up) */}
                    <div className="absolute right-0 top-0 w-1/2 h-full hidden xl:block">
                        <LazyImage
                            id="about-image"
                            src="/img/who1.jpeg"
                            alt="Kevin Lazo Portrait"
                            className="w-full h-full object-cover"
                            placeholder={
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl">
                                    Portrait Image
                                </div>
                            }
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl">
                                        Portrait Image
                                    </div>
                                `;
                            }}
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 min-h-screen flex flex-col justify-center">
                        {/* Section Header */}
                        <div className="flex justify-between items-start mb-12 sm:mb-16 lg:mb-20">
                            <div className="text-xs sm:text-sm text-black font-mori-semibold">About</div>
                            {/* Mobile/Tablet: Simple button */}
                            <button className="xl:hidden px-4 sm:px-6 py-2 sm:py-3 border border-black rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors cursor-pointer">
                                <a href="/resume/kevin_resume.pdf" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                    Resume
                                </a>
                            </button>
                            {/* Desktop: Adaptive button */}
                            <div className="hidden xl:block">
                                <AdaptiveText
                                    isButton={true}
                                    className="px-4 sm:px-6 py-2 sm:py-3 border rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors cursor-pointer"
                                >
                                    <a href="/resume/kevin_resume.pdf" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                        Resume
                                    </a>
                                </AdaptiveText>
                            </div>
                        </div>

                        {/* Main Content - Text-only on Mobile/Tablet, Adaptive on Desktop */}
                        <div className="space-y-12 sm:space-y-16 lg:space-y-24">
                            {/* Main Intro */}
                            <div className="w-full xl:w-4/5">
                                {/* Mobile/Tablet: Simple black text */}
                                <div className="xl:hidden text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mori-regular leading-tight text-black">
                                    Kevin Lazo — Digital Designer & Developer. Born in Manila, raised by curiosity,
                                    countless iterations, and a deep fascination with systems that just work.
                                </div>
                                {/* Desktop: Adaptive text with contrast */}
                                <div className="hidden xl:block">
                                    <AdaptiveText className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mori-regular leading-tight">
                                        Kevin Lazo — Digital Designer & Developer. Born in Manila, raised by curiosity,
                                        countless iterations, and a deep fascination with systems that just work.
                                    </AdaptiveText>
                                </div>
                            </div>

                            {/* Education Section */}
                            <div className="w-full xl:w-3/4">
                                {/* Mobile/Tablet: Simple black text */}
                                <div className="xl:hidden">
                                    <div className="text-base sm:text-lg font-mori-semibold mb-6 sm:mb-8 text-black">
                                        Education
                                    </div>
                                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mori-regular leading-tight text-black">
                                        I studied Design & Development at BCIT and Digital Management at HDM Stuttgart,
                                        where I developed a passion for bridging the gap between technology and creativity.
                                    </div>
                                </div>
                                {/* Desktop: Adaptive text with contrast */}
                                <div className="hidden xl:block">
                                    <AdaptiveText className="text-base sm:text-lg font-mori-semibold mb-6 sm:mb-8">
                                        Education
                                    </AdaptiveText>
                                    <AdaptiveText className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mori-regular leading-tight">
                                        I studied Design & Development at BCIT and Digital Management at HDM Stuttgart,
                                        where I developed a passion for bridging the gap between technology and creativity.
                                    </AdaptiveText>
                                </div>
                            </div>

                            {/* Experience Section */}
                            <div className="w-full xl:w-4/5">
                                {/* Mobile/Tablet: Simple black text */}
                                <div className="xl:hidden">
                                    <div className="text-base sm:text-lg font-mori-semibold mb-6 sm:mb-8 text-black">
                                        Experience
                                    </div>
                                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mori-regular leading-tight text-black">
                                        My career spans local businesses and freelance projects, where I've contributed to
                                        brands in photography, hospitality, and various creative pursuits. I specialize in
                                        creating digital experiences that challenge conventions and solve real problems.
                                    </div>
                                </div>
                                {/* Desktop: Adaptive text with contrast */}
                                <div className="hidden xl:block">
                                    <AdaptiveText className="text-base sm:text-lg font-mori-semibold mb-6 sm:mb-8">
                                        Experience
                                    </AdaptiveText>
                                    <AdaptiveText className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mori-regular leading-tight">
                                        My career spans local businesses and freelance projects, where I've contributed to
                                        brands in photography, hospitality, and various creative pursuits. I specialize in
                                        creating digital experiences that challenge conventions and solve real problems.
                                    </AdaptiveText>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" ref={contactRef} className="py-16 sm:py-20 px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mori-regular leading-tight mb-8 sm:mb-12 w-full">
                        Questions, ideas, or just curious? You'll find artifacts on LinkedIn, or reach me directly anytime at{' '}
                        <span className="underline">hellokevinlazo@gmail.com</span>.
                    </h2>
                </section>

                {/* Footer */}
                <footer id="footer" ref={footerRef} className="py-16 sm:py-20 px-4 sm:px-6">
                    {/* Mobile/Tablet Footer - Clean name layout without image */}
                    <div className="xl:hidden">
                        <div className="text-center mb-8 sm:mb-12">
                            <h1 className="text-[15vw] sm:text-[12vw] md:text-[8rem] font-black leading-[0.85] tracking-tighter">
                                KEVIN LAZO
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Footer - Justified with footer image */}
                    <div className="hidden xl:block">
                        <div className="flex justify-between items-center mb-8 sm:mb-12">
                            <h1 className="text-[15vw] sm:text-[12vw] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-black leading-[0.85] tracking-tighter">
                                KEVIN
                            </h1>

                            {/* Footer Image - Desktop Only */}
                            <div className="flex items-center justify-center">
                                <LazyImage
                                    src="/footer.PNG"
                                    alt="Footer Logo"
                                    className="h-[18vw] sm:h-[15vw] md:h-[12rem] lg:h-[15rem] xl:h-[18rem] w-auto"
                                    placeholder={
                                        <div className="h-[18vw] sm:h-[15vw] md:h-[12rem] lg:h-[15rem] xl:h-[18rem] w-auto bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">LOGO</span>
                                        </div>
                                    }
                                />
                            </div>

                            <h1 className="text-[15vw] sm:text-[12vw] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-black leading-[0.85] tracking-tighter">
                                LAZO
                            </h1>
                        </div>
                    </div>

                    {/* Footer Links - Same for all devices */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <a
                                href="https://instagram.com/kevinlazo"
                                className="px-4 sm:px-5 py-1.5 sm:py-2 border border-black rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://linkedin.com/in/kevinlazo"
                                className="px-4 sm:px-5 py-1.5 sm:py-2 border border-black rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="/resume/kevin_resume.pdf"
                                className="px-4 sm:px-5 py-1.5 sm:py-2 border border-black rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors"
                            >
                                Resume
                            </a>
                        </div>

                        <a
                            href="mailto:hellokevinlazo@gmail.com"
                            className="px-4 sm:px-5 py-1.5 sm:py-2 border border-black rounded-full text-xs sm:text-sm font-mori-regular hover:bg-black hover:text-white transition-colors w-fit"
                        >
                            hellokevinlazo@gmail.com
                        </a>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default PortfolioPage;