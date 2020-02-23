// pages/more/about.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  saveImage(e)
  {
    console.log("saveImage")
    wx.downloadFile({
      url:"https://7469-timerdev-5wjqv-1301150003.tcb.qcloud.la/IMG_1723.JPG?sign=ad4a1832cb6005acc23fabd5f6afdb45&t=1582468999",
      success:function(res){
        if (res.statusCode === 200)
        {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res){
              wx.showToast({
                title: 'Save success!',
              })
            },
            fail(res){
              wx.showToast({
                title: 'Fail to save!',
              })
            }
          })
        }
      }
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