import { log } from "../utils/log";
import { getRandomBoolean, getRandomIntBetween } from "../utils/tools";
import { Fruit } from "./fruit"

/** @typedef {import('./knife').Pos} Pos*/

/**
 * 水果发射器
 */
export class FruitsBarbette {
  /**
   * @param {Object} param0 
   * @param {Layer} param0.layer
   */
  constructor({layer}) {
    this.layer = layer
    this.fruitType = {
      apple: {
        full:  '/images/fruits/apple.png',
        part1:  '/images/fruits/apple-1.png',
        part2:  '/images/fruits/apple-2.png',
      },
      banana: {
        full:  '/images/fruits/banana.png',
        part1:  '/images/fruits/banana-1.png',
        part2:  '/images/fruits/banana-2.png',
      },
      basaha: {
        full:  '/images/fruits/basaha.png',
        part1:  '/images/fruits/basaha-1.png',
        part2:  '/images/fruits/basaha-2.png',
      },
      peach: {
        full:  '/images/fruits/peach.png',
        part1:  '/images/fruits/peach-1.png',
        part2:  '/images/fruits/peach-2.png',
      },
      sandia: {
        full:  '/images/fruits/sandia.png',
        part1:  '/images/fruits/sandia-1.png',
        part2:  '/images/fruits/sandia-2.png',
      },
      boom: {
        full:  '/images/fruits/boom.png',
        part1:  '/images/fruits/boom-1.png',
        part2:  '/images/fruits/boom-2.png',
      },
    }
  }
  /** 全随机策略 */
  fire() {
    const typeList = ['apple', 'banana', 'basaha', 'peach', 'sandia', 'boom']
    const type = typeList[getRandomIntBetween(0, typeList.length - 1)]
    const fruit = new Fruit({
      name: type,
      imgUrl: this.fruitType[type].full,
      part1ImgUrl: this.fruitType[type].part1,
      part2ImgUrl: this.fruitType[type].part2,
      startPos: [getRandomIntBetween(100, 380), 900],
      startRotate: getRandomIntBetween(80, 100),
      startAngle: getRandomIntBetween(80, 100),
      startSpeed: getRandomIntBetween(510, 600),
      rotateSpeed: getRandomIntBetween(1, 3) * 0.1,
    })
    this.layer.add(fruit)
  }
}