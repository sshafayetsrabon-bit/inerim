import React from 'react';
import { BlogPost } from '../types';
import { X, Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  const { isDark } = useTheme();

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="blog-detail-modal"
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden my-6 transition-colors ${
          isDark ? 'bg-black text-white border-white/15' : 'bg-white text-black border-black/15'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-blog-modal-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-colors cursor-pointer border border-white/20"
          aria-label="Close article modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Article Cover Image */}
        <div className="relative w-full h-56 sm:h-72 bg-black overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="absolute bottom-3.5 left-5 right-5 z-10 text-white">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#087973] text-white shadow-sm inline-block mb-1.5">
              {post.category}
            </span>
            <h2 className="text-lg sm:text-2xl font-bold font-serif leading-tight">
              {post.title}
            </h2>
          </div>
        </div>

        {/* Article Meta Bar */}
        <div className={`px-5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2.5 border-b ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
        }`}>
          <div className="flex items-center gap-2.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-7 h-7 rounded-full object-cover border border-[#087973]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-semibold text-xs">{post.author.name}</div>
              <div className={`text-[10px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>{post.author.role}</div>
            </div>
          </div>

          <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#087973]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#087973]" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          <div className={`border-l-2 border-[#087973] p-3 rounded-r-lg ${
            isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'
          }`}>
            <p className={`text-xs sm:text-sm font-medium italic leading-relaxed ${isDark ? 'text-white/90' : 'text-black/90'}`}>
              "{post.excerpt}"
            </p>
          </div>

          <div className={`space-y-3 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/75' : 'text-black/75'}`}>
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              <Tag className="w-3 h-3 text-[#087973]" /> Related Topics
            </span>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag, idx) => (
                <span key={idx} className={`px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                  isDark ? 'bg-white/5 border-white/10 text-white/70' : 'bg-black/5 border-black/10 text-black/70'
                }`}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-3 sm:px-6 sm:py-3 border-t flex items-center justify-between ${
          isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.01] border-black/10'
        }`}>
          <button
            onClick={onClose}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isDark ? 'border-white/15 hover:bg-white/5 text-white' : 'border-black/15 hover:bg-black/5 text-black'
            }`}
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Articles
          </button>

          <span className={`text-[11px] italic ${isDark ? 'text-white/50' : 'text-black/50'}`}>
            Inerim Architectural Journal
          </span>
        </div>
      </div>
    </div>
  );
};
