<template>
  <view>
    <Loading></Loading>
    <button @click="toGame">start game</button>
  </view>
</template>

<script>
import Loading from "../../components/loading/index.vue";
export default {
  components: {
    Loading
  },
  data() {
    return {
      
    }
  },
  onLoad() {},
  methods: {
    toGame() {
      uni.navigateTo({ url: '/pages/game/index' })
    }
  },
}
</script>

<style>
</style>
