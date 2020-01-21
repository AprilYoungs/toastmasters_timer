// pages/index/timer.js

const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    totalSec: null,
    currentSec: null,
    totalStr: null,
    currentStr: null,
    windowHeight: null,

    animationData: {},
    green: "#65D087",
    yellow: "#D0C865",
    red: "#D06565",
    currentColor: null,
    slient: false,
    pauseTimer: false,
  },


  // begin to count down and update the user interface
  beginCountDown()
  {

    if (this.data.pauseTimer){return}

    var newSec = this.data.currentSec - 1

    var timeStr = this.formatSec(newSec)

    this.setData({
      currentSec: newSec,
      currentStr: timeStr,
      totalStr: "Total time: " + this.formatSec(this.data.totalSec)
    })

    setTimeout(this.beginCountDown, 1000)

    if (this.data.currentSec <= 0) {
      this.showRed()
      return
    }

    if (this.data.totalSec >= 300
      && this.data.currentSec < 60) {
      this.showYellow()
      return
    }

    if (this.data.totalSec >= 300
      && this.data.currentSec < 120) {
      this.showGreen()
      return
    }

    if (this.data.totalSec < 300
      && this.data.currentSec < 30) {
      this.showYellow()
      return
    }

    if (this.data.totalSec < 300 
    && this.data.currentSec < 60)
    {
      this.showGreen()
      return
    }

  },

  formatSec(rawSec){
    var min = (rawSec - rawSec % 60) / 60
    var sec = rawSec % 60
    var minStr = Math.abs(min) < 10 ? `0${Math.abs(min)}` : `${Math.abs(min)}`
    var secStr = Math.abs(sec) < 10 ? `0${Math.abs(sec)}` : `${Math.abs(sec)}`

    
    return rawSec < 0 ? `-${minStr}:${secStr}` : `${minStr}:${secStr}`
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log("timer", options)
    var sec = options.sec + 1

    //FIXME: remove this line
    var sec = 60

    this.setData({
      totalSec: sec,
      currentSec: sec,
      totalStr: this.formatSec(sec),
      currentStr: this.formatSec(sec),
      pauseTimer: false
    })


    this.beginCountDown()
  },


  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.setData({
      windowHeight: app.globalData.windowHeight * 2 - 80
    })

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation
    
  },

  // reset timer
  tapReset(){

    var opt = {sec: this.data.totalSec}
    this.onLoad(opt)

  },

  tapCircle(){
    if (this.data.slient == false)
    {
      this.shrinkAndBecomeNormal()
    }
    else 
    {
      this.setData({
        pauseTimer: !(this.data.pauseTimer)
      })

      this.beginCountDown()

      if (this.data.pauseTimer)
      {
        this.setData({
          totalStr: "Used time: " + this.formatSec(this.data.totalSec - this.data.currentSec)
        })
      }
    }
  },

  showGreen(){

    if (this.data.currentColor != this.data.green)
    {
      this.expandAndChangeColor(this.data.green)
      this.data.currentColor = this.data.green
    }
    
  },

  showYellow() {

    if (this.data.currentColor != this.data.yellow) {
      this.expandAndChangeColor(this.data.yellow)
      this.data.currentColor = this.data.yellow
    }

  },

  showRed() {

    if (this.data.currentColor != this.data.red) {
      this.expandAndChangeColor(this.data.red)
      this.data.currentColor = this.data.red
    }
  },

  expandAndChangeColor(color){

    this.animation
      .width(app.globalData.windowWidth)
      .height(10000)
      .backgroundColor(color)
      .step()

    this.setData({
      animationData: this.animation.export()
    })

    // blink blink blink
    if (this.blinkTimer == null)
    {
      var opacity = 0
      this.blinkTimer = setInterval(function () {

        this.animation.opacity(opacity).step()

        this.setData({
          animationData: this.animation.export()
        })
        opacity = opacity == 0 ? 1 : 0

      }.bind(this), 1000)
    }
    
    // shake it out
    if (this.vibrateTimer == null)
    {
      this.vibrateTimer = setInterval(wx.vibrateLong, 500)
    }

    this.data.slient = false
  },

  shrinkAndBecomeNormal() {
    this.animation
      .width(175)
      .height(175)
      .opacity(1)
      .backgroundColor("#D8D8D8")
      .step()

    this.setData({
      animationData: this.animation.export()
    })

    // this.data.onExpand = false
    this.data.slient = true

    clearInterval(this.blinkTimer)
    clearInterval(this.vibrateTimer)
    this.blinkTimer = null
    this.vibrateTimer = null
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    clearInterval(this.blinkTimer)
    clearInterval(this.vibrateTimer)
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