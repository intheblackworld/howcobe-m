<template>
  <div class="header fixed dark frost flex-c">
    <div class="search">
      <input ref="input" type="text" class="search-input" :placeholder="`${pattern === 'compare' ? '比出最適合你的課程' : '尋找你感興趣的課程'}`" @click="focus" v-model="search" @change="updateSearch" @keypress="searchByEnter">
    </div>
    <router-link tag="div" to="/" class="logo">
      <img src="../assets/img/nav-logo-2.png" alt="">
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'component_header',
  data() {
    return {
      search: '',
    }
  },

  computed: {
    ...mapState(['pattern']),
  },

  methods: {
    focus() {
      this.$emit('focusSearch')
    },
    searchByEnter(e) {
      // console.log(e.keyCode)
      // console.log(this.search, 'searchVal')
      if (e.keyCode === 13) {
        this.$store.commit('updateSearch', this.search)
        if (this.$route.path.includes('/home')) {
          this.$router.push('/courses')
        }
        // if (this.pattern === 'compare') {
        //   // 叫出 tinder 效果彈窗
        //   // await this.$store.dispatch('course/getTinderCourse', {
        //   //   search: this.searchVal,
        //   //   limit: 12,
        //   // })

        // } else {
        //   this.$router.push(`course?search=${this.search}`)
        // }
      }
    },

    clearSearch() {
      this.$store.commit('updateSearch', '')
      this.$emit('blurSearch')
    },

    updateSearch(e) {
      this.$store.commit('updateSearch', e.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  left: 0;
  width: 100vw;
  height: 60px;
  padding: 12px;
  z-index: 10;
}

.search {
  width: 70%;
  padding-right: 12px;
}

.logo {
  width: 30%;
  img {
    width: 100%;
  }
}

.search-input {
  outline: none;
  width: 100%;
  height: 34px;
  border: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  font-size: 14px;
  line-height: 14px;
  padding: 0 10%;
  color: #333;

  &::-webkit-input-placeholder {
    color: #999;
    font-size: 14px;
    line-height: 14px;
  }
}
</style>