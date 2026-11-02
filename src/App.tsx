import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ContentProvider } from './lib/cms';
import { StoreProvider } from './lib/store';
import { SiteLayout } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/Product';
import Quote from './pages/Quote';
import ColourStudio from './pages/ColourStudio';
import Partnership from './pages/Partnership';
import { ProjectDetail, ProjectsPage } from './pages/Projects';
import Services from './pages/Services';
import About from './pages/About';
import Pricing from './pages/Pricing';
import { JournalPage, PostPage } from './pages/Journal';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const Admin = lazy(() => import('./admin/Admin'));

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/projects/:slug', element: <ProjectDetail /> },
      { path: '/services', element: <Services /> },
      { path: '/shop', element: <Shop /> },
      { path: '/shop/:slug', element: <ProductPage /> },
      { path: '/quote', element: <Quote /> },
      { path: '/colour-studio', element: <ColourStudio /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/partnership', element: <Partnership /> },
      { path: '/journal', element: <JournalPage /> },
      { path: '/journal/:slug', element: <PostPage /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ),
  },
]);

export default function App() {
  return (
    <ContentProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </ContentProvider>
  );
}
