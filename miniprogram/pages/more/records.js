// pages/more/records.js

const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    records: null,
    delBtnWidth: 160,
  },

  removeAll(e){
    wx.removeStorageSync("history")
    this.setData({
      records: null
    })
  },


  drawStart: function (e) {

    var index = e.currentTarget.dataset.index
    var touch = e.touches[0]

    for (var index in this.data.records) {
      var item = this.data.records[index]
      item.right = 0
    }
    this.setData({
      records: this.data.records,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {

    var index = e.currentTarget.dataset.index
    var touch = e.touches[0]
    var item = this.data.records[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        records: this.data.records
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        records: this.data.records
      })
    }
  },
  drawEnd: function (e) {

    var index = e.currentTarget.dataset.index
    var item = this.data.records[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        records: this.data.records,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        records: this.data.records,
      })
    }
  },

  delItem(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.records[index]
    console.log("delItem", index)

  // delete an element and update the storage
    this.data.records.splice(index, 1)
    this.data.records = this.data.records.length > 0 ? this.data.records : null
    this.setData({
      records: this.data.records
    })
    
    wx.setStorageSync("history", this.data.records)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var list = wx.getStorageSync("history")
    if (list == "") return

    list = list.map(item => {
      item.name = item.name == null ? "Unknown" : item.name
      // var str = name + "--" + item.time+"/"+item.total
      return item 
    })

    console.log("records->",list)

    this.setData({
      records: list
    })

    wx.getSystemInfo({
      success: res => {
        console.log("getSystemInfo", res)
        let statusBar = Number(res.statusBarHeight) - 20

        this.setData({
          windowHeight: Number(res.windowHeight)-80-statusBar*1.3
        })
      }
    })
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