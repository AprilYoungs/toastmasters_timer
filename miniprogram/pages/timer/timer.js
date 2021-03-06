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
    radius:50,

    animationData: {},
    green: "#65D087",
    yellow: "#D0C865",
    red: "#D06565",
    purple: "#D06593",
    currentColor: null,
    slient: true,
    pauseTimer: false,
    isPlaying: false,

    inputName: null
  },


  // begin to count down and update the user interface
  beginCountDown()
  {
    if (this.data.pauseTimer){return}

    var sec = this.data.currentSec
    var timeStr = this.formatSec(sec)

    this.setData({
      currentSec: sec,
      currentStr: timeStr,
      totalStr: "Time span: " + this.formatSec(this.data.totalSec)
    })

    this.data.currentSec = this.data.currentSec - 1
   
    this.countDownTimer = setTimeout(this.beginCountDown, 1000)

    if (this.data.currentSec <= -30 
      && this.data.totalSec >= 180)
    {
      this.showPurple()
      return
    }

    if (this.data.currentSec <= -15 
      && this.data.totalSec < 180)
   {
      this.showPurple()
      return
    }

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
    var sec = Number(options.sec) 

    this.setData({
      totalSec: sec,
      currentSec: sec,
      pauseTimer: false
    })

    const innerAudioContext = wx.createInnerAudioContext()

    innerAudioContext.loop = true
    innerAudioContext.src = 'https://7469-timerdev-5wjqv-1301150003.tcb.qcloud.la/alarm.wav?sign=600f861a7d3d4e2221bfe83786cd87d1&t=1579614060'

    this.audio = innerAudioContext

    this.audio.onPlay(() => {
      console.log('play alarm')
    })
    this.audio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    this.audio.onStop(()=>{
      console.log("stop alarm")
    })

  },

getName(e){
  const name = e.detail.value
  this.data.inputName = name

  console.log("Get name->", name)
},

saveRecord()
{
    // save the record to a list
    // [{name: xxx, time:xxx}]

  // const newRecord = 

  var list = wx.getStorageSync("history")

  console.log("list", list)

  if (list == '')
  {
    list = [{
      "name": this.data.inputName,
      "time": this.formatSec(this.data.totalSec - this.data.currentSec - 1),
      "total": this.formatSec(this.data.totalSec),
      "exceed": (this.data.currentSec - this.data.totalSec) > -1
    }]
  }
  else
  {
    list = list.concat([{
      "name": this.data.inputName,
      "time": this.formatSec(this.data.totalSec - this.data.currentSec - 1),
      "total": this.formatSec(this.data.totalSec),
      "exceed": (this.data.currentSec - this.data.totalSec) > -1
    }])
  }
  wx.setStorage({
    key: 'history',
    data: list,
  })

},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("onShow")
    wx.getSystemInfo({
      success: res => {
        console.log("getSystemInfo", res)
        this.setData({
          windowHeight: Number(res.windowHeight)
        })
      }
    })

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation

    this.beginCountDown()
  },

  // reset timer
  tapReset(){

    this.saveRecord()

    this.setData({
      totalSec: this.data.totalSec,
      currentSec: this.data.totalSec,
      pauseTimer: false,
      inputName: null
    })

    this.beginCountDown()

  },

  tapCircle(){
    if (this.data.slient == false)
    {
      this.shrinkAndBecomeNormal()

      if (this.data.isPlaying)
      {
        this.data.isPlaying = false 
        this.audio.stop()
      }
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
          totalStr: "Used time: " + this.formatSec(this.data.totalSec - this.data.currentSec - 1)
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

  // show purple color and ringing
  showPurple() {

    if (this.data.currentColor != this.data.purple) {
      this.expandAndChangeColor(this.data.purple)
      this.data.currentColor = this.data.purple

      this.data.isPlaying = true
      this.audio.play()
    }
  },

  expandAndChangeColor(color){

    this.animation
      .width(app.globalData.windowWidth)
      .height(this.data.windowHeight)
      .backgroundColor(color)
      .step()

    this.setData({
      radius: 0,
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
      radius: 50,
      animationData: this.animation.export()
    })

    // this.data.onExpand = false
    this.data.slient = true

    clearInterval(this.blinkTimer)
    clearInterval(this.vibrateTimer)
    this.blinkTimer = null
    this.vibrateTimer = null
  },

  clearTimers(){
    clearInterval(this.blinkTimer)
    clearInterval(this.vibrateTimer)
    clearTimeout(this.countDownTimer)
    this.audio.stop()
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
    
    this.clearTimers()
    console.log("onHide")

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

    // save the record if it's paused
    this.saveRecord()

    this.clearTimers()
    console.log("onUnload")
    
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