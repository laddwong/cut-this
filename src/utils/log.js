export class Log {
  constructor() {}

  err(msg) {
    console.error(msg, Array.prototype.slice.call(arguments, 1));
  }
  info(msg) {
    console.log(msg, Array.prototype.slice.call(arguments, 1));
  }
  succ(msg) {
    console.log(msg, Array.prototype.slice.call(arguments, 1));
  }
}

export const log = new Log()