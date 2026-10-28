import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageId, BlogPost } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { BLOG_POSTS } from '../data/blogData';
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

interface JournalDetailPageProps {
  post?: BlogPost;
  setCurrentPage?: (page: PageId) => void;
  onOpenCalculator?: () => void;
}

export const JournalDetailPage: React.FC<JournalDetailPageProps> = ({
  post: propPost,
  setCurrentPage,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();

  const post =
    propPost ||
    BLOG_POSTS.find((p) => p.slug === slug || p.id === slug) ||
    BLOG_POSTS[0];

  if (!post) {
    return (
      <div className="py-20 text-center">
        <SEO title="Article Not Found | INERIM Journal" noindex={true} />
        <h2 className="text-2xl font-bold font-serif">Article Not Found</h2>
        <Link to="/journal" className="text-[#087973] hover:underline mt-4 inline-block">
          Return to Journal
        </Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.date,
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role,
        },
        publisher: {
          '@type': 'Organization',
          name: 'INERIM Interior',
          logo: {
            '@type': 'ImageObject',
            url: 'https://inerimbd.com/logo.jpg',
          },
        },
        mainEntityOfPage: `https://inerimbd.com/journal/${post.slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://inerimbd.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Journal',
            item: 'https://inerimbd.com/journal',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `https://inerimbd.com/journal/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article className="py-8 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Dynamic SEO Meta Tags */}
      <SEO
        title={`${post.title} — Architectural Journal Dhaka`}
        description={post.excerpt}
        canonicalUrl={`/journal/${post.slug}`}
        ogImage={post.coverImage}
        ogType="article"
        keywords={`${post.tags.join(', ')}, interior design tips Dhaka, architecture blog Bangladesh`}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-[#087973] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/journal" className="hover:text-[#087973] transition-colors">Journal</Link>
        <span>/</span>
        <span className="text-[#087973] font-semibold truncate max-w-xs">{post.title}</span>
      </nav>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-xs font-semibold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
          {post.excerpt}
        </p>

        {/* Author Byline */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover border border-[#087973]"
          />
          <div>
            <div className="text-sm font-bold">{post.author.name}</div>
            <div className="text-xs text-muted-foreground">{post.author.role}</div>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="space-y-6 text-sm sm:text-base leading-relaxed">
        {post.content.map((paragraph, idx) => (
          <p key={idx} className={isDark ? 'text-white/80' : 'text-black/80'}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Article Tags */}
      <div className="border-t border-white/10 pt-6 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[#087973]">Article Tags</div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs px-3 py-1 rounded-lg border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default JournalDetailPage;
