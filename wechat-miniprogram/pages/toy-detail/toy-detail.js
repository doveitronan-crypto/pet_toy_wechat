// pages/toy-detail/toy-detail.js
const app = getApp();

Page({
  data: {
    toy: null,
    isFav: false
  },

  onLoad: function (options) {
    const id = options.id;
    const toys = app.globalData.toys || [];
    const foundToy = toys.find(t => t.id === id);

    if (foundToy) {
      this.setData({
        toy: foundToy
      });
    } else {
      wx.showToast({
        title: '未找到该玩具信息',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    }
  },

  onShow: function () {
    this.checkFavStatus();
  },

  checkFavStatus: function () {
    if (!this.data.toy) return;
    const wishlist = app.globalData.wishlist || [];
    const isFav = wishlist.some(item => item.id === this.data.toy.id);
    this.setData({
      isFav: isFav
    });
  },

  onToggleWishlist: function () {
    if (!this.data.toy) return;
    const isNowFav = app.toggleWishlist(this.data.toy);
    this.setData({
      isFav: isNowFav
    });
    wx.showToast({
      title: isNowFav ? '已添加至心愿单' : '已移出心愿单',
      icon: 'success',
      duration: 1500
    });
  },

  onCopyLink: function () {
    if (!this.data.toy) return;
    const toy = this.data.toy;
    const url = toy.purchaseUrl || `https://search.jd.com/Search?keyword=${encodeURIComponent(toy.name)}`;
    
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showModal({
          title: '复制成功',
          content: '商品搜索链接已复制到剪贴板！您可前往浏览器或商场App进行搜索和购买 🐾',
          showCancel: false,
          confirmText: '好的'
        });
      }
    });
  },

  onBack: function () {
    wx.navigateBack();
  }
});
