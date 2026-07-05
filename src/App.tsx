import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Heart, User, Dog, MessageSquare, ListCollapse, Star, ShoppingCart, Check } from 'lucide-react';
import { Pet, Toy, BlindBoxHistory, ChatMessage } from './types';
import { CURATED_TOYS } from './data/toys';

// Components
import BottomNav from './components/BottomNav';
import PetCard from './components/PetCard';
import BlindBoxSection from './components/BlindBoxSection';
import ToyList from './components/ToyList';
import WishlistTab from './components/WishlistTab';
import MineTab from './components/MineTab';

const INITIAL_PETS: Pet[] = [
  {
    id: 'pet_1',
    name: '可乐',
    type: 'dog',
    breed: '边境牧羊犬',
    age: 4,
    energyLevel: 'high',
    chewStrength: 'normal',
    avatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200', // French bulldog cute face resembling image
  },
  {
    id: 'pet_2',
    name: '咪咪',
    type: 'cat',
    breed: '布偶猫',
    age: 2,
    energyLevel: 'medium',
    chewStrength: 'gentle',
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'wishlist' | 'mine'>('discover');
  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem('pet_intelligence_pets');
    return saved ? JSON.parse(saved) : INITIAL_PETS;
  });
  const [activePet, setActivePet] = useState<Pet>(() => {
    const saved = localStorage.getItem('pet_intelligence_active_pet');
    return saved ? JSON.parse(saved) : INITIAL_PETS[0];
  });
  const [isMatched, setIsMatched] = useState(() => {
    const saved = localStorage.getItem('pet_intelligence_is_matched');
    return saved ? JSON.parse(saved) === 'true' : true;
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedDetail, setCopiedDetail] = useState(false);

  const handleCopyAndJumpDetail = (toy: Toy) => {
    const url = toy.purchaseUrl || `https://search.jd.com/Search?keyword=${encodeURIComponent(toy.name)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedDetail(true);
      setTimeout(() => setCopiedDetail(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Wishlist and historical logs persistence
  const [wishlist, setWishlist] = useState<Toy[]>(() => {
    const saved = localStorage.getItem('pet_intelligence_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [blindBoxHistory, setBlindBoxHistory] = useState<BlindBoxHistory[]>(() => {
    const saved = localStorage.getItem('pet_intelligence_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Chat counselor log
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('pet_intelligence_chat');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'msg_initial',
        sender: 'assistant',
        text: `🐾 您好！我是您的专属 AI 玩乐健康顾问。 

我已经为您的爱宠量身加载了“玩具情报匹配雷达”！
您可以向我提问关于宠物的任何玩耍习惯、解闷方法或纠正拆家行为的方法。 

快试试问我：“如何引导边牧学会玩漏食球？” 吧！ ✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('pet_intelligence_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('pet_intelligence_active_pet', JSON.stringify(activePet));
    // Regenerate counselor message on active pet change
    setChatHistory((prev) => {
      const filtered = prev.filter((m) => m.id !== 'msg_initial_pet');
      const petMsg: ChatMessage = {
        id: 'msg_initial_pet',
        sender: 'assistant',
        text: `🐾 顾问雷达更新：当前正在为您匹配适合“${activePet.name}”的玩具情报！

${activePet.name}是一只${activePet.age}岁的${activePet.breed}，精力${activePet.energyLevel === 'high' ? '高' : activePet.energyLevel === 'medium' ? '中' : '低'}，破坏力${activePet.chewStrength === 'aggressive' ? '高' : activePet.chewStrength === 'normal' ? '中' : '低'}。已就绪，随时解答它的玩耍难题。 ✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      return [petMsg, ...filtered];
    });
  }, [activePet]);

  useEffect(() => {
    localStorage.setItem('pet_intelligence_is_matched', isMatched ? 'true' : 'false');
  }, [isMatched]);

  useEffect(() => {
    localStorage.setItem('pet_intelligence_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('pet_intelligence_history', JSON.stringify(blindBoxHistory));
  }, [blindBoxHistory]);

  useEffect(() => {
    localStorage.setItem('pet_intelligence_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Wishlist controls
  const isWishlisted = (toyId: string) => wishlist.some((t) => t.id === toyId);

  const handleToggleWishlist = (toy: Toy) => {
    setWishlist((prev) => {
      const exists = prev.some((t) => t.id === toy.id);
      if (exists) {
        return prev.filter((t) => t.id !== toy.id);
      } else {
        return [...prev, toy];
      }
    });
  };

  const handleRemoveFromWishlist = (toy: Toy) => {
    setWishlist((prev) => prev.filter((t) => t.id !== toy.id));
  };

  // Switch Active Pet
  const handleSetActivePet = (pet: Pet) => {
    setActivePet(pet);
  };

  // Delete custom pet profile
  const handleDeletePet = (petId: string) => {
    if (pets.length <= 1) return;
    const remaining = pets.filter((p) => p.id !== petId);
    setPets(remaining);
    
    // Ensure that matching is enabled (forced to true) so there is always a pet in matching status after a delete
    setIsMatched(true);

    if (activePet.id === petId) {
      setActivePet(remaining[0]);
    }
  };

  // Add custom pet profile
  const handleAddPet = (newPet: Omit<Pet, 'id'>) => {
    const petWithId: Pet = {
      ...newPet,
      id: `pet_${Date.now()}`,
    };
    setPets((prev) => [...prev, petWithId]);
    setActivePet(petWithId);
  };

  // Delete individual history record
  const handleDeleteHistoryItem = (historyId: string) => {
    setBlindBoxHistory((prev) => prev.filter((item) => item.id !== historyId));
  };

  // Clear all history records
  const handleClearHistory = () => {
    setBlindBoxHistory([]);
  };

  // Handle Blind Box Opening Trigger via Backend API
  const handleOpenBlindBox = async (category?: string): Promise<Toy> => {
    try {
      const response = await fetch('/api/gemini/blindbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet: activePet,
          category,
          isMatched,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const generatedToy: Toy = data.toy;

      // Add to opened logs history
      const logEntry: BlindBoxHistory = {
        id: `history_${Date.now()}`,
        petId: activePet.id,
        petName: activePet.name,
        openedAt: new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        toy: generatedToy,
      };

      setBlindBoxHistory((prev) => [logEntry, ...prev]);

      return generatedToy;
    } catch (err) {
      console.error('Failed to open blind box via api:', err);
      throw err;
    }
  };

  // Handle general behavioral specialist chat messages
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const recentMessages = [...chatHistory, userMsg].slice(-8); // send last 8 messages for context
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages,
          pet: activePet,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned error');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get chat advice:', err);
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        sender: 'assistant',
        text: '🐾 顾问大脑暂时有些卡顿，可以尝试重新发送一下哦！如果您还没有在【设置->Secrets】配置 GEMINI_API_KEY，系统也会自动返回备用知识。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Simple ask utility used inside Toy List Detail consultant drawer
  const handleAskGeminiDetail = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ sender: 'user', text: prompt }],
          pet: activePet,
        }),
      });
      if (!response.ok) throw new Error('API Fail');
      const data = await response.json();
      return data.reply;
    } catch (err) {
      console.error(err);
      return '🐾 玩具匹配雷达暂时受到磁场干扰，建议您稍后再试哦。';
    }
  };

  // Support direct opening of toy details from anywhere
  const [detailToyInModal, setDetailToyInModal] = useState<Toy | null>(null);

  const handleViewToyDetail = (toy: Toy) => {
    setDetailToyInModal(toy);
  };

  return (
    <div className="min-h-screen bg-[#F3EFEA] flex justify-center items-start py-0 md:py-8 px-0 sm:px-4 font-sans select-none antialiased">
      {/* Container simulating high fidelity iPhone shell/desktop preview box */}
      <div className="w-full max-w-md bg-[#F9F7F4] min-h-screen md:min-h-[850px] shadow-2xl md:rounded-[40px] border border-brand-border/60 relative pb-26 flex flex-col overflow-hidden">
        
        {/* Top Header Section */}
        <header className="px-5 pt-6 pb-4 bg-white/85 backdrop-blur-md border-b border-brand-border flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/15 shadow-sm">
              <span className="text-sm">🐾</span>
            </div>
            <h1 className="font-extrabold text-lg text-brand-text tracking-tight font-sans">
              玩具情报站
            </h1>
          </div>
          <span className="bg-brand-primary-light text-brand-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            智能雷达开启中
          </span>
        </header>

        {/* Content Scrolling Area */}
        <main className="flex-1 overflow-y-auto px-4.5 py-4 flex flex-col gap-4 no-scrollbar">
          
          <AnimatePresence mode="wait">
            {activeTab === 'discover' && (
              <motion.div
                key="discover"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Fortune alert box */}
                <div className="bg-brand-tertiary-light/60 rounded-2xl border border-brand-tertiary/15 p-3.5 flex items-center gap-2 text-brand-tertiary font-bold text-xs">
                  <Sparkles className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                  <span className="leading-none mt-0.5">今日宜：开盲盒 · 忌：闲置</span>
                </div>

                {/* Match Pet Card Selection */}
                <PetCard
                  activePet={activePet}
                  isMatched={isMatched}
                  onToggleMatch={setIsMatched}
                  onManagePets={() => setActiveTab('mine')}
                />

                {/* Dotted Box:今日情报盲盒 */}
                <BlindBoxSection
                  activePet={activePet}
                  onOpenBox={handleOpenBlindBox}
                  isMatched={isMatched}
                  activeCategory={selectedCategory}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={handleToggleWishlist}
                />


              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <WishlistTab
                  wishlist={wishlist}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  onViewToyDetail={handleViewToyDetail}
                />
              </motion.div>
            )}

            {activeTab === 'mine' && (
              <motion.div
                key="mine"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <MineTab
                  userEmail="doveitRonan@gmail.com"
                  pets={pets}
                  activePet={activePet}
                  onSetActivePet={handleSetActivePet}
                  onAddPet={handleAddPet}
                  onDeletePet={handleDeletePet}
                  blindBoxHistory={blindBoxHistory}
                  onViewHistoryToy={handleViewToyDetail}
                  chatHistory={chatHistory}
                  onSendChatMessage={handleSendChatMessage}
                  isChatLoading={isChatLoading}
                  isMatched={isMatched}
                  onToggleMatch={setIsMatched}
                  onDeleteHistoryItem={handleDeleteHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Global Detail Modal (for wishlist & history re-access) */}
        {detailToyInModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-brand-border w-full max-w-md shadow-2xl relative flex flex-col">
              <div className="p-4 border-b border-brand-border flex items-center justify-between bg-white rounded-t-3xl">
                <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {detailToyInModal.categoryLabel}
                </span>
                <button
                  onClick={() => setDetailToyInModal(null)}
                  className="bg-brand-bg hover:bg-brand-border/40 text-brand-text font-bold text-xs px-3 py-1.5 rounded-lg"
                >
                  关闭
                </button>
              </div>

              <div className="p-5 text-left flex flex-col gap-4">
                <div className="h-44 rounded-2xl overflow-hidden border border-brand-border">
                  <img src={detailToyInModal.imageUrl} alt={detailToyInModal.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-brand-text">{detailToyInModal.name}</h4>
                    <div className="flex items-center text-amber-500 gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold font-mono">{detailToyInModal.rating}</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {detailToyInModal.tags.map((t, idx) => (
                      <span key={idx} className="bg-brand-bg text-brand-text-subtle text-[10px] font-bold px-2 py-0.5 rounded border border-brand-border">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-brand-text-subtle font-medium leading-relaxed mt-3">
                    {detailToyInModal.description}
                  </p>
                </div>

                <div className="bg-brand-secondary-light/20 border border-brand-secondary/15 rounded-xl p-3.5">
                  <div className="font-bold text-xs text-brand-secondary mb-1">推荐游玩指导</div>
                  <p className="text-xs text-brand-text-subtle font-medium whitespace-pre-line leading-relaxed">
                    {detailToyInModal.playGuide}
                  </p>
                </div>

                <div className="bg-brand-primary-light/20 border border-brand-primary/15 rounded-xl p-3.5">
                  <div className="font-bold text-xs text-brand-primary mb-1">安全警告</div>
                  <p className="text-xs text-brand-text-subtle font-medium leading-relaxed">
                    {detailToyInModal.safetyWarning}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-brand-border flex gap-3">
                <button
                  onClick={() => {
                    handleToggleWishlist(detailToyInModal);
                  }}
                  className={`flex-1 font-bold text-xs py-3 rounded-xl transition-all border ${
                    isWishlisted(detailToyInModal.id)
                      ? 'border-brand-primary text-brand-primary bg-brand-primary-light/10'
                      : 'border-brand-border text-brand-text hover:bg-brand-bg'
                  }`}
                >
                  {isWishlisted(detailToyInModal.id) ? '💔 移出心愿单' : '❤️ 加入心愿单'}
                </button>
                <button
                  onClick={() => handleCopyAndJumpDetail(detailToyInModal)}
                  className={`flex-1 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    copiedDetail
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-primary text-white hover:bg-brand-primary/95 shadow-brand-primary/10'
                  }`}
                >
                  {copiedDetail ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已复制并跳转</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>一键跳转</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Nav Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          wishlistCount={wishlist.length}
        />
      </div>
    </div>
  );
}
