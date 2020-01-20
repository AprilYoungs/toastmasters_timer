//index.js
const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    openId: null,
    delBtnWidth: 160,
    isScroll: true,
    times: null,
    page: 0,
    pageSize: 10,
    noMoreData: false,

    windowHeight: null,
  },

  loadData() {

    console.log("loadData")
    wx.showLoading({
      title: 'loading data',
    })

    this.data.page = 0
    this.data.noMoreData = false
    const db = wx.cloud.database()
    db.collection('times')
      .limit(this.data.pageSize)
      .where({_openid: this.data.openId})
      .get({
        success: res => {
          wx.hideLoading()
          const noMoreData = res.data.length < this.data.pageSize

          var times = res.data.map(item=>{
            item["timeStr"] = `${(item.time-item.time%60)/60}:${item.time%60}`
            return item
          })

          console.log("collection data", res.data)
          var add = { "timeStr": "+", "time":"+", "_id": "001", "_openid": app.globalData.openId}
          times = times.concat([add])

          this.setData({
            times: times,
            noMoreData: noMoreData,
          })

          wx.stopPullDownRefresh()
          console.log("did get time arrow->", this.data.times)
        },

        fail: err => {
          wx.hideLoading()
          wx.showToast({
            title: 'error' + err,
          })
        }
      })
  },

  loadMore() {
    if (this.data.noMoreData) { return }

    console.log("loadmore")

    this.data.page++;


    var start = this.data.page * this.data.pageSize
    const db = wx.cloud.database()

    db.collection('times')
      .orderBy('time', 'desc')
      .skip(start)
      .limit(this.data.pageSize)
      .get({
        success: res => {

          let noMoreData = res.data.length < this.data.pageSize

          var times = res.data.map(item => {
            item["timeStr"] = `${(item.time - item.time % 60) / 60}:${item.time % 60}`
            return item
          })

          var add = { "timeStr": "+", "time": "+", "_id": "001", "_openid": app.globalData.openId }
          times = times.concat([add])

          times = this.data.times.concat(times)

          // append data

          this.setData({
            times: times,
            noMoreData: noMoreData,
          })

          wx.hideLoading()
          console.log("did get time arrow->", this.data.times)
        }
      })
  },
  
  // 开始计时
  startCountDown: function(e) {
   
    var touch = e.touches[0]
    var content = e.currentTarget.dataset.content
    console.log("startCountDown", content)

    if (content == "+")
    {
      this.addNewTime()
    }

  },

  // 添加新的时间
  addNewTime: function()
  {
    console.log("addNewTime")
    const db = wx.cloud.database()
    db.collection("times").add({
      data: {
        time: 90
      },
      success: res => {
        wx.showToast({
          title: 'add new timer success',
        })
        this.loadData()
        console.log("add new timer success")
      },
      fail: err => {
        wx.showToast({
          title: 'add timer fail',
          icon: 'none'
        })
        console.log("add new timer fail")
      }
    })
  },

  drawStart: function (e) {

    var index = e.currentTarget.dataset.index
    if (index == this.data.times.length-1) {
      return
    }

    console.log("drawStart");
    var touch = e.touches[0]

    for (var index in this.data.times) {
      console.log("drawStart", index)
      var item = this.data.times[index]
      item.right = 0
    }
    this.setData({
      times: this.data.times,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {

    var index = e.currentTarget.dataset.index
    if (index == this.data.times.length-1) {
      return
    }

    var touch = e.touches[0]
    var item = this.data.times[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        times: this.data.times
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        times: this.data.times
      })
    }
  },
  drawEnd: function (e) {
    
    var index = e.currentTarget.dataset.index
    if (index == this.data.times.length-1) {
      return
    }

    var item = this.data.times[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        times: this.data.times,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        times: this.data.times,
      })
    }
  },

  delItem: function (e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.times[index]
    console.log("delItem", index)

    if (data.mine === false) {
      return
    }

    wx.showLoading({
      title: 'removing',
    })
    const db = wx.cloud.database()
    db.collection('times').doc(data._id).remove({
      success: res => {
        wx.hideLoading()
        // 删除数组元素
        this.data.times.splice(index, 1)
        this.setData({
          times: this.data.times
        })

        wx.showToast({
          title: "remove success",
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: 'remove fail',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })

  },

  onLoad() {
    const app = getApp()
    console.log("onLoad")
    this.setData({
      windowHeight: app.globalData.windowHeight * 2 - 80,
      openId: app.globalData.openId
    })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.loadData()
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    this.loadData()
  }
})
