import React, { useState } from 'react';
import { Search, Star, Heart, Sparkles, BookOpen, ShieldAlert, ArrowRight, X, MessageSquare, Send } from 'lucide-react';
import { Pet, Toy } from '../types';

interface ToyListProps {
  toys: Toy[];
  activePet: Pet;
  isMatched: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  isWishlisted: (toyId: string) => boolean;
  onToggleWishlist: (toy: Toy) => void;
  onAskGemini: (prompt: string) => Promise<string>;
}

export default function ToyList({
  toys,
  activePet,
  isMatched,
  selectedCategory,
  onSelectCategory,
  isWishlisted,
  onToggleWishlist,
  onAskGemini,
}: ToyListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  
  // Toy Detail Consultant Chat state
  const [consultationText, setConsultationText] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultationReply, setConsultationReply] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'puzzle', label: '益智系列' },
    { id: 'chew', label: '耐咬系列' },
    { id: 'squeak', label: '声响玩具' },
    { id: 'active', label: '运动自嗨' },
  ];

  // Filtering based on search query and category
  const filteredToys = toys.filter((toy) => {
    const matchesCategory = selectedCategory === 'all' || toy.category === selectedCategory;
    const matchesSearch =
      toy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toy.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      toy.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate dynamic breed match details for display on directory cards
  const getBreedMatchBadge = (toy: Toy) => {
    if (!isMatched) return null;
    
    // Logic to personalize based on active pet
    const isDog = activePet.type === 'dog';
    if (isDog) {
      if (activePet.chewStrength === 'aggressive' && toy.category === 'chew') {
        return `💪 强抗咬 · 适合${activePet.breed}`;
      }
      if (activePet.energyLevel === 'high' && toy.category === 'active') {
        return `⚡️ 高爆发 · 适合${activePet.breed}`;
      }
      if (toy.category === 'puzzle') {
        return `🎓 智商契合 · ${activePet.breed}`;
      }
      return `🐾 专属配对 · 适合${activePet.breed}`;
    } else {
      // Cat matching
      if (toy.category === 'puzzle' || toy.category === 'squeak') {
        return `🐈 捕猎本能 · ${activePet.breed}`;
      }
      return `✨ 温暖自嗨 · 适合${activePet.breed}`;
    }
  };

  const handleOpenDetail = (toy: Toy) => {
    setSelectedToy(toy);
    setConsultationReply(null);
    setConsultationText('');
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationText.trim() || !selectedToy) return;

    setIsConsulting(true);
    setConsultationReply(null);

    const prompt = `主人的宠物是：${activePet.name}（品种: ${activePet.breed}，年龄: ${activePet.age}岁，运动量: ${activePet.energyLevel}，破坏力: ${activePet.chewStrength}）。
关于玩具《${selectedToy.name}》（产品描述: ${selectedToy.description}），主人提出了以下疑问：
“${consultationText}”
请给出一份针对该玩具和宠物的专属专家指导。说明这款玩具是否适合、应该如何陪伴游戏，或是否有其他注意事项。字数控制在150字左右，温暖专业。`;

    try {
      const reply = await onAskGemini(prompt);
      setConsultationReply(reply);
    } catch (err) {
      console.error(err);
      setConsultationReply('🐾 宠物分析雷达暂时连接超时，请重试一遍哦。');
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-left">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-text-subtle" />
        <input
          id="toy-search-input"
          type="text"
          placeholder="搜索好玩的玩具、特色材质、玩乐功效..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-brand-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-brand-text placeholder-brand-text-subtle/70 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
        />
      </div>

      {/* Filter Chips Container */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 -mx-4 px-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-primary-light text-brand-primary border-brand-primary-light shadow-sm shadow-brand-primary/10'
                  : 'bg-white text-brand-text-subtle border-brand-border hover:bg-brand-bg hover:border-brand-text-subtle/30'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Toy List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredToys.length > 0 ? (
          filteredToys.map((toy) => {
            const hasMatchBadge = getBreedMatchBadge(toy);
            const saved = isWishlisted(toy.id);

            return (
              <div
                key={toy.id}
                className="bg-white rounded-2xl border border-brand-border p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 group"
              >
                <div>
                  {/* Photo Container */}
                  <div
                    onClick={() => handleOpenDetail(toy)}
                    className="w-full h-36 rounded-xl overflow-hidden bg-brand-bg relative cursor-pointer border border-brand-border/40"
                  >
                    <img
                      src={toy.imageUrl}
                      alt={toy.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Quick Category Tag */}
                    <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-brand-text text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-sm border border-brand-border/20">
                      {toy.categoryLabel}
                    </span>

                    {/* Match Badge for Pet */}
                    {hasMatchBadge && (
                      <div className="absolute top-2.5 left-2.5 bg-brand-primary text-white text-[9px] font-extrabold px-2 py-1 rounded-md shadow-sm">
                        {hasMatchBadge}
                      </div>
                    )}
                  </div>

                  {/* Header Info */}
                  <div className="flex items-start justify-between gap-1.5 mt-3.5">
                    <h4
                      onClick={() => handleOpenDetail(toy)}
                      className="font-bold text-sm text-brand-text hover:text-brand-primary cursor-pointer line-clamp-1 flex-1 leading-snug"
                    >
                      {toy.name}
                    </h4>
                    <div className="flex items-center text-amber-500 gap-0.5 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] font-bold font-mono">{toy.rating}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {toy.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-brand-bg text-brand-text-subtle text-[9px] font-semibold px-2 py-0.5 rounded border border-brand-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Short description */}
                  <p className="text-xs text-brand-text-subtle line-clamp-2 mt-2.5 leading-relaxed font-medium">
                    {toy.description}
                  </p>
                </div>

                {/* Footer and wishlist action */}
                <div className="flex items-center justify-between border-t border-brand-border/40 mt-4 pt-3.5">
                  <button
                    onClick={() => handleOpenDetail(toy)}
                    className="text-brand-primary hover:text-brand-primary/80 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    查看玩乐情报
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`wishlist-toggle-${toy.id}`}
                    onClick={() => onToggleWishlist(toy)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      saved
                        ? 'border-brand-primary/30 text-brand-primary bg-brand-primary-light/30'
                        : 'border-brand-border text-brand-text-subtle hover:text-brand-primary hover:bg-brand-primary-light/15'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <span className="text-3xl">🐾</span>
            <h4 className="font-bold text-sm text-brand-text mt-3">没有搜索到符合条件的情报</h4>
            <p className="text-xs text-brand-text-subtle mt-1">换个词试试吧，或者挑选其他分类情报</p>
          </div>
        )}
      </div>

      {/* Toy Detail Modal with Gemini Interactive Chat */}
      {selectedToy && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-brand-border w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Header Sticky */}
            <div className="p-5 border-b border-brand-border flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div className="flex items-center gap-2">
                <span className="bg-brand-primary-light text-brand-primary text-xs font-bold px-2.5 py-1 rounded-md">
                  {selectedToy.categoryLabel}
                </span>
                <div className="flex items-center text-amber-500 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold font-mono">{selectedToy.rating}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedToy(null)}
                className="p-1.5 rounded-full border border-brand-border hover:bg-brand-bg transition-all"
              >
                <X className="w-4.5 h-4.5 text-brand-text-subtle" />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 text-left">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-2/5 h-44 rounded-2xl overflow-hidden border border-brand-border">
                  <img
                    src={selectedToy.imageUrl}
                    alt={selectedToy.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-brand-text">{selectedToy.name}</h3>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {selectedToy.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-brand-bg text-brand-text-subtle text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-brand-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-brand-text font-medium leading-relaxed mt-4">
                      {selectedToy.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Matching Badge details inside modal */}
              {isMatched && (
                <div className="bg-brand-primary-light/40 border border-brand-primary/15 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-brand-primary font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>为什么适合“{activePet.name}”的特性？</span>
                  </div>
                  <p className="text-xs text-brand-text font-medium leading-relaxed">
                    {activePet.name}作为一尾{activePet.breed}，正处于{activePet.age}岁。
                    {selectedToy.category === 'puzzle' && '益智解密挑战完美配对它的高智商神经，有效消除多余无聊感。'}
                    {selectedToy.category === 'chew' && '抗压橡胶骨坚固抗毁，极好地满足了日常激烈的磨咬撕咬需要。'}
                    {selectedToy.category === 'active' && '户外高速飞跃捕接能彻底压榨它惊人的体能活力。'}
                    {selectedToy.category === 'squeak' && '内置BB哨音模拟极高追捕反射，极易唤起猫狗猎奇兴奋度。'}
                    我们会根据爱宠的特质提供多位一体的情报匹配支持。
                  </p>
                </div>
              )}

              {/* Grid guide & Safety */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                <div className="bg-brand-secondary-light/20 border border-brand-secondary/15 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-brand-secondary font-bold text-xs mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>玩法引导课</span>
                  </div>
                  <p className="text-xs text-brand-text-subtle font-medium whitespace-pre-line leading-relaxed">
                    {selectedToy.playGuide}
                  </p>
                </div>

                <div className="bg-brand-primary-light/20 border border-brand-primary/15 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-brand-primary font-bold text-xs mb-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>安全警戒线</span>
                  </div>
                  <p className="text-xs text-brand-text-subtle font-medium leading-relaxed">
                    {selectedToy.safetyWarning}
                  </p>
                </div>
              </div>

              {/* Gemini Interactive Consultant Drawer */}
              <div className="border-t border-brand-border pt-5 mt-2">
                <div className="flex items-center gap-2 text-brand-text font-bold text-sm mb-3.5">
                  <MessageSquare className="w-4.5 h-4.5 text-brand-primary" />
                  <span>💬 咨询AI玩具顾问 (针对“{activePet.name}”)</span>
                </div>

                <form onSubmit={handleConsult} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`例如: “我家${activePet.name}牙齿在磨牙期，咬这个会坏吗？”`}
                    value={consultationText}
                    onChange={(e) => setConsultationText(e.target.value)}
                    className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-primary"
                    disabled={isConsulting}
                  />
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary/95 text-white p-2.5 rounded-xl disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center shrink-0"
                    disabled={isConsulting || !consultationText.trim()}
                  >
                    {isConsulting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4.5 h-4.5" />
                    )}
                  </button>
                </form>

                {/* Reply display */}
                {consultationReply && (
                  <div className="mt-3.5 bg-brand-bg border border-brand-border rounded-xl p-3.5 flex gap-2">
                    <span className="text-base shrink-0">🤖</span>
                    <p className="text-xs text-brand-text font-medium leading-relaxed">
                      {consultationReply}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="p-4 border-t border-brand-border sticky bottom-0 bg-white rounded-b-3xl flex items-center justify-between gap-3">
              <button
                onClick={() => onToggleWishlist(selectedToy)}
                className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-xl border transition-all ${
                  isWishlisted(selectedToy.id)
                    ? 'border-brand-primary text-brand-primary bg-brand-primary-light/30'
                    : 'border-brand-border text-brand-text hover:bg-brand-bg'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted(selectedToy.id) ? 'fill-current text-brand-primary' : ''}`} />
                {isWishlisted(selectedToy.id) ? '已收藏在心愿单' : '收藏到心愿单'}
              </button>
              <button
                onClick={() => setSelectedToy(null)}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-brand-primary/10 transition-all text-center"
              >
                返回情报站
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
