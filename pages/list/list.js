const fetch = require('../../utils/fetch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {},
    shops: [],
    pageSize: 0,
    limit: 20,
    hasMore: true
  },
  loadMore() {
    if (!this.data.hasMore) return
    let {
      pageSize,
      limit
    } = this.data
    let params = {
      '_page': ++pageSize,
      '_limit': limit
    }
    return fetch(`categories/${this.data.category.id}/shops`, params)
      .then(res => {
        const totalCount = parseInt(res.header['X-Total-Count'])
        const hasMore = pageSize * limit < totalCount
        const shops = this.data.shops.concat(res.data)
        this.setData({
          shops,
          hasMore,
          pageSize
        })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    fetch(`categories/${options.cat}`).then(res => {
      this.setData({
        category: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.name
      })
      //加载完分类信息过去再去加载商铺信息
      this.loadMore()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 分类信息标题 =>双保险 
    if (this.data.category.name) {
      wx.setNavigationBarTitle({
        title: this.data.category.name
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log('下拉动作')
    this.setData({
      shops: [],
      pageSize: 0,
      hasMore: true
    })
    this.loadMore().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('拉到底了!!')
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})