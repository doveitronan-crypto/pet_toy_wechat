// pages/mine/mine.js
const app = getApp();

Page({
  data: {
    pets: [],
    activePet: null,
    isMatched: true,
    historyList: [],
    showAddPetModal: false,
    
    // Form fields
    newType: 'dog',
    newName: '',
    newBreed: '',
    newAge: '',
    newEnergy: '高运动量'
  },

  onShow: function () {
    this.refreshState();
  },

  refreshState: function () {
    this.setData({
      pets: app.globalData.pets,
      activePet: app.globalData.activePet,
      isMatched: app.globalData.isMatched,
      historyList: app.globalData.blindBoxHistory || []
    });
  },

  onPreventDefault: function () {
    // Prevent outer clicks
  },

  onSelectPet: function (e) {
    const pet = e.currentTarget.dataset.pet;
    if (this.data.activePet.id !== pet.id) {
      app.setActivePet(pet);
      app.setIsMatched(true); // Switch implies enabling match
      this.refreshState();
      wx.showToast({
        title: `已切换至 ${pet.name}`,
        icon: 'success',
        duration: 1000
      });
    }
  },

  onToggleMatchAction: function (e) {
    const pet = e.currentTarget.dataset.pet;
    const isActive = this.data.activePet.id === pet.id;

    if (isActive) {
      // Toggle current match state
      const nextMatchState = !this.data.isMatched;
      app.setIsMatched(nextMatchState);
      this.setData({
        isMatched: nextMatchState
      });
      wx.showToast({
        title: nextMatchState ? '匹配已开启' : '匹配已关闭',
        icon: 'success',
        duration: 1000
      });
    } else {
      // Set active, and force match = true
      app.setActivePet(pet);
      app.setIsMatched(true);
      this.refreshState();
      wx.showToast({
        title: `${pet.name} 匹配开启`,
        icon: 'success',
        duration: 1000
      });
    }
  },

  onDeletePet: function (e) {
    const id = e.currentTarget.dataset.id;
    const petToDelete = this.data.pets.find(p => p.id === id);

    if (this.data.pets.length <= 1) {
      wx.showToast({
        title: '至少保留一个宠物档案',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '删除档案',
      content: `确定要删除「${petToDelete.name}」的专属档案吗？`,
      success: (res) => {
        if (res.confirm) {
          app.deletePet(id);
          this.refreshState();
          wx.showToast({
            title: '档案已删除',
            icon: 'success',
            duration: 1000
          });
        }
      }
    });
  },

  // Modal Actions
  onShowAddPetModal: function () {
    this.setData({
      showAddPetModal: true,
      newName: '',
      newBreed: '',
      newAge: '',
      newType: 'dog',
      newEnergy: '高运动量'
    });
  },

  onHideAddPetModal: function () {
    this.setData({
      showAddPetModal: false
    });
  },

  // Form Binding
  onNewTypeChange: function (e) {
    this.setData({
      newType: e.detail.value
    });
  },

  onNewNameInput: function (e) {
    this.setData({
      newName: e.detail.value
    });
  },

  onNewBreedInput: function (e) {
    this.setData({
      newBreed: e.detail.value
    });
  },

  onNewAgeInput: function (e) {
    this.setData({
      newAge: e.detail.value
    });
  },

  onNewEnergyChange: function (e) {
    this.setData({
      newEnergy: e.detail.value
    });
  },

  onSaveNewPet: function () {
    const { newName, newBreed, newAge, newType, newEnergy } = this.data;

    if (!newName.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    const defaultAvatars = {
      dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
      cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200'
    };

    const newPet = {
      id: 'pet_' + Date.now(),
      name: newName.trim(),
      type: newType,
      breed: newBreed.trim() || (newType === 'dog' ? '中华田园犬' : '中华田园猫'),
      age: newAge.trim() || '1岁',
      energy: newEnergy,
      avatarUrl: defaultAvatars[newType]
    };

    app.addPet(newPet);
    
    // Automatically set the newly created pet as active and force matched to true
    app.setActivePet(newPet);
    app.setIsMatched(true);

    this.refreshState();
    this.onHideAddPetModal();

    wx.showToast({
      title: '档案保存成功',
      icon: 'success',
      duration: 1500
    });
  },

  // History Actions
  onDeleteHistoryItem: function (e) {
    const id = e.currentTarget.dataset.id;
    app.deleteHistoryItem(id);
    this.refreshState();
    wx.showToast({
      title: '记录已删除',
      icon: 'success',
      duration: 1000
    });
  },

  onClearAllHistory: function () {
    wx.showModal({
      title: '清空历史',
      content: '确定要清空全部盲盒开启记录吗？此操作不可撤销。',
      success: (res) => {
        if (res.confirm) {
          app.clearHistory();
          this.refreshState();
          wx.showToast({
            title: '历史已清空',
            icon: 'success',
            duration: 1000
          });
        }
      }
    });
  },

  onViewHistoryDetail: function (e) {
    const toyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/toy-detail/toy-detail?id=${toyId}`
    });
  }
});
