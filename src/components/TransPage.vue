<template>
  <transition
    mode="out-in"
    :name="transName"
  >
    <slot></slot>
  </transition>
</template>

<script>
const DEFAULT_TRANS = 'fade'
const DEFAULT_TRANSITION_MODE = 'out-in'
export default {
  data() {
    return {
      transName: DEFAULT_TRANS,
      transMode: DEFAULT_TRANSITION_MODE,
    }
  },

  created() {
    this.$router.beforeEach((to, from, next) => {
      let transName = to.meta.transName || from.meta.transName

      if (transName === 'slide') {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        transName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
      this.transitionMode = DEFAULT_TRANSITION_MODE
      this.transName = transName || DEFAULT_TRANS
      next()
    })
  },
}
</script>

<style lang="scss" scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
