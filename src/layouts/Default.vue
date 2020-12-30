<template>
  <div class="default">
    <Header />
    <transition name="fade">
      <LoginDialog v-if="openLoginDialog || (isLogin && !hasInterest)" />
    </transition>
    <transition name="fade">
      <NewBieDialog v-if="isNewBie && scrollTop"></NewBieDialog>
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
    LoginDialog,
  },

  computed: {
    ...mapState([
      'isCompare',
      'pattern',
      'openAdaptiveDialog',
      'openLoginDialog',
    ]),
    ...mapGetters('user', ['isLogin', 'hasInterest', 'isNewBie']),
  },

  data() {
    return {
      scrollTop: false
    }
  },

  methods: {
    onScroll() {
      // 获取所有锚点元素
      // const navContents = document.querySelectorAll('.section')
      // // 所有锚点元素的 offsetTop
      // const offsetTopArr = []
      // navContents.forEach((item) => {
      //   offsetTopArr.push(item.offsetTop)
      // })
      // 获取当前文档流的 scrollTop
      const scrollTop =
        document.documentElement.scrollTop || document.querySelector('.home').scrollTop
      // 定义当前点亮的导航下标
      // let navIndex = 0
      // for (let n = 0; n < offsetTopArr.length; n++) {
      //   // 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
      //   // 那么此时导航索引就应该是n了
      //   if (scrollTop >= offsetTopArr[n] - window.innerHeight * 0.9) {
      //     navIndex = n
      //   }
      // }
      if (scrollTop > 700 && scrollTop < 750) {
        this.scrollTop = true
      }
    },
  },

  async mounted() {
    document.querySelector('.home').addEventListener('scroll', this.onScroll, false)
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
