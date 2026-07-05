// pages/index/index.js
const app = getApp();

Page({
  data: {
    isMatched: true,
    activePet: null,
    categories: [
      { id: 'all', name: '不限' },
      { id: 'puzzle', name: '益智系列' },
      { id: 'active', name: '耐咬系列' },
      { id: 'squeak', name: '声响玩具' }
    ],
    selectedCategory: 'all',
    isOpened: false,
    isOpening: false,
    openedToy: null,
    isInWishlist: false,
    recommendationText: ''
  },

  onShow: function () {
    this.refreshState();
  },

  refreshState: function () {
    const activePet = app.globalData.activePet;
    const isMatched = app.globalData.isMatched;
    const wishlist = app.globalData.wishlist;

    this.setData({
      activePet: activePet,
      isMatched: isMatched
    });

    if (this.data.isOpened && this.data.openedToy) {
      const exists = wishlist.some(toy => toy.id === this.data.openedToy.id);
      this.setData({
        isInWishlist: exists
      });
    }
  },

  onToggleMatch: function (e) {
    const matched = e.detail.value;
    app.setIsMatched(matched);
    this.setData({
      isMatched: matched
    });
    
    // If a box is already opened, dynamically recalculate recommendations/visibility based on new matched setting
    if (this.data.isOpened && this.data.openedToy) {
      this.calculateRecommendation(this.data.openedToy, matched);
    }
  },

  onSelectCategory: function (e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      selectedCategory: categoryId
    });
  },

  onOpenBlindBox: function () {
    if (this.data.isOpening) return;

    this.setData({
      isOpening: true
    });

    // Shaking Animation simulation
    setTimeout(() => {
      this.revealToy();
    }, 1200);
  },

  revealToy: function () {
    const toys = app.globalData.toys;
    const isMatched = this.data.isMatched;
    const activePet = this.data.activePet;
    const category = this.data.selectedCategory;

    // 1. Filter toys by selected category (if not 'all')
    let pool = toys;
    if (category !== 'all') {
      pool = toys.filter(toy => toy.category === category);
    }

    if (pool.length === 0) {
      pool = toys; // Fallback
    }

    // 2. Select toy
    let selectedToy;
    if (isMatched && activePet) {
      // Prioritize pet preference
      // Dogs like active, chew
      // Cats like puzzle, squeak
      const preferredCategory = activePet.type === 'dog' ? ['active', 'chew'] : ['puzzle', 'squeak'];
      let matchedPool = pool.filter(toy => preferredCategory.includes(toy.category));
      if (matchedPool.length === 0) {
        matchedPool = pool;
      }
      // Pick random
      const randIdx = Math.floor(Math.random() * matchedPool.length);
      selectedToy = { ...matchedPool[randIdx] };
      // Assign dynamic suitability score
      selectedToy.suitabilityScore = Math.floor(Math.random() * 10) + 90; // 90-99%
    } else {
      // Purely random
      const randIdx = Math.floor(Math.random() * pool.length);
      selectedToy = { ...pool[randIdx] };
      selectedToy.suitabilityScore = null; // No match percentage as requested
    }

    // 3. Save to history
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const historyItem = {
      id: 'hist_' + Date.now(),
      toy: selectedToy,
      petName: isMatched ? activePet.name : '自选（随机）',
      openedAt: formattedDate
    };
    app.addHistory(historyItem);

    // 4. Update view
    const wishlist = app.globalData.wishlist;
    const isInWishlist = wishlist.some(toy => toy.id === selectedToy.id);

    this.setData({
      isOpening: false,
      isOpened: true,
      openedToy: selectedToy,
      isInWishlist: isInWishlist
    });

    this.calculateRecommendation(selectedToy, isMatched);
  },

  calculateRecommendation: function (toy, isMatched) {
    const activePet = this.data.activePet;
    let recText = '';

    if (isMatched && activePet) {
      if (activePet.type === 'dog') {
        recText = `由于开启了专属宠物“${activePet.name}”的档案，我们为您量身匹配了这款「${toy.name}」。这只${activePet.age}的${activePet.breed}性格活泼，属于${activePet.energy}。此玩具特有的物理属性（如耐咬或高弹），不仅能够有效保护家居免受破坏，还能激发它的捕捉天性，进行全方位的体能消耗，提供长久而安全的智力自嗨和游乐。`;
      } else {
        recText = `由于开启了专属宠物“${activePet.name}”的档案，我们为您量身匹配了这款「${toy.name}」。这只${activePet.age}的${activePet.breed}性格内敛敏感，对小范围的高敏捷追逐极具兴趣。此玩具内置的多维感官互动（如声音、转盘或气味引导），能够极大唤醒猫咪天生的狩猎血统，缓解独自居家的无聊，提供充实的精神安抚。`;
      }
    } else {
      recText = `由于您当前未开启专属宠物档案（处于随机开盒状态），我们为您从宠物优选库中随机抽选了这款「${toy.name}」。该产品采用了环保耐咬材质、内置高精发声或益智趣味结构，不仅符合业界顶尖安全规范，也是目前备受猫狗铲屎官极力推崇、风靡全网的必备萌宠自嗨神器。推荐放入心愿单并在专业指导下开启试玩。`;
    }

    this.setData({
      recommendationText: recText
    });
  },

  onToggleWishlist: function () {
    if (!this.data.openedToy) return;
    const isNowIn = app.toggleWishlist(this.data.openedToy);
    this.setData({
      isInWishlist: isNowIn
    });
    wx.showToast({
      title: isNowIn ? '已添加至心愿单' : '已移出心愿单',
      icon: 'success',
      duration: 1500
    });
  },

  onViewGuide: function () {
    if (!this.data.openedToy) return;
    wx.navigateTo({
      url: `/pages/toy-detail/toy-detail?id=${this.data.openedToy.id}`
    });
  },

  onCopyPurchaseLink: function () {
    if (!this.data.openedToy) return;
    const toy = this.data.openedToy;
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

  onResetBox: function () {
    this.setData({
      isOpened: false,
      openedToy: null,
      isOpening: false,
      isInWishlist: false,
      recommendationText: ''
    });
  }
});
