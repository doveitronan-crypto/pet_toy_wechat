// pages/toys/toys.js
const app = getApp();

Page({
  data: {
    searchQuery: '',
    selectedCategory: 'all',
    categories: [
      { id: 'all', name: '全部' },
      { id: 'puzzle', name: '益智' },
      { id: 'active', name: '耐咬' },
      { id: 'squeak', name: '声响' }
    ],
    filteredToys: []
  },

  onShow: function () {
    this.filterToys();
  },

  onSearchInput: function (e) {
    this.setData({
      searchQuery: e.detail.value
    }, () => {
      this.filterToys();
    });
  },

  onClearSearch: function () {
    this.setData({
      searchQuery: ''
    }, () => {
      this.filterToys();
    });
  },

  onSelectCategory: function (e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      selectedCategory: categoryId
    }, () => {
      this.filterToys();
    });
  },

  onToggleWishlist: function (e) {
    const toy = e.currentTarget.dataset.toy;
    const isNowFav = app.toggleWishlist(toy);
    
    this.filterToys();

    wx.showToast({
      title: isNowFav ? '已添加至心愿单' : '已移出心愿单',
      icon: 'success',
      duration: 1500
    });
  },

  onViewDetail: function (e) {
    const toyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/toy-detail/toy-detail?id=${toyId}`
    });
  },

  filterToys: function () {
    const toys = app.globalData.toys;
    const wishlist = app.globalData.wishlist;
    const query = this.data.searchQuery.trim().toLowerCase();
    const category = this.data.selectedCategory;

    // Map wishlist checking
    let results = toys.map(toy => {
      const isFav = wishlist.some(fav => fav.id === toy.id);
      return { ...toy, isFav };
    });

    // Filter by Category
    if (category !== 'all') {
      results = results.filter(toy => toy.category === category);
    }

    // Filter by Search Query
    if (query) {
      results = results.filter(toy => {
        const matchesName = toy.name.toLowerCase().includes(query);
        const matchesDesc = toy.description.toLowerCase().includes(query);
        const matchesTags = toy.tags.some(tag => tag.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTags;
      });
    }

    this.setData({
      filteredToys: results
    });
  }
});
