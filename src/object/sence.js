/* 
 * 负责场景渲染
 * 暴露update方法，给主流程调用，每次调用都重新绘制场景内容，每秒调用频率几乎就是帧率
 * 暴露add方法，给场景添加元素
 * 元素销毁：生命到了自动销毁，不用手动
*/

import { log } from "../utils/log";

/**
 * 图层
 */
export class Layer{
  constructor({name, level}) {
    this.name = name
    this.level = level || 0
    this.content = []
  }
  /**
   * 图层中增加物品
   * @param {SenceItem} item 
   */
  add(item) {
    this.content.push(item)
  }
}

const layerCache = {}
/**
 * 创建图层
 * @param {Object} param0 
 * @param {String} param0.name 图层名称
 * @param {String} param0.level 图层层级，越大越在上层
 * @returns 
 */
export function createLayer({name, level}) {
  if(layerCache[name]) return layerCache[name];
  return new Layer({name, level})
}

/**
 * 场景
 */
export class Sence{
  constructor({canvasEl}) {
    /** @type {Array<Layer>} 图层集合 */ this.layerList = []
    /** @type {HTMLCanvasElement} */ this.canvasEl = canvasEl
    /** @type {CanvasRenderingContext2D } */this.ctx = this.canvasEl.getContext('2d')
    this.width = this.canvasEl.style.width.replace('px', '')
    this.height = this.canvasEl.style.height.replace('px', '')
    this.t0 = performance.now()
  }

  /**
   * 在场景中添加图层
   * @param {Layer} layer 
   */
  addLayer(layer) {
    if(!this.layerList.length) return this.layerList.push(layer);
    for (let index = 0; index < this.layerList.length; index++) {
      const element = this.layerList[index];
      if(layer.level < element.level) return this.layerList.splice(index, 0, layer);
    }
    this.layerList.push(layer)
  }
  /**
   * 获取图层
   * @param {String} name 图层名称
   * @returns {Layer | undefined}
   */
  getLayer(name) {
    return this.layerList.find(layer => layer.name === name)
  }
  /**
   * 刷新场景
   * @param {Number} timeNow 当前时间
   */
  update() {
    const timeNow = Date.now()
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
    this.layerList.forEach(layer => {
      layer.content = layer.content.filter(/** @param {import('./baseObject').SenceObject} item*/ item => {
        if(timeNow > item.endTime) return false;
        item.update(timeNow)
        this.drawSenceItem(item)
        return true;
      })
    })
    // log.info('all layers', ...this.layerList)
    requestAnimationFrame(() => this.update())
  }
  /**
   * 根据状态画在canvas上
   * @param {import('./baseObject').SenceObject} senceObject 
   */
  drawSenceItem(senceObject) {
    if(typeof senceObject == 'undefined' || !senceObject.img || !senceObject.currCenterPos || !senceObject.currSize) {
      log.info('tttttt', senceObject)
      return
    };
    this.ctx.save()
    if(senceObject.currRotate) {
      this.ctx.translate(senceObject.currCenterPos[0], senceObject.currCenterPos[1])
      this.ctx.rotate(senceObject.currRotate * Math.PI / 180)
      this.ctx.translate(-senceObject.currCenterPos[0], -senceObject.currCenterPos[1])
    }
    const topLeftPos = [senceObject.currCenterPos[0] - (senceObject.currSize[0] / 2), senceObject.currCenterPos[1] - (senceObject.currSize[1] / 2)]
    this.ctx.drawImage(
      senceObject.img, 
      topLeftPos[0],
      topLeftPos[1],
      senceObject.currSize[0],
      senceObject.currSize[1]
    )
    this.ctx.restore()
  }
}