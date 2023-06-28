// 一些基础类

const SENCE_OBJECT_IMAGE_CACHE = {}
/**
 * 场景物体
 */
export class SenceObject{
  /**
   * @param {Object} param0 
   * @param {String} param0.name 物体名称
   * @param {Number} param0.startTime 物体出现时间，单位 ms，默认当前时间
   * @param {Number} param0.endTime 物体消失时间，单位 ms，默认出现时间加上存活时间
   * @param {Number} param0.duration 物体存活时长，单位 ms
   * @param {Number[]} param0.centerPos 物体初始中心坐标，默认 [0, 0]
   * @param {String} param0.imgUrl 物体图像
   * @param {Number} param0.size 物体宽高，默认图像宽高
   * @param {Number} param0.rotate 物体初始旋转角度，默认0
   * 
   */
  constructor({name, startTime, endTime, duration, centerPos, imgUrl, size, rotate}) {
    // 基础信息
    /** @type {String} 物体名称 */this.name = name || ''
    /** @type {Number} 物体出现时间，单位 ms */this.startTime = startTime || Date.now()
    /** @type {Number} 物体消失时间，单位 ms */this.endTime = endTime || (this.startTime + duration)
    /** @type {Number} 物体存活时长，单位 ms */this.duration = duration
    /** @type {String} 物体图像url */this.imgUrl = imgUrl
    /** @type {String} 物体图像Image元素 */this.img

    // 初始状态信息
    /** @type {Number[]} 物体初始中心坐标 */this.startCenterPos = centerPos || [0, 0]
    /** @type {Number[]} 物体初始宽高 */this.size = size
    /** @type {Number} 物体初始旋转角度 */this.startRotate = rotate || 0

    // 当前状态信息
    /** @type {Number[]} 物体当前中心坐标 */this.currCenterPos = centerPos || [0, 0]
    /** @type {Number} 物体当前旋转角度 */this.currRotate = rotate || 0
    /** @type {Number[]} 物体当前宽高 */this.currSize = size

    // 从缓存加载图像Image元素
    if(SENCE_OBJECT_IMAGE_CACHE[imgUrl]) {
      this.img = SENCE_OBJECT_IMAGE_CACHE[imgUrl]
      if(!size) this.size = this.currSize = [this.img.width, this.img.height];
    } else {
      const imgEl = new Image()
      imgEl.src = imgUrl
      imgEl.onload = () => {
        SENCE_OBJECT_IMAGE_CACHE[imgUrl] = this.img = imgEl
        if(!size) this.size = this.currSize = [this.img.width, this.img.height];
      }
    }
  }
  /**
   * 根据时间更新当前物体状态
   * @param {Number} timeNow 当前时间
   */
  update(timeNow) {
    return this;
  }
}

/** @type {Number} 重力加速度 */
export const G_VALUE = 0.33

/**
 * 受重力影响的场景物体
 * 规定方向向下的速度为负，向上的速度为正
 */
export class GravitySenceObject extends SenceObject {
  constructor({name, startTime, endTime, duration, centerPos, imgUrl, size, rotate, speed, speedAngle, rotateSpeed}) {
    super({name, startTime, endTime, duration, centerPos, imgUrl, size, rotate});
    /** @type {Number} 初速度 */this.speed = speed
    /** @type {Number} 初速度角度 */this.speedAngle = speedAngle
    /** @type {Number} 旋转速度 */this.rotateSpeed = rotateSpeed
    /** @type {Number} x轴初速度 */this.speedX = speed * Math.cos(speedAngle * Math.PI / 180)
    /** @type {Number} y轴初速度 */this.speedY = speed * Math.sin(speedAngle * Math.PI / 180)
  }
  update(timeNow) {
    if(!this.img) return;
    const timePassed = timeNow - this.startTime
    const posX = (timePassed * this.speedX / 1000) + this.startCenterPos[0]
    let posY = this.startCenterPos[1] - ((this.speedY * timePassed) - (0.5 * G_VALUE * timePassed * timePassed)) / 1000

    this.currCenterPos = [posX, posY]
    this.currRotate = this.startRotate + timePassed * this.rotateSpeed
    return this
  }
}