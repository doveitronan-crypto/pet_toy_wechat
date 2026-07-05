import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Star, ShieldAlert, BookOpen, AlertCircle, ShoppingCart, Heart, HeartOff, Check, ExternalLink } from 'lucide-react';
import { Pet, Toy } from '../types';

interface BlindBoxSectionProps {
  activePet: Pet;
  onOpenBox: (category?: string) => Promise<Toy>;
  isMatched: boolean;
  activeCategory: string;
  isWishlisted: (toyId: string) => boolean;
  onToggleWishlist: (toy: Toy) => void;
}

export default function BlindBoxSection({
  activePet,
  onOpenBox,
  isMatched,
  activeCategory,
  isWishlisted,
  onToggleWishlist,
}: BlindBoxSectionProps) {
  const [openingState, setOpeningState] = useState<'idle' | 'opening' | 'success' | 'error'>('idle');
  const [openedToy, setOpenedToy] = useState<Toy | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyAndJump = (toy: Toy) => {
    const url = toy.purchaseUrl || `https://search.jd.com/Search?keyword=${encodeURIComponent(toy.name)}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });

    // Also attempt to open/jump to it in a new window/tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpen = async () => {
    setOpeningState('opening');
    try {
      // Delay slightly for full theatrical suspense of opening a blind box!
      const startTime = Date.now();
      const toy = await onOpenBox(isMatched ? activeCategory : undefined);
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 1500 - elapsed); // Ensure at least 1.5s of spin/excitement
      
      setTimeout(() => {
        setOpenedToy(toy);
        setOpeningState('success');
      }, delay);
    } catch (err) {
      console.error(err);
      setOpeningState('error');
    }
  };

  const categoryNameMap: Record<string, string> = {
    all: '综合智能',
    puzzle: '益智系列',
    chew: '耐咬系列',
    squeak: '声响玩具',
    active: '运动自嗨',
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'puzzle':
        return { bg: 'bg-brand-secondary-light', text: 'text-brand-secondary', label: '益智' };
      case 'chew':
        return { bg: 'bg-brand-primary-light', text: 'text-brand-primary', label: '耐咬' };
      case 'squeak':
        return { bg: 'bg-brand-tertiary-light', text: 'text-brand-tertiary', label: '声响' };
      default:
        return { bg: 'bg-blue-light', text: 'text-blue-accent', label: '运动' };
    }
  };

  return (
    <div className="bg-[#fff1ea] rounded-3xl border-2 border-dashed border-brand-primary/40 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Decorative background sparkles */}
      <div className="absolute top-4 left-4 text-brand-primary/20">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>
      <div className="absolute bottom-4 right-4 text-brand-primary/20">
        <Sparkles className="w-6 h-6 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <AnimatePresence mode="wait">
        {openingState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center w-full"
          >
            {/* The Mystery Box */}
            <motion.div
              id="mystery-box-graphic"
              whileHover={{ scale: 1.05, rotate: [0, -3, 3, -3, 0] }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 bg-[#95442b] rounded-2xl flex items-center justify-center shadow-xl cursor-pointer relative group mt-2 mb-6"
              onClick={handleOpen}
            >
              <Gift className="w-16 h-16 text-[#ffd1c4] group-hover:scale-110 transition-transform duration-300" />
              {/* Box Ribbons */}
              <div className="absolute top-0 bottom-0 w-3.5 bg-[#b45b40]" />
              <div className="absolute left-0 right-0 h-3.5 bg-[#b45b40]" />
              {/* Highlight Glow */}
              <div className="absolute inset-0 border-2 border-dashed border-[#ffdbd1]/30 rounded-2xl" />
            </motion.div>

            <h3 className="font-extrabold text-lg text-brand-text mb-1">今日情报盲盒</h3>
            <p className="text-xs text-brand-text-subtle max-w-xs mb-5">
              {isMatched 
                ? `根据 ${activePet.name} (${categoryNameMap[activeCategory] || '推荐'}) 开启专属惊喜`
                : '开启属于你毛孩子的今日专属情报惊喜'
              }
            </p>

            <button
              id="open-blind-box-btn"
              onClick={handleOpen}
              className="bg-brand-primary text-white font-bold text-sm px-8 py-3 rounded-xl transition-all duration-200 shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              开启盲盒
            </button>
          </motion.div>
        )}

        {openingState === 'opening' && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 flex flex-col items-center justify-center"
          >
            {/* Suspense Spinner Animation */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Glowing orbits */}
              <div className="absolute inset-0 border-4 border-t-brand-primary border-r-transparent border-b-brand-primary/20 border-l-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }} />
              <div className="absolute inset-2 border-4 border-t-transparent border-r-brand-secondary border-b-transparent border-l-brand-secondary/20 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
              <Gift className="w-10 h-10 text-brand-primary animate-bounce" />
            </div>
            <h4 className="font-bold text-sm text-brand-text mt-6 animate-pulse">
              {isMatched 
                ? `🤖 正在分析 ${activePet.name} 的数据，定制惊喜玩具...`
                : '🤖 正在随机检索万智数据库，寻觅神秘惊喜玩具...'
              }
            </h4>
            <span className="text-[10px] text-brand-text-subtle mt-1.5 font-mono">
              Intelligence Engine Routing...
            </span>
          </motion.div>
        )}

        {openingState === 'success' && openedToy && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full text-left bg-white rounded-2xl border border-brand-border p-5 relative"
          >
            <div className="flex flex-col md:flex-row gap-5">
              {/* Product Image */}
              <div className="w-full md:w-1/3 h-44 rounded-xl overflow-hidden border border-brand-border relative bg-brand-bg shrink-0">
                <img
                  src={openedToy.imageUrl}
                  alt={openedToy.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-bold text-base text-brand-text leading-tight">{openedToy.name}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center text-amber-500 gap-0.5 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold font-mono">{openedToy.rating}</span>
                      </div>
                      {isMatched && (
                        <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-primary/20 shrink-0">
                          匹配度 {openedToy.suitabilityScore || 95}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getCategoryTheme(openedToy.category).bg} ${getCategoryTheme(openedToy.category).text} border border-current/10`}>
                      {openedToy.categoryLabel}
                    </span>
                    {openedToy.tags.map((tag, idx) => (
                      <span key={idx} className="bg-brand-bg text-brand-text-subtle text-[10px] font-semibold px-2 py-0.5 rounded-md border border-brand-border/40">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-brand-text-subtle font-medium mt-3 leading-relaxed">
                    {openedToy.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Matching Explanation */}
            {openedToy.matchReason && (
              <div className="mt-4 bg-brand-primary-light/40 border border-brand-primary/15 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-brand-primary font-bold text-xs mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>{isMatched ? `针对 ${activePet.name} 的智能匹配解析：` : '全网畅销爆款指数推荐理由：'}</span>
                </div>
                <p className="text-xs text-brand-text font-medium leading-relaxed">
                  {openedToy.matchReason}
                </p>
              </div>
            )}

            {/* Expander Grid for Guide and Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
              <div className="bg-[#fbfcfa] border border-brand-border rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-brand-secondary font-bold text-xs mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>推荐玩法指引</span>
                </div>
                <p className="text-xs text-brand-text-subtle font-medium whitespace-pre-line leading-relaxed">
                  {openedToy.playGuide}
                </p>
              </div>

              <div className="bg-[#fdfbfc] border border-brand-border rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs mb-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>玩乐安全警示</span>
                </div>
                <p className="text-xs text-brand-text-subtle font-medium leading-relaxed">
                  {openedToy.safetyWarning}
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-5 flex items-center justify-between gap-3 flex-wrap border-t border-brand-border pt-4">
              <button
                onClick={() => onToggleWishlist(openedToy)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  isWishlisted(openedToy.id)
                    ? 'border-brand-primary text-brand-primary bg-brand-primary-light/20'
                    : 'border-brand-border text-brand-text hover:bg-brand-bg'
                }`}
              >
                {isWishlisted(openedToy.id) ? (
                  <>
                    <Heart className="w-3.5 h-3.5 fill-current text-brand-primary" />
                    已加入心愿单
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5" />
                    加入心愿单
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyAndJump(openedToy)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/15'
                  }`}
                  title={copied ? "链接已复制！" : "复制链接并打开电商平台搜索"}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已复制链接</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>一键跳转</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setOpeningState('idle')}
                  className="bg-brand-bg hover:bg-brand-border/40 text-brand-text font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
                >
                  重新开启
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {openingState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 flex flex-col items-center justify-center"
          >
            <AlertCircle className="w-12 h-12 text-brand-primary" />
            <h4 className="font-bold text-sm text-brand-text mt-4">玩具推荐引擎开小差了...</h4>
            <p className="text-xs text-brand-text-subtle mt-1">请检查网络或稍后重新试一下吧 🐾</p>
            <button
              onClick={() => setOpeningState('idle')}
              className="mt-5 bg-brand-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-primary/90"
            >
              返回重试
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
