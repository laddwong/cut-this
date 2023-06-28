// 一些工具

/**
 * 返回区间内的随机数
 * @param {Number} min 
 * @param {Number} max 
 * @returns 
 */
export function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 根据传入的概率返回true或者false
 * @param {Number} probability 概率，0到1之间
 * @returns 
 */
export function getRandomBoolean(probability) {
  return Math.random() <= probability;
}