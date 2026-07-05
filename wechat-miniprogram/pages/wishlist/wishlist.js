// pages/wishlist/wishlist.js
const app = getApp();

Page({
  data: {
    wishlist: [],
    notes: {},
    editingId: null,
    tempNotes: {}
  },

  onShow: function () {
    this.refreshWishlist();
  },

  refreshWishlist: function () {
    const list = app.globalData.wishlist || [];
    const notes = app.globalData.wishlistNotes || {};

    // Map unique keys just to ensure stable loops
    const wishlistWithKeys = list.map((item, index) => {
      return {
        ...item,
        uniqueId: `${item.id}_${index}`
      };
    });

    this.setData({
      wishlist: wishlistWithKeys,
      notes: { ...notes }
    });
  },

  onPreventDefault: function () {
    // Utility for preventing nested navigation clicks
  },

  onToggleEditNote: function (e) {
    const id = e.currentTarget.dataset.id;
    if (this.data.editingId === id) {
      // Save current temp note if any
      const noteVal = this.data.notes[id] || '';
      app.saveWishlistNote(id, noteVal);
      this.setData({
        editingId: null
      });
      wx.showToast({
        title: '备忘已保存',
        icon: 'success',
        duration: 1000
      });
    } else {
      this.setData({
        editingId: id
      });
    }
  },

  onNoteInput: function (e) {
    const id = e.currentTarget.dataset.id;
    const value = e.detail.value;
    const notes = { ...this.data.notes };
    notes[id] = value;
    
    this.setData({
      notes: notes
    });
  },

  onRemoveItem: function (e) {
    const toy = e.currentTarget.dataset.toy;
    wx.showModal({
      title: '提示',
      content: `确定将「${toy.name}」移出心愿单吗？`,
      success: (res) => {
        if (res.confirm) {
          app.toggleWishlist(toy);
          this.refreshWishlist();
          wx.showToast({
            title: '已移出心愿单',
            icon: 'success',
            duration: 1000
          });
        }
      }
    });
  },

  onViewDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/toy-detail/toy-detail?id=${id}`
    });
  }
});
