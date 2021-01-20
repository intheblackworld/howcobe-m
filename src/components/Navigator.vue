<template>
  <div class="navigator fixed frost flex">
    <router-link tag="div" :to="nav.to" :class="`nav-item flex-c wrap ${isActivePage(nav.to) ? 'active' : ''}`" v-for="nav in nav_list" :key="`nav-${nav.name}`">
      <img :src="nav.icon_active" alt="" class="nav-icon" v-if="isActivePage(nav.to)">
      <img :src="nav.icon" alt="" class="nav-icon" v-if="!isActivePage(nav.to)">
      <div class="nav-name">{{nav.name}}</div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'component_navigator',
  data() {
    return {
      search: '',
      nav_list: [
        {
          name: '首頁',
          icon: require('@/assets/img/icons/home.png'),
          icon_active: require('@/assets/img/icons/home_active.png'),
          to: '/home',
        },
        {
          name: '課程',
          icon: require('@/assets/img/icons/course.png'),
          icon_active: require('@/assets/img/icons/course_active.png'),
          to: '/course',
        },
        {
          name: '比課',
          icon: require('@/assets/img/icons/compare.png'),
          icon_active: require('@/assets/img/icons/compare_active.png'),
          to: '/compares',
        },
        {
          name: '投票',
          icon: require('@/assets/img/icons/vote.png'),
          icon_active: require('@/assets/img/icons/vote_active.png'),
          to: '/votes',
        },
        {
          name: '個人',
          icon: require('@/assets/img/icons/admin.png'),
          icon_active: require('@/assets/img/icons/admin_active.png'),
          to: '/admin',
        },
      ],
    }
  },

  methods: {
    isActivePage(to) {
      return this.$route.path.includes(to)
    },
  },
}
</script>

<style lang="scss" scoped>
.navigator {
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 63px;
  background-color: #fefefe;
  border-top: 1px solid #eee;
  z-index: 10;
}

.nav-item {
  width: 20%;
  .nav-icon {
    width: 24px;
    margin-top: -10px;
    margin-bottom: 5px;
  }

  &.active {
    .nav-icon {
      // width: 28px;
    }
    .nav-name {
      color: rgb(249, 121, 16);
      font-weight: bold;
    }
  }

  .nav-name {
    width: 100%;
    font-size: 14px;
    color: #999;
    font-weight: thin;
    text-align: center;
  }
}
</style>