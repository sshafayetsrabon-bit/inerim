import React, { useState, useMemo } from 'react';
import { PageId, BlogPost } from '../types';
import { useTheme } from '../context/ThemeContext';
import { BLOG_POSTS } from '../data/blogData';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface BlogPageProps {
  setCurrentPage: (page: PageId) => void;
  onSelectPost: (post: BlogPost) => void;
  onOpenCalculator: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  setCurrentPage,
  onSelectPost,
  onOpenCalculator
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const categories = ['All', 'Design Trends', 'Commercial Insights', 'Case Studies', 'Space Planning', 'Materials'];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12">
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-[11px] font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Inerim Research & Architectural Journal
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
            Design Insights & Studio Updates
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            In-depth perspectives on interior architecture, spatial acoustics, material science, and turnkey project delivery from our senior partners.
          </p>
        </div>

        {/* 2. Filter & Search Controls */}
        <div className={`mt-8 p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
        }`}>
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#087973] text-white shadow-sm'
                    : isDark
                      ? 'bg-white/5 text-white/70 hover:bg-white/10'
                      : 'bg-black/5 text-black/70 hover:bg-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
            <input
              type="text"
              placeholder="Search articles, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-black border-white/15 text-white placeholder-white/40 focus:border-[#087973]'
                  : 'bg-white border-black/15 text-black placeholder-black/40 focus:border-[#087973]'
              }`}
            />
          </div>
        </div>
      </section>

      {/* 3. Featured Post (if no active search) */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onClick={() => onSelectPost(featuredPost)}
            className={`group rounded-2xl overflow-hidden border transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 ${
              isDark
                ? 'bg-black border-white/10 hover:border-[#087973]'
                : 'bg-white border-black/10 hover:border-[#087973] shadow-sm'
            }`}
          >
            <div className="lg:col-span-7 h-64 sm:h-80 relative overflow-hidden bg-black">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute top-3.5 left-3.5 bg-[#087973] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                Featured Cover Story
              </span>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold font-serif group-hover:text-[#087973] transition-colors leading-snug">
                  {featuredPost.title}
                </h2>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}>
                <div className="flex items-center gap-2">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#087973]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold">{featuredPost.author.name}</div>
                    <div className={`text-[10px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>{featuredPost.author.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#087973] group-hover:translate-x-0.5 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold font-serif">
            {selectedCategory === 'All' ? 'Recent Publications' : `${selectedCategory} Articles`}
          </h3>
          <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>{filteredPosts.length} article(s)</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className={`rounded-xl border p-10 text-center max-w-md mx-auto space-y-3 ${
            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10'
          }`}>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>No articles match "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-3.5 py-1.5 rounded-lg bg-[#087973] text-white text-xs font-medium cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className={`rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col group ${
                  isDark
                    ? 'bg-black border-white/10 hover:border-[#087973]'
                    : 'bg-white border-black/10 hover:border-[#087973] hover:shadow-sm'
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-[#087973] text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-white/10">
                    {post.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className={`flex items-center gap-2 text-[10px] mb-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold font-serif group-hover:text-[#087973] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div className={`pt-2.5 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-white/10' : 'border-black/10'
                  }`}>
                    <span className={`text-[11px] ${isDark ? 'text-white/70' : 'text-black/70'}`}>{post.author.name}</span>
                    <span className="font-medium text-[#087973] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. Newsletter Sign-Up Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-6 sm:p-10 border text-center space-y-3 ${
          isDark ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-black'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#087973]">
            Curated Monthly Digest
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            Subscribe To The Inerim Architectural Journal
          </h3>
          <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Get exclusive case studies on luxury residential woodwork, 3D visualization breakdowns, and materials guides delivered to your inbox.
          </p>

          {subscribed ? (
            <div className="p-3 bg-[#087973]/15 border border-[#087973]/30 rounded-lg text-xs font-semibold text-[#087973] max-w-sm mx-auto">
              ✓ Thank you! You are now subscribed to the Inerim Journal.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-1">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 px-3.5 py-2 text-xs rounded-lg border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-black border-white/15 text-white placeholder-white/40 focus:border-[#087973]'
                    : 'bg-white border-black/15 text-black placeholder-black/40 focus:border-[#087973]'
                }`}
                required
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
