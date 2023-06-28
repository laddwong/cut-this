import { log } from "../utils/log"
import { G_VALUE, GravitySenceObject } from "./baseObject"

/**
 * 被切后的水果
 */
export class PartOfFruit extends GravitySenceObject {
  /**
   * @param {object} param0
   * @param {string} param0.imgUrl 图片url
   * @param {number[]} param0.centerPos 初始中心位置
   * @param {number} param0.speedAngle 初始速度角度
   */
  constructor({imgUrl, centerPos, speedAngle}) {
    super({
      name: 'part of fruit',
      imgUrl,
      duration: 2000,
      centerPos,
      speed: 200,
      speedAngle,
      rotateSpeed: 0.2
    })
  }
}

/**
 * 水果
 */
export class Fruit extends GravitySenceObject {
  /**
   * @param {object} param0
   * @param {string} param0.name 名称
   * @param {string} param0.imgUrl 图片url
   * @param {number[]} param0.startPos 初始中心位置
   * @param {number} param0.startRotate 初始旋转角度
   * @param {number} param0.startAngle 初始速度角度
   * @param {number} param0.startSpeed 初始速度
   * @param {number} param0.rotateSpeed 旋转速度
   * @param {string} param0.part1ImgUrl 被切后左半部分图片url
   * @param {string} param0.part2ImgUrl 被切后右半部分图片url
   */
  constructor({name, imgUrl, startPos, startRotate, startAngle, startSpeed, rotateSpeed, part1ImgUrl, part2ImgUrl}) {
    super({
      name,
      duration: (startSpeed * 2) / G_VALUE,
      centerPos: startPos,
      imgUrl,
      rotate: startRotate,
      speed: startSpeed,
      speedAngle: startAngle,
      rotateSpeed
    })
    /** @type {string} 分裂后图片url1 */this.part1ImgUrl = part1ImgUrl
    /** @type {string} 分裂后图片url2 */this.part2ImgUrl = part2ImgUrl
  }
  /**
   * 水果被切后的动画，在特效图层增加果汁和两个被切后的水果
   * @param {import('./sence').Layer} effectLayer
   * @param {Fruit} fruit
   */
  broken(effectLayer, fruit) {
    const fruitPart1 = new PartOfFruit({imgUrl: fruit.part1ImgUrl, centerPos: fruit.currCenterPos, speedAngle: 180})
    const fruitPart2 = new PartOfFruit({imgUrl: fruit.part2ImgUrl, centerPos: fruit.currCenterPos, speedAngle: 0})
    effectLayer.add(fruitPart1)
    effectLayer.add(fruitPart2)
  }
}