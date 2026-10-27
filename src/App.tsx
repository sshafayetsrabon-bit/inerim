import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PageId, Project, BlogPost } from './types';
import { Product } from './data/shopData';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CostCalculatorModal } from './components/CostCalculatorModal';
import { ProjectModal } from './components/ProjectModal';
import { BlogModal } from './components/BlogModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { SEO } from './components/SEO';

// Page Views
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProcessPage } from './pages/ProcessPage';
import { PricingPage } from './pages/PricingPage';
import { QuotePage } from './pages/QuotePage';
import { ColourStudioPage } from './pages/ColourStudioPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { ContactPage } from './pages/ContactPage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BlogPage } from './pages/BlogPage';
import { JournalDetailPage } from './pages/JournalDetailPage';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [calculatorPrefill, setCalculatorPrefill] = useState<{
    spaceType: string;
    sqft: number;
    estimate: number;
    grade: string;
  } | null>(null);

  const { isDark } = useTheme();

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Map current pathname to PageId for Navbar active highlight
  const getCurrentPageId = (): PageId => {
    const path = location.pathname;
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/services') || path.startsWith('/how-we-work')) return 'services';
    if (path.startsWith('/pricing')) return 'pricing';
    if (path.startsWith('/quote')) return 'quote';
    if (path.startsWith('/colour-studio')) return 'colour-studio';
    if (path.startsWith('/partnership')) return 'partnership';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/projects') || path.startsWith('/work')) return 'work';
    if (path.startsWith('/shop')) return 'shop';
    if (path.startsWith('/journal') || path.startsWith('/blog')) return 'blog';
    return 'home';
  };

  const handleNavigatePage = (page: PageId) => {
    const routeMap: Record<PageId, string> = {
      home: '/',
      about: '/about',
      services: '/services',
      pricing: '/pricing',
      quote: '/quote',
      'colour-studio': '/colour-studio',
      partnership: '/partnership',
      contact: '/contact',
      projects: '/projects',
      work: '/projects',
      'how-we-work': '/services',
      journal: '/journal',
      blog: '/journal',
      shop: '/shop',
    };
    navigate(routeMap[page] || '/');
  };

  const handleApplyEstimateToContact = (data?: {
    spaceType: string;
    sqft: number;
    estimate: number;
    grade: string;
  }) => {
    if (data) {
      setCalculatorPrefill(data);
    }
    setIsCalculatorOpen(false);
    navigate('/contact');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 selection:bg-[#087973] selection:text-white ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Navigation Header */}
      <Navbar
        currentPage={getCurrentPageId()}
        setCurrentPage={handleNavigatePage}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Content Area Rendering Routes */}
      <main className="flex-1">
        <Routes>
          {/* Static Pages */}
          <Route
            path="/"
            element={
              <HomePage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
                onSelectProject={(project) => setSelectedProject(project)}
                onSelectPost={(post) => setSelectedPost(post)}
              />
            }
          />
          <Route
            path="/about"
            element={
              <AboutPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/services"
            element={
              <ProcessPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/how-we-work"
            element={
              <ProcessPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/pricing"
            element={
              <PricingPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/quote"
            element={
              <QuotePage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/colour-studio"
            element={
              <ColourStudioPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/partnership"
            element={
              <PartnershipPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <ContactPage
                initialPrefill={calculatorPrefill}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />

          {/* Dynamic Portfolio & Detail */}
          <Route
            path="/projects"
            element={
              <WorkPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
                onSelectProject={(project) => setSelectedProject(project)}
              />
            }
          />
          <Route
            path="/work"
            element={
              <WorkPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
                onSelectProject={(project) => setSelectedProject(project)}
              />
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <ProjectDetailPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />

          {/* Dynamic Shop & Product Detail */}
          <Route
            path="/shop"
            element={
              <ShopPage
                setCurrentPage={handleNavigatePage}
                onSelectProduct={(product: Product) => navigate(`/shop/${product.slug}`)}
              />
            }
          />
          <Route
            path="/shop/:slug"
            element={
              <ProductDetailPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />

          {/* Dynamic Journal & Article Detail */}
          <Route
            path="/journal"
            element={
              <BlogPage
                setCurrentPage={handleNavigatePage}
                onSelectPost={(post) => setSelectedPost(post)}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/blog"
            element={
              <BlogPage
                setCurrentPage={handleNavigatePage}
                onSelectPost={(post) => setSelectedPost(post)}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />
          <Route
            path="/journal/:slug"
            element={
              <JournalDetailPage
                setCurrentPage={handleNavigatePage}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="py-24 text-center space-y-4 max-w-xl mx-auto px-4">
                <SEO title="404 — Page Not Found" noindex={true} />
                <h1 className="text-4xl sm:text-6xl font-bold font-serif">404</h1>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  The requested architectural view or resource does not exist or has been relocated.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-xl bg-[#087973] hover:bg-[#06635e] text-white text-xs font-semibold cursor-pointer shadow transition-all"
                >
                  Return to Studio Home
                </button>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Minimalist Black/White & Teal Footer */}
      <Footer
        setCurrentPage={handleNavigatePage}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Interactive Modal: Interior Cost Calculator */}
      <CostCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onNavigateToContact={handleApplyEstimateToContact}
      />

      {/* Interactive Modal: High-Res Project Portfolio Gallery */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onBookSimilar={() => {
          setSelectedProject(null);
          navigate('/contact');
        }}
      />

      {/* Interactive Modal: Blog Post Reader */}
      <BlogModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* Floating Direct Communication Widget */}
      <WhatsAppWidget onOpenCalculator={() => setIsCalculatorOpen(true)} />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
