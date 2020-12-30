<template>
  <div class="header fixed dark frost flex-c">
    <div class="search">
      <input ref="input" type="text" class="search-input" :placeholder="`${pattern === 'compare' ? '比出最適合你的課程' : '尋找你感興趣的課程'}`" @click="focus" v-model="search" @change="updateSearch" @keypress="searchByEnter">
    </div>
    <router-link tag="div" to="/" class="logo">
      <img src="../assets/img/nav-logo-2.png" alt="">
    </router-link>
    <div class="hot-list" v-if="$route.path.includes('/home')">
      <div class="hot-title">熱門搜尋</div>
      <div class="hot-item btn flex-c" @click="quickSearch(key.keyword)" v-for="(key, index) in keyword_list" :key="key.keyword + index">{{key.keyword}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getHotKeyword } from '@/http/api'
export default {
  name: 'component_header',
  data() {
    return {
      search: '',
      keyword_list: [],
    }
  },

  computed: {
    ...mapState(['pattern']),
  },

  mounted() {
    getHotKeyword().then((res) => {
      this.keyword_list = res
    })
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

    quickSearch(val) {
      this.$store.commit('updateSearch', val)
      if (this.$route.path.includes('/home')) {
        this.$router.push('/courses')
      }
      // this.$emit('focusSearch')
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

.hot-list {
  position: absolute;
  bottom: -30px;
  width: 100vw;
  height: 30px;
  // display: flex;
  // justify-content: flex-start;
  overflow-x: scroll;
  background-color: #f6eedf;
  padding: 5px 12px 0;
  // flex-wrap: wrap;

  .hot-title {
    font-size: 14px;
    color: #ff8200;
    font-weight: bold;
    display: inline-block;
    margin-right: 15px;
  }

  .hot-item {
    cursor: pointer;
    height: auto;
    display: inline-block;
    font-size: 14px;
    // background-color: #f6eedf;
    color: #333;
    // padding: 3px 5px;
    // border-radius: 6px;
    text-decoration: underline;
    margin: 0 15px 18px 0;
    // box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;

    &:hover {
      // box-shadow: inset 0 1px 1px 1px rgba(0, 0, 0, 0.7);
    }

    &:nth-child(1) {
      // color: #fff;
      // background: linear-gradient(91.97deg, #ff0000 -10.07%, #fd666f 126.39%);
    }

    &:nth-child(2) {
      // color: #fff;
      // background-color: #f57b51;
    }

    &:nth-child(3) {
      // background-color: #d1cebd;
    }
  }
}
</style>