<template>
  <view>
    <video :style="{width: gameWidth, height: gameHeight}" ref="videoEl" id="videoEl"></video>
    <canvas :style="{width: gameWidth, height: gameHeight}" ref="canvasEl" id="canvasEl" style="position: absolute;top: 0; left: 0;"></canvas>
    <view>{{socre}}</view>
  </view>
</template>

<script>
import GameProcess from '../../object/gameProcess'

/** @type {GameProcess} */ let process;

export default {
  name: 'GamePage',
  data() {
    return {
      socre: 0,
      gameWidth: '0px',
      gameHeight: '0px',
    }
  },
  methods: {
    init() {
      this.gameWidth = window.innerWidth + 'px'
      this.gameHeight = window.innerHeight + 'px'

      this.startGame()
    },
    startGame() {
      process = new GameProcess({
        gameDuration: 300,
        endGameFn: this.endGame.bind(this),
        canvasEl: document.getElementsByTagName('canvas')[0],
        videoEl: document.getElementsByTagName('video')[0], // video标签会被uni-app二次加工，用id拿到的不是video标签，改用这种方式
      })
      process.start()
    },
    endGame() {},
    showResult() {},
  },
  mounted() {
    this.init()
  },
  beforeUnmount() {
    process && process.end()
  }
}
</script>

<style></style>
