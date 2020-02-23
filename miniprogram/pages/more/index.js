// pages/more/index.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  about(e)
  {
    console.log("tap about")
  },

  howTo(e)
  {
    console.log("tap How to")
    wx.navigateTo({
      url: 'howto',
    })
  },

  historyList(e) {
    console.log("tap History")
    wx.navigateTo({
      url: 'records',
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})