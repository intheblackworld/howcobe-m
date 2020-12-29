<template>
  <div class="default">
    <Header />
    <transition name="fade">
    <LoginDialog v-if="openLoginDialog || (isLogin && !hasInterest)" />
    </transition>
    <transition name="fade">
      <NewBieDialog v-if="isNewBie"></NewBieDialog>
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
import NewBieDialog from '@/components/Dialog/NewBieDialog'
import LoginDialog from '@/components/Dialog/LoginDialog'

export default {
  name: 'default_layout',
  components: {
    Header,
    Navigator,
    AdaptiveDialog,
    NewBieDialog,
    LoginDialog
  },

  computed: {
    ...mapState(['isCompare', 'pattern', 'openAdaptiveDialog', 'openLoginDialog']),
    ...mapGetters('user', ['isLogin', 'hasInterest', 'isNewBie']),
  },

  methods: {},

  async mounted() {
    this.$store.dispatch('course/getQuickCourse')
    if (this.isLogin) {
      await this.$store.dispatch('user/getUserInfo')
      if (this.hasInterest) {
        await this.$store.dispatch('course/getInterestsCourse')
      }
      await this.$store.dispatch('course/getCollectList')
    }
  },
}
</script>

<style lang="scss" scoped>
.default {
}
</style>
