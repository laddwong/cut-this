/** @typedef {import('./knife').Pos} Pos*/

import { log } from '../utils/log'
import { Detector } from './detector'
import { FruitsBarbette } from './fruitsBarbette'
import { Knife } from './knife'
import { Layer, Sence, createLayer } from './sence'

export default class GameProcess {
  /**
   * 游戏过程类
   * @param {Object} options
   * @param {number} options.gameDuration 游戏时间，单位：秒
   * @param {number} options.fireInterval 水果发射的间隔，默认500ms
   * @param {Function} options.endGameFn 活动结束时执行的回调
   * @param {HTMLCanvasElement} options.canvasEl 游戏画布
   * @param {HTMLVideoElement} options.videoEl 摄像头的图像
   */
  constructor({gameDuration, fireInterval, endGameFn, canvasEl, videoEl}) {
    /** @type {number} 游戏时长 */this.gameDuration = gameDuration
    /** @type {number} 开始时间 */this.startTime
    /** @type {number} 结束时间 */this.endTime
    /** @type {Sence} 场景实例 */this.sence = new Sence({canvasEl})
    /** @type {Layer} 水果图层 */this.fruitsLayer = createLayer({name: 'fruit', level: 40})
    /** @type {Layer} 刀子图层 */this.knifeLayer = createLayer({name: 'knife', level: 50})
    /** @type {Layer} 特效图层 */this.effectLayer = createLayer({name: 'effect', level: 45})
    /** @type {Knife} 刀子实例 */this.knife = new Knife({layer: this.knifeLayer, imgUrl: '/images/knife.png'})
    /** @type {FruitsBarbette} 水果发射器 */this.fruitsBarbette = new FruitsBarbette({ layer: this.fruitsLayer })
    /** @type {Detector} 目标探测器实例 */this.detector = new Detector({ videoEl })

    this.sence.addLayer(this.fruitsLayer)
    this.sence.addLayer(this.knifeLayer)
    this.sence.addLayer(this.effectLayer)


    this.init()
    this.timer = null
    this.fireInterval = fireInterval || 500
    this.endGameFn = endGameFn
  }

  init() {
    // init sence and getLayer
  }

  start() {
    if (!this.detector.isInitSuccess || this.detector.isInitFailed) {
      log.info('探测器未初始完成')
      setTimeout(() => {
        this.start()
      }, 500);
      return
    }
    this.startTime = Date.now()
    this.endTime = this.startTime + (this.gameDuration * 1000)

    // 探测器、刀
    let lastTime = Date.now()
    const sliceInterval = 40
    this.detector
    .onDetect(/** @param {Pos} nosePos*/ nosePos => {
      const timeNow = Date.now();
      if(timeNow - lastTime >= sliceInterval) {
        this.knife.slice(nosePos, this.fruitsLayer, this.effectLayer)
        lastTime = timeNow
      }
    })
    .start()

    // 水果发射器
    this.timer = setInterval(() => {
      this.fruitsBarbette.fire() // 按策略发射水果
    }, this.fireInterval);
    
    // 动画渲染
    this.sence.update()

    // 结束
    setTimeout(() => {
      this.end()
    }, this.gameDuration * 1000);
  }
  end() {
    this.detector.stop()
    clearInterval(this.timer)
    this.endGameFn()
  }
}