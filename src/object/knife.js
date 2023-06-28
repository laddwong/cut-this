/*
 * 1. 暴露slice，每次触发时拿到最新的位置，和旧位置相比，生成刀光
 * 2. 每个刀光有自己的生命周期，在画布生成开始，会随着时间变小，然后消失，销毁，期间会检测碰撞
 */

import { angleBetweenPoints, distanceBetweenPoints, lineXEllipse, midpointBetweenPoints } from '../utils/coordinateTool'
import { log } from '../utils/log'
import { SenceObject } from './baseObject'

/**
 * 坐标点
 * @typedef {number[]} Pos
 * @property {number} 0 - x轴坐标
 * @property {number} 1 - y轴坐标
 */


/**
 * 刀光
 */
class KnifeLight extends SenceObject {
  /**
   * @param {Object} options
   * @param {Pos} options.startPos 开始坐标
   * @param {Pos} options.endPos 结束坐标
   * @param {HTMLImageElement} options.img 图
   */
  constructor({startPos, endPos, imgUrl}) {
    const lightLong = distanceBetweenPoints(startPos[0], startPos[1], endPos[0], endPos[1])
    const lightWidthBase = 10
    super({
      name: 'knife light',
      duration: 500,
      centerPos: midpointBetweenPoints(startPos[0], startPos[1], endPos[0], endPos[1]),
      imgUrl,
      rotate: angleBetweenPoints(startPos[0], startPos[1], endPos[0], endPos[1]),
      size: [lightLong, lightWidthBase]
    })
    /** @type {Pos} 原始开始点 */ this.startPos = startPos
    /** @type {Pos} 原始结束点 */ this.endPos = endPos
    /** @type {Number} 刀光的长度 */ this.knifeLightLong = lightLong
    /** @type {Number} 刀光的宽度，固定开始10，随时间逐渐减小 */ this.knifeLightWidthBase = lightWidthBase

  }

  /**
   * 更新状态
   * @param {Number} timeNow 当前时间
   * @returns {KnifeLight}
   */
  update(timeNow) {
    const widthNow = ((this.endTime - timeNow) / this.duration) * this.knifeLightWidthBase
    this.currSize = [this.knifeLightLong, widthNow]
    return this
  }
}

/**
 * 刀子
 */
export class Knife extends SenceObject {
  constructor({layer, imgUrl}) {
    super({
      name: 'knife',
      duration: Infinity,
      size: [20, 20],
      imgUrl
    })
    /** @type {import('./sence').Layer} */this.knifeLayer = layer

    this.knifeLayer.add(this)
  }
  /**
   * 拿到最新位置，生成刀光，计算碰撞，得到本次切到的水果
   * @param {Pos} newPos 
   * @param {import('./sence').Layer} fruitLayer 水果图层
   */
  slice(newPos, fruitLayer, effectLayer) {
    if(this.currCenterPos[0] === newPos[0] && this.currCenterPos[1] === newPos[1]) return;
    
    // 遍历水果图层的水果，判断是否与本次切割相交，是则设置标识为已切割
    fruitLayer.content = fruitLayer.content.filter(
      /** @param {import('./fruit').Fruit} fruit */
      fruit => {
        const isSliced = lineXEllipse(this.currCenterPos, newPos, fruit.currCenterPos, fruit.currSize[0])
        if(isSliced && (isSliced[0] || isSliced[1])) {
          log.info('is sliced', isSliced)
          // 被切中后执行水果的分裂动画，返回false，将被切的水果移出水果图层
          fruit.broken(effectLayer, fruit)
          return false
        }
        return true
      }
    )

    // 增加刀光特效
    const knifeLight = new KnifeLight({startPos: this.currCenterPos, endPos: newPos, imgUrl: '/images/flash.png'})
    this.knifeLayer.add(knifeLight)
    this.currCenterPos = newPos
  }
}