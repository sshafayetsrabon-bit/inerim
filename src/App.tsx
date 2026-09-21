import React, { useState, useEffect } from 'react';
import { PageId, Project, BlogPost } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CostCalculatorModal } from './components/CostCalculatorModal';
import { ProjectModal } from './components/ProjectModal';
import { BlogModal } from './components/BlogModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { WorkPage } from './pages/WorkPage';
import { ProcessPage } from './pages/ProcessPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
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

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
    setCurrentPage('contact');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 selection:bg-[#087973] selection:text-white ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Navigation Header with Inerim logo & links */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Content Area rendering the requested page */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={setCurrentPage}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onSelectProject={(project) => setSelectedProject(project)}
            onSelectPost={(post) => setSelectedPost(post)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            setCurrentPage={setCurrentPage}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}

        {currentPage === 'work' && (
          <WorkPage
            setCurrentPage={setCurrentPage}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onSelectProject={(project) => setSelectedProject(project)}
          />
        )}

        {currentPage === 'how-we-work' && (
          <ProcessPage
            setCurrentPage={setCurrentPage}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            initialPrefill={calculatorPrefill}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage
            setCurrentPage={setCurrentPage}
            onSelectPost={(post) => setSelectedPost(post)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}
      </main>

      {/* Minimalist Black/White & Teal Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
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
          setCurrentPage('contact');
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
