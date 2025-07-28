import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        closeMobileMenu();

        if (location.pathname === '/') {
            // If on landing page, scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If on other pages, redirect to landing page with contact hash
            window.location.href = '/#contact';
        }
    };

    const handleAboutClick = (e) => {
        e.preventDefault();
        closeMobileMenu();

        if (location.pathname === '/') {
            // If on landing page, scroll to about section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If on other pages, redirect to landing page with about hash
            window.location.href = '/#about';
        }
    };

    const handleWorkClick = (e) => {
        e.preventDefault();
        closeMobileMenu();

        if (location.pathname === '/') {
            // If on landing page, scroll to work section
            const workSection = document.getElementById('work');
            if (workSection) {
                workSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If on other pages, redirect to landing page with work hash
            window.location.href = '/#work';
        }
    };

    return (
        <>
            <style>{`
                @font-face {
                    font-family: 'PP Mori';
                    src: url('/fonts/PPNeueMontreal-Regular.ttf') format('truetype');
                    font-weight: 400;
                    font-style: normal;
                    font-display: swap;
                }
                
                @font-face {
                    font-family: 'PP Mori';
                    src: url('/fonts/PPNeueMontreal-Bold.woff') format('woff');
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
            `}</style>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex justify-between items-center">
                        {/* Left: Title - Hidden on mobile and tablet */}
                        <div className="text-xs sm:text-sm font-mori-regular text-black hidden lg:block">
                            Digital Designer & Developer
                        </div>

                        {/* Mobile Menu Button - Visible on mobile and tablet */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden text-black focus:outline-none z-50"
                            aria-label="Toggle mobile menu"
                        >
                            <div className="space-y-1">
                                <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                            </div>
                        </button>

                        {/* Center: Logo Image */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:left-auto lg:transform-none">
                            <Link to="/" className="hover:opacity-75 transition-opacity" onClick={closeMobileMenu}>
                                <img
                                    src="/img/throw.png"
                                    alt="Kevin Lazo Logo"
                                    className="h-16 sm:h-20 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links - Hidden on mobile and tablet */}
                        <div className="hidden lg:flex space-x-4 xl:space-x-8">
                            <Link
                                to="/"
                                className="text-xs sm:text-sm font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                Index
                            </Link>
                            <a
                                href="#about"
                                onClick={handleAboutClick}
                                className="text-xs sm:text-sm font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                About
                            </a>
                            <a
                                href="#work"
                                onClick={handleWorkClick}
                                className="text-xs sm:text-sm font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                Work
                            </a>
                            <a
                                href="#contact"
                                onClick={handleContactClick}
                                className="text-xs sm:text-sm font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col justify-center items-center space-y-8">
                            <Link
                                to="/"
                                onClick={closeMobileMenu}
                                className="text-2xl font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                Index
                            </Link>
                            <a
                                href="#about"
                                onClick={handleAboutClick}
                                className="text-2xl font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                About
                            </a>
                            <a
                                href="#work"
                                onClick={handleWorkClick}
                                className="text-2xl font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                Work
                            </a>
                            <a
                                href="#contact"
                                onClick={handleContactClick}
                                className="text-2xl font-mori-regular text-black hover:text-gray-600 transition-colors"
                            >
                                Contact
                            </a>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;