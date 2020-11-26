<template>
  <div class="default">
    <Header />
    <transition name="fade">
    <LoginDialog v-if="openLoginDialog || (isLogin && !hasInterest)" />
    </transition>
    <transition name="fade">
      <AdaptiveDialog v-if="openAdaptiveDialog"></AdaptiveDialog>
    </transition>
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
import { mapState, mapGetters } from 'vuex'
import Header from '@/components/Header.vue'
import Navigator from '@/components/Navigator.vue'
import AdaptiveDialog from '@/components/Dialog/AdaptiveDialog'
import LoginDialog from '@/components/Dialog/LoginDialog'

export default {
  name: 'default_layout',
  components: {
    Header,
    Navigator,
    AdaptiveDialog,
    LoginDialog
  },

  computed: {
    ...mapState(['isCompare', 'pattern', 'openAdaptiveDialog', 'openLoginDialog']),
    ...mapGetters('user', ['isLogin', 'hasInterest']),
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
.default {
}
</style>
