// Routing Imports
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// UseEffect Imports
import { useEffect, Suspense, lazy } from 'react';

// Lazy load components for better performance
const PortfolioPage = lazy(() => import('./PortfolioPage'));
const DetailedPortfolio = lazy(() => import('./DetailedPortfolio'));
const ProjectDetailsPage = lazy(() => import('./ProjectDetailsPage'));
const About = lazy(() => import('./About'));
//Unique style imports
import './PortfolioStyles.css';
// ScrolltoTop function
import ScrollToTop from './ScrollToTop';

//Metadata dependency
import { Helmet } from 'react-helmet';

// Component to handle body overflow based on route
function BodyStyleHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      // Landing page - allow scrolling
      document.body.style.overflow = 'auto';
    } else if (location.pathname === '/portfolio') {
      // Portfolio page - keep overflow hidden
      document.body.style.overflow = 'hidden';
    } else if (location.pathname.includes('/project/') ||
      location.pathname === '/about') {
      // Project detail page, About page - allow scrolling
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      // No need to reset here as each component will handle its own state
    };
  }, [location]);

  return null;
}

function App() {
  return (


    <Router>
      <ScrollToTop />
      <BodyStyleHandler />
      <Helmet>
        {/* Basic Metadata */}
        <meta charSet="utf-8" />
        <title>Kevin Lazo - Web Developer & Designer</title>
        <meta name="description" content="Portfolio of Kevin Lazo, a web developer and designer specializing in UI/UX design and interactive digital experiences." />
        <meta name="author" content="Kevin Lazo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Search Engine Optimization */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://madebykevinlazo.com" />
        <meta name="keywords" content="web developer, designer, UI/UX, React, portfolio, Kevin Lazo" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kevin Lazo Portfolio" />
        <meta property="og:title" content="Kevin Lazo - Web Developer & Designer" />
        <meta property="og:description" content="Portfolio of Kevin Lazo, a web developer and designer specializing in UI/UX design and interactive digital experiences." />
        <meta property="og:image" content="https://madebykevinlazo.com/img/throw.png" />
        <meta property="og:url" content="https://madebykevinlazo.com" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kevin Lazo - Web Developer & Designer" />
        <meta name="twitter:description" content="Portfolio of Kevin Lazo, a web developer and designer specializing in UI/UX design and interactive digital experiences." />
        <meta name="twitter:image" content="https://madebykevinlazo.com/img/throw.png" />

        {/* Icons */}
        <link rel="icon" href="/img/throw.png" />
        <link rel="apple-touch-icon" href="/img/throw.png" />

        {/* Theme */}
        <meta name="theme-color" content="#ffffff" />

        {/* Additional */}
        <meta name="color-scheme" content="light" />
      </Helmet>

      {/* Routes */}
      <div className="App">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/portfolio" element={<DetailedPortfolio />} />
            <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </div>
    </Router>

  );
}

export default App;