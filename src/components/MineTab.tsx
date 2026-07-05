import React, { useState } from 'react';
import {
  User,
  Plus,
  Dog,
  Cat,
  ChevronRight,
  Sparkles,
  History,
  MessageSquare,
  Send,
  Trash2,
  BookmarkCheck,
  Check,
  Award,
} from 'lucide-react';
import { Pet, BlindBoxHistory, ChatMessage, Toy } from '../types';

interface MineTabProps {
  userEmail: string;
  pets: Pet[];
  activePet: Pet;
  onSetActivePet: (pet: Pet) => void;
  onAddPet: (pet: Omit<Pet, 'id'>) => void;
  onDeletePet: (petId: string) => void;
  blindBoxHistory: BlindBoxHistory[];
  onViewHistoryToy: (toy: Toy) => void;
  chatHistory: ChatMessage[];
  onSendChatMessage: (text: string) => void;
  isChatLoading: boolean;
  isMatched: boolean;
  onToggleMatch: (matched: boolean) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
}

export default function MineTab({
  userEmail,
  pets,
  activePet,
  onSetActivePet,
  onAddPet,
  onDeletePet,
  blindBoxHistory,
  onViewHistoryToy,
  chatHistory,
  onSendChatMessage,
  isChatLoading,
  isMatched,
  onToggleMatch,
  onDeleteHistoryItem,
  onClearHistory,
}: MineTabProps) {
  // Modal states
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [hoveredBtnId, setHoveredBtnId] = useState<string | null>(null);

  // Form states for adding pet
  const [newPetType, setNewPetType] = useState<'dog' | 'cat'>('dog');
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState<number>(3);
  const [newPetEnergy, setNewPetEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [newPetChew, setNewPetChew] = useState<'gentle' | 'normal' | 'aggressive'>('normal');

  const handleSubmitPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim() || !newPetBreed.trim()) return;

    // Pick avatar based on type & breed
    let avatarUrl = '';
    if (newPetType === 'dog') {
      avatarUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200';
    } else {
      avatarUrl = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200';
    }

    onAddPet({
      name: newPetName,
      type: newPetType,
      breed: newPetBreed,
      age: newPetAge,
      energyLevel: newPetEnergy,
      chewStrength: newPetChew,
      avatarUrl,
    });

    // Reset Form
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge(3);
    setNewPetEnergy('medium');
    setNewPetChew('normal');
    setShowAddPetModal(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    onSendChatMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="flex flex-col gap-6 text-left pb-10">
      {/* User Information Card */}
      <div className="bg-white rounded-2xl border border-brand-border p-4.5 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary-light/10 rounded-bl-full pointer-events-none" />
        <div className="w-13 h-13 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shrink-0">
          <User className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-brand-text">尊贵的玩具情报官</h3>
          <p className="text-xs text-brand-text-subtle font-mono font-medium mt-0.5">{userEmail}</p>
        </div>
      </div>

      {/* Pet Profiles Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-brand-text">我的萌宠档案</h4>
          <button
            id="add-pet-modal-trigger"
            onClick={() => setShowAddPetModal(true)}
            className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            新增萌宠档案
          </button>
        </div>

        {/* Pet list */}
        <div className="flex flex-col gap-2.5">
          {pets.map((pet) => {
            const isActive = activePet.id === pet.id;
            const isHovered = hoveredBtnId === pet.id;
            const isThisPetMatching = isActive && isMatched;

            let btnText = '';
            let btnStyle = '';
            let btnOnClick = () => {};

            if (isActive) {
              if (isMatched) {
                btnText = isHovered ? '取消匹配' : '正在匹配';
                btnStyle = isHovered
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-brand-primary text-white border border-transparent';
                btnOnClick = () => onToggleMatch(false);
              } else {
                btnText = '开启匹配';
                btnStyle = 'bg-brand-bg text-brand-text-subtle hover:bg-brand-primary hover:text-white hover:border-transparent border border-brand-border/60';
                btnOnClick = () => onToggleMatch(true);
              }
            } else {
              btnText = '开启匹配';
              btnStyle = 'bg-brand-bg text-brand-text-subtle hover:bg-brand-primary hover:text-white hover:border-transparent border border-brand-border/60';
              btnOnClick = () => {
                onSetActivePet(pet);
                onToggleMatch(true);
              };
            }

            return (
              <div
                key={pet.id}
                className={`bg-white rounded-xl border p-3.5 flex items-center justify-between transition-all ${
                  isActive && isMatched
                    ? 'border-brand-primary bg-brand-primary-light/5 shadow-sm'
                    : isActive
                      ? 'border-brand-primary/40 bg-brand-bg/20'
                      : 'border-brand-border/80 hover:border-brand-primary/20'
                }`}
              >
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSetActivePet(pet)}>
                  <div className="relative">
                    {pet.avatarUrl ? (
                      <img
                        src={pet.avatarUrl}
                        alt={pet.name}
                        className="w-11 h-11 rounded-full object-cover border border-brand-border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-brand-bg flex items-center justify-center border border-brand-border">
                        {pet.type === 'dog' ? <Dog className="w-5 h-5 text-brand-primary" /> : <Cat className="w-5 h-5 text-brand-primary" />}
                      </div>
                    )}
                    {isActive && isMatched && (
                      <div className="absolute -top-1 -right-1 bg-brand-primary text-white p-0.5 rounded-full shadow-sm">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-brand-text">{pet.name}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        pet.type === 'dog' ? 'bg-amber-100 text-amber-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {pet.type === 'dog' ? '汪星人' : '喵星人'}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-text-subtle font-medium mt-0.5">
                      {pet.breed} · {pet.age}岁 · {pet.chewStrength === 'aggressive' ? '暴躁撕咬' : pet.chewStrength === 'normal' ? '常规撕咬' : '温柔摩挲'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pets.length > 1 && (
                    <button
                      onClick={() => onDeletePet(pet.id)}
                      className="p-1.5 rounded-lg text-brand-text-subtle hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer"
                      title="删除档案"
                      id={`delete-pet-btn-${pet.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={btnOnClick}
                    onMouseEnter={() => setHoveredBtnId(pet.id)}
                    onMouseLeave={() => setHoveredBtnId(null)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${btnStyle}`}
                  >
                    {btnText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blind Box Opening History Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-brand-text flex items-center gap-1.5">
            <History className="w-4 h-4 text-brand-primary" />
            <span>盲盒开启历史</span>
          </h4>
          {blindBoxHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[11px] font-bold text-brand-text-subtle hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1 border border-brand-border/40 hover:border-red-100"
            >
              <Trash2 className="w-3 h-3" />
              清空全部
            </button>
          )}
        </div>

        {blindBoxHistory.length > 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
            <div className="divide-y divide-brand-border/60">
              {blindBoxHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onViewHistoryToy(item.toy)}
                  className="p-3.5 flex items-center justify-between hover:bg-brand-bg/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.toy.imageUrl}
                      alt={item.toy.name}
                      className="w-10 h-10 rounded-lg object-cover border border-brand-border/60 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <h5 className="font-bold text-xs text-brand-text leading-snug line-clamp-1">{item.toy.name}</h5>
                      <p className="text-[10px] text-brand-text-subtle font-medium mt-0.5">
                        配对宠物: {item.petName} · {item.toy.categoryLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] text-brand-text-subtle font-mono">{item.openedAt}</span>
                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-1.5 rounded-lg text-brand-text-subtle hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer"
                      title="删除单条"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onViewHistoryToy(item.toy)}
                      className="p-1.5 text-brand-text-subtle/60 hover:text-brand-primary transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 bg-white border border-brand-border rounded-2xl text-center flex flex-col items-center justify-center">
            <span className="text-xl">🎁</span>
            <p className="text-xs text-brand-text-subtle mt-1.5">您还没有开启过情报盲盒</p>
          </div>
        )}
      </div>

      {/* Main Gemini Behavioral Advisor Chatbot Room - Temporarily commented out */}
      {/* 
      <div className="bg-white rounded-2xl border border-brand-border p-4.5 flex flex-col h-[400px]">
        <div className="border-b border-brand-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            <div>
              <h4 className="font-extrabold text-sm text-brand-text flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                AI 萌宠行为&玩乐专家
              </h4>
              <p className="text-[10px] text-brand-text-subtle font-medium">随时帮您纠正拆家行为，规划专属玩乐方案</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-brand-primary bg-brand-primary-light/30 px-2 py-0.5 rounded">
            Gemini 3.5 Pro
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3.5 no-scrollbar scroll-smooth">
          {chatHistory.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div key={msg.id} className={`flex gap-2.5 max-w-[85%] ${isAI ? 'self-start text-left' : 'self-end flex-row-reverse text-right'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isAI ? 'bg-brand-primary-light text-brand-primary border border-brand-primary/20' : 'bg-brand-primary text-white'
                }`}>
                  {isAI ? '🤖' : <User className="w-4 h-4" />}
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className={`px-3.5 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
                    isAI
                      ? 'bg-brand-bg border border-brand-border text-brand-text rounded-tl-sm'
                      : 'bg-brand-primary text-white rounded-tr-sm'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-brand-text-subtle/65 font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isChatLoading && (
            <div className="flex gap-2.5 max-w-[80%] self-start text-left">
              <div className="w-8 h-8 rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center shrink-0">
                🤖
              </div>
              <div className="bg-brand-bg border border-brand-border px-3.5 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleChatSubmit} className="border-t border-brand-border pt-3.5 flex gap-2">
          <input
            id="advisor-chat-input"
            type="text"
            placeholder={`问专家: “边牧拆家撕纸怎么办？” 或 “金毛买什么玩具好？”`}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isChatLoading}
            className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text placeholder-brand-text-subtle/70 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all font-medium"
          />
          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/95 text-white p-2.5 rounded-xl disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center"
            disabled={isChatLoading || !chatInput.trim()}
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
      */}

      {/* ADD PET MODAL (SLIDING UP BOTTOM SHEET) */}
      {showAddPetModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-brand-border w-full max-w-md shadow-2xl p-6 relative text-left">
            <h3 className="font-extrabold text-base text-brand-text flex items-center gap-1.5 mb-5 border-b border-brand-border pb-3.5">
              <Award className="w-5 h-5 text-brand-primary" />
              新增萌宠档案
            </h3>

            <form onSubmit={handleSubmitPet} className="flex flex-col gap-4">
              {/* Pet Type Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-text">宠物类型</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPetType('dog')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      newPetType === 'dog'
                        ? 'border-brand-primary bg-brand-primary-light/20 text-brand-primary'
                        : 'border-brand-border text-brand-text-subtle hover:bg-brand-bg'
                    }`}
                  >
                    <Dog className="w-4.5 h-4.5" />
                    汪星人
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPetType('cat')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      newPetType === 'cat'
                        ? 'border-brand-primary bg-brand-primary-light/20 text-brand-primary'
                        : 'border-brand-border text-brand-text-subtle hover:bg-brand-bg'
                    }`}
                  >
                    <Cat className="w-4.5 h-4.5" />
                    喵星人
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-text">宠物姓名</label>
                <input
                  type="text"
                  required
                  placeholder="例如：可乐、咪咪"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              {/* Breed */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-text">宠物品种</label>
                <input
                  type="text"
                  required
                  placeholder="例如：边境牧羊犬、布偶猫"
                  value={newPetBreed}
                  onChange={(e) => setNewPetBreed(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-primary font-medium"
                />
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-brand-text">年龄</span>
                  <span className="text-brand-primary font-mono">{newPetAge} 岁</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={newPetAge}
                  onChange={(e) => setNewPetAge(Number(e.target.value))}
                  className="w-full accent-brand-primary bg-brand-border h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Energy & Chewiness Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-text">运动量</label>
                  <select
                    value={newPetEnergy}
                    onChange={(e) => setNewPetEnergy(e.target.value as any)}
                    className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-primary font-medium"
                  >
                    <option value="low">低运动量 (安静/少动)</option>
                    <option value="medium">中运动量 (活跃适中)</option>
                    <option value="high">高运动量 (极度亢奋)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-text">撕咬破坏力</label>
                  <select
                    value={newPetChew}
                    onChange={(e) => setNewPetChew(e.target.value as any)}
                    className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-primary font-medium"
                  >
                    <option value="gentle">温柔磨合 (不撕咬)</option>
                    <option value="normal">正常磨牙 (中等力量)</option>
                    <option value="aggressive">撕咬狂魔 (咬穿万物)</option>
                  </select>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex gap-3 border-t border-brand-border pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPetModal(false)}
                  className="flex-1 bg-brand-bg hover:bg-brand-border/40 text-brand-text-subtle font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-brand-primary/10 transition-all cursor-pointer"
                >
                  生成档案
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
