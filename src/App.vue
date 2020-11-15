<template>
  <div
    id="app"
    ref="quicklink"
  >
    <div ref="gtmNoScript" />
    <trans-page>
      <router-view />
    </trans-page>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<style lang="scss">
</style>

<script>
import gtm from '@/mixin/gtm.js'
import TransPage from '@/components/TransPage.vue'
export default {
  name: 'App',

  mixins: [gtm],
  components: {
    TransPage,
  },
}
</script>