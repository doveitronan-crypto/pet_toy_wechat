import React, { useState } from 'react';
import { HeartOff, Star, ShoppingBag, Eye, Trash2, Edit2, Check } from 'lucide-react';
import { Toy } from '../types';

interface WishlistTabProps {
  wishlist: Toy[];
  onRemoveFromWishlist: (toy: Toy) => void;
  onViewToyDetail: (toy: Toy) => void;
}

export default function WishlistTab({ wishlist, onRemoveFromWishlist, onViewToyDetail }: WishlistTabProps) {
  // Store custom notes for each wishlist item in local state
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const handleStartEditNote = (toyId: string, currentNote: string) => {
    setEditingNoteId(toyId);
    setNoteInput(currentNote || '');
  };

  const handleSaveNote = (toyId: string) => {
    setNotes((prev) => ({ ...prev, [toyId]: noteInput }));
    setEditingNoteId(null);
  };

  return (
    <div className="flex flex-col gap-5 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-brand-text">我的心愿清单</h3>
        <span className="text-xs font-bold text-brand-text-subtle font-mono bg-brand-border/40 px-2.5 py-1 rounded-lg">
          共 {wishlist.length} 款宝贝
        </span>
      </div>

      {wishlist.length > 0 ? (
        <div className="flex flex-col gap-4">
          {wishlist.map((toy, index) => {
            const currentNote = notes[toy.id] || '';
            const isEditing = editingNoteId === toy.id;

            return (
              <div
                key={`${toy.id}_${index}`}
                className="bg-white rounded-2xl border border-brand-border p-4.5 flex flex-col sm:flex-row gap-4.5 hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Image Section */}
                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden border border-brand-border shrink-0 bg-brand-bg">
                  <img
                    src={toy.imageUrl}
                    alt={toy.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1.5 flex-wrap">
                      <div>
                        <h4 className="font-extrabold text-sm text-brand-text leading-snug">{toy.name}</h4>
                        <span className="inline-block bg-brand-bg text-brand-text-subtle text-[9px] font-bold px-2 py-0.5 rounded border border-brand-border/40 mt-1">
                          {toy.categoryLabel}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500 gap-0.5 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold font-mono">{toy.rating}</span>
                      </div>
                    </div>

                    {/* Personal Wishlist Note Customization */}
                    <div className="mt-2.5 bg-brand-bg/60 border border-brand-border/50 rounded-xl p-2 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="写点备忘，如：‘买给可乐做生日礼物’"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            className="flex-1 bg-white border border-brand-border rounded px-2 py-1 text-[11px] text-brand-text focus:outline-none focus:border-brand-primary font-medium"
                          />
                          <button
                            onClick={() => handleSaveNote(toy.id)}
                            className="p-1 bg-brand-secondary text-white rounded hover:bg-brand-secondary/90 transition-all cursor-pointer"
                            aria-label="Save note"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-brand-text-subtle font-medium italic line-clamp-1">
                            {currentNote ? `📝 ${currentNote}` : '添加心愿备注 (备忘、购买计划等)'}
                          </span>
                          <button
                            onClick={() => handleStartEditNote(toy.id, currentNote)}
                            className="text-brand-primary hover:text-brand-primary/80 transition-all cursor-pointer p-0.5"
                            aria-label="Edit note"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between gap-3 border-t border-brand-border/40 pt-3.5 mt-3.5 flex-wrap">
                    <button
                      onClick={() => onViewToyDetail(toy)}
                      className="text-xs font-bold text-brand-text hover:text-brand-primary flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      查看方案
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveFromWishlist(toy)}
                        className="text-brand-text-subtle hover:text-brand-primary hover:bg-brand-primary-light/20 p-2 rounded-lg border border-brand-border/60 transition-all cursor-pointer"
                        title="移出心愿单"
                        id={`wishlist-remove-${toy.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`🛒 已经为您跳转至 “${toy.name}” 的全网比价购买页面！(演示链接)`)}
                        className="bg-brand-primary text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-brand-primary/95 transition-all shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        去购买
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-brand-border">
          <HeartOff className="w-12 h-12 text-brand-border" />
          <h4 className="font-extrabold text-sm text-brand-text mt-4">心愿单空空如也</h4>
          <p className="text-xs text-brand-text-subtle mt-1 px-6">
            在情报站里挑选心仪的宠物玩具并点击爱心，这里将为您聚合管理所有种草方案！
          </p>
        </div>
      )}
    </div>
  );
}
