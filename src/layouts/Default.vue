<template>
  <div class="default">
    <Header />
    <router-view></router-view>
    <Navigator />
    <!-- <transition name="fade">
      <AdaptiveDialog v-if="openAdaptiveDialog"></AdaptiveDialog>
    </transition> -->
    <!-- <div class="toolbar-item flex-c" @click="$store.commit('openAdaptiveDialog')">
      適性測驗
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header.vue'
import Navigator from '@/components/Navigator.vue'
// import AdaptiveDialog from '@/components/Dialog/AdaptiveDialog'

export default {
  name: 'default_layout',
  components: {
    Header,
    Navigator,
    // AdaptiveDialog,
  },

  computed: {
    ...mapState(['isCompare', 'pattern', 'openAdaptiveDialog']),
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.default {
}
</style>
