<template>
  <div class="course main flex-jr">
    <div class="loading-text flex-c" v-if="busy">
      <div class="hint">資料讀取中</div>
    </div>
    <div class="sidebar fixed">
      <div :class="`sidebar-item ${(cate.value === category) ? 'active' : ''}`" v-for="(cate) in category_list" :key="cate.value" @click="changeCategory(cate)">
        {{cate.label}}
      </div>
    </div>
    <div class="container course-container">
      <div v-infinite-scroll="() => loadMore(result.currentPage, result.pages)" :infinite-scroll-disabled="busy" infinite-scroll-distance="0">
        <div v-if="result.numOfResults > 0">
          <LongCard :course="course" v-for="course in result.courses" :key="course.id" @update="getCourse"></LongCard>
        </div>
        <div v-else-if="result.numOfResults === 0" class="flex-c">
          <div class="non-result-title">
            找不到你搜尋的課程，請重新搜尋
          </div>
        </div>
      </div>
      <div style="height: 120px;"></div>
    </div>
  </div>
</template>

<script>
// import Row from '@/components/CourseRow'
// import Card from '@/components/CourseCard'
// TODO 清除舊有邏輯
// TODO Skeleton 樣式
// TODO 加入比課 卡片中的的圖片不見
import LongCard from '@/components/CourseAbbrCard.vue'
import infiniteLoad from '@/mixin/infiniteLoad.js'
import { mapState } from 'vuex'
// import EmptyLongCard from '@/components/EmptyLongCard'
import { category as category_list } from '@/info/category'
// import Search from '@/components/Search.vue'
// import { info } from '@/info/meta'

export default {
  name: 'course',

  mixins: [infiniteLoad],

  components: {
    // Row,
    // Card,
    // EmptyLongCard,
    // Search,
    LongCard,
    // InfiniteLoading,
  },

  // metaInfo() {
  //   return {
  //     title: `好課比 - ${this.pageTitle}`,
  //     meta: [
  //       {
  //         property: 'title',
  //         content: `好課比 - ${this.pageTitle}`,
  //         vmid: 'title',
  //       },
  //       {
  //         property: 'og:title',
  //         content: `好課比 - ${this.pageTitle}`,
  //         vmid: 'og:title',
  //       },
  //       {
  //         property: 'description',
  //         content: info.description,
  //         vmid: 'description',
  //       },
  //       {
  //         property: 'og:description',
  //         content: info.description,
  //         vmid: 'og:title',
  //       },
  //       {
  //         property: 'keywords',
  //         content: info.keywords,
  //         vmid: 'keywords',
  //       },
  //       {
  //         property: 'og:url',
  //         content: window.location.href,
  //         vmid: 'og:url',
  //       },
  //       {
  //         property: 'og:image',
  //         content: 'https://howcobe.com/img.png',
  //       },
  //     ],
  //   }
  // },

  // jsonld() {
  //   return this.result.courses.map((course, index) => ({
  //     '@context': 'https://schema.org',
  //     '@type': 'ItemList',
  //     url: 'https://howcobe.com',
  //     itemListElement: [
  //       {
  //         '@type': 'ListItem',
  //         position: index + 1,
  //         item: {
  //           '@type': 'Course',
  //           url: `https://howcobe.com/detail?id=${course.id}&platform=${course.platform}`,
  //           name: course.title,
  //           description: course.description,
  //           provider: {
  //             '@type': 'Organization',
  //             name: course.lecturers[0].name,
  //           },
  //         },
  //       },
  //     ],
  //   }))
  // },
  data() {
    return {
      platform_list: [
        'Hahow',
        'Udemy',
        'Yotta',
        'Hiskio',
        '六角學院',
        'Tibame',
      ],
      result: {
        courses: [],
        currentPage: 0,
        numOfResults: -1,
        pages: 1,
      },
      // 1. 搜尋關鍵字 網址
      // 2. 排序方式：熱門，最新，好評，推薦
      // 3. 分類：全部課程，
      form: {
        limit: 12,
        page: 1,
        search: '',
        sortvalue: '',
        sortway: 'DESC',
        category: '',
      },
      showCourse: true,
      category: '',

      categoryIndex: 0,
      category_list,
      tabIndex: 0,
      tab_list: [
        {
          name: '全部',
          type: '',
        },
        {
          name: '熱門',
          type: 'consumers',
        },
        {
          name: '最新',
          type: 'published_at',
        },
        {
          name: '好評',
          type: 'avg_rating',
        },
      ],
    }
  },

  watch: {
    $route() {
      this.getCourse()
    },

    search() {
      this.getCourse()
    },

    sortvalue() {
      this.getCourse()
    },

    category() {
      this.getCourse()
    },
  },

  computed: {
    // meta tag 使用
    pageTitle() {
      let title = '課程列表'
      if (this.sortvalue) {
        switch (this.sortvalue) {
          case 'consumers':
            title = '熱門課程'
            break
          case 'published_at':
            title = '最新課程'
            break
          case 'avg_rating':
            title = '好評課程'
            break
          default:
            title = '熱門課程'
            break
        }
      }

      if (this.category.value) {
        title = '課程分類 | ' + this.category.label
      }

      return title
    },

    sortvalue() {
      return this.tab_list[this.tabIndex]
    },

    // category() {
    //   return this.$route.query.category
    // },

    ...mapState('course', ['compare_list']),
    ...mapState(['pattern', 'search']),

    compareCount() {
      return this.compare_list.length === 5 ? 'max' : this.compare_list.length
    },
  },

  async mounted() {
    if (this.$route.query.category) {
      this.category = this.$route.query.category
    }
    if (this.$route.query.search) {
      this.$store.commit('updateSearch', this.$route.query.search)
    } else {
      await this.getCourse()
    }
    // window.addEventListener('scroll', this.onScroll, false)
  },

  methods: {
    // 模式切換
    toSearch() {
      this.$store.commit('setPattern', 'normal')
    },

    toCompare() {
      this.$store.commit('setPattern', 'compare')
    },

    changeSortValue(index) {
      this.tabIndex = index
    },

    changeCategory(category) {
      this.form.page = 1
      this.result = {
        numOfResults: 0,
        courses: [],
      }
      this.category = category.value
      // this.categoryIndex = index
    },

    // transCategory(val) {
    //   switch (val) {
    //     case 'language':
    //       val = 'language&academics'
    //       break
    //     case 'investment':
    //       val = 'investment&growth'
    //       break
    //     default:
    //       break
    //   }
    //   return val
    // },

    // 無限 scroll 用
    async addCourse() {
      if (this.search) {
        this.form.search = this.search
      }

      if (this.category) {
        this.form.category = this.category.value
      }
      if (this.sortvalue) {
        this.form.sortvalue = this.sortvalue.type
      }
      const addon = await this.$store.dispatch('course/searchCourse', {
        ...this.form,
      })
      this.result = {
        ...addon,
        courses: [...this.result.courses, ...addon.courses],
      }
    },
    async getCourse() {
      this.result = {
        courses: [],
        currentPage: 0,
        numOfResults: -1,
        pages: 1,
      }
      this.form.page = 1
      this.form.limit = 12
      // switch (this.type) {
      //   case 'hot':
      //     addon = await this.$store.dispatch('course/getHotCourse', {
      //       ...this.form,
      //     })
      //     break
      //   case 'new':
      //     addon = await this.$store.dispatch('course/getNewCourse', {
      //       ...this.form,
      //     })
      //     break
      //   case 'fivestar':
      //     addon = await this.$store.dispatch('course/getFiveStarCourse', {
      //       ...this.form,
      //     })
      //     break
      //   case 'interests':
      //     addon = await this.$store.dispatch('course/getInterestsCourse', {
      //       ...this.form,
      //     })
      //     break
      //   case 'course':
      //     if (this.$route.query.search) {
      //       this.form.search = this.$route.query.search
      //     }

      //     if (this.$route.query.category || this.$route.query.category === '') {
      //       this.form.category = this.transCategory(this.$route.query.category)
      //     }
      //     addon = await this.$store.dispatch('course/searchCourse', {
      //       ...this.form,
      //     })
      //     break

      //   default:
      //     if (this.$route.query.search) {
      //       this.form.search = this.$route.query.search
      //     }

      //     if (this.$route.query.category) {
      //       this.form.category = this.transCategory(this.$route.query.category)
      //     }
      //     addon = await this.$store.dispatch('course/searchCourse', {
      //       ...this.form,
      //     })
      //     break
      // }
      this.form.search = this.search
      // if (this.search) {
      // }

      if (this.category) {
        this.form.category = this.category
      }
      if (this.sortvalue) {
        this.form.sortvalue = this.sortvalue.type
      }

      const addon = await this.$store.dispatch('course/searchCourse', {
        ...this.form,
      })
      this.result = {
        ...addon,
        courses: [...this.result.courses, ...addon.courses],
      }
    },

    // async getSearchCourse() {
    //   this.form.page = 1
    //   this.$router.replace({ path: '/course', query: { type: 'course' } })
    //   this.result = await this.$store.dispatch('course/searchCourse', {
    //     ...this.form,
    //   })
    // },
    // async getHotCourse() {
    //   this.form.search = ''
    //   this.form.page = 1
    //   this.$router.replace({ path: '/course', query: { type: 'hot' } })
    //   this.result = await this.$store.dispatch('course/getHotCourse', {
    //     ...this.form,
    //   })
    // },

    // async getNewCourse() {
    //   this.form.search = ''
    //   this.form.page = 1
    //   this.$router.replace({ path: '/course', query: { type: 'new' } })
    //   this.result = await this.$store.dispatch('course/getNewCourse', {
    //     ...this.form,
    //   })
    // },

    // async getFiveStarCourse() {
    //   this.form.search = ''
    //   this.form.page = 1
    //   this.$router.replace({ path: '/course', query: { type: 'fivestar' } })
    //   this.result = await this.$store.dispatch('course/getFiveStarCourse', {
    //     ...this.form,
    //   })
    // },

    // async getInterestsCourse() {
    //   this.form.search = ''
    //   this.form.page = 1
    //   this.$router.replace({ path: '/course', query: { type: 'interests' } })
    //   this.result = await this.$store.dispatch('course/getInterestsCourse', {
    //     ...this.form,
    //   })
    // },

    // onScroll() {
    // const scrollTop =
    //   document.documentElement.scrollTop || document.body.scrollTop
    // if (scrollTop >= window.innerHeight * 0.2) {
    //   this.$store.commit('setViewIndex', 2)
    // } else {
    //   this.$store.commit('setViewIndex', 1)
    // }
    // },

    // shuffle() {
    //   this.list = _.shuffle(this.list)
    // },
  },

  destory() {
    // this.$store.commit('setHotCourse', [])
    // this.$store.commit('setNewCourse', [])
    // this.$store.commit('setFiveStarCourse', [])
    // window.removeEventListener('scroll', this.onScroll, false)
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.course {
  // padding-top: 98px;
  padding: 0;
  height: calc(100vh - 60px - 63px);
  // position: absolute;
  margin-top: 60px;
  margin-bottom: 63px;
  // z-index: 2;
  overflow-y: scroll;
}

.sidebar {
  width: 26%;
  height: calc(100vh - 60px - 63px);
  padding: 0 8px 0 16px;
  padding-bottom: 200px;
  background: #f9f9f9;
  top: 60px;
  left: 0;
  z-index: 10;
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.sidebar-item {
  font-size: size-m(14);
  min-width: 50px;
  line-height: 100%;
  text-align: left;
  letter-spacing: 0.02em;
  color: #000;
  margin-top: 30px;
  position: relative;
  &.active {
    &::after {
      content: '';
      width: 100%;
      border-bottom: 3px solid #f9d849;
      position: absolute;
      bottom: -8px;
      left: 0;
    }
  }
}

.course-container {
  width: 74%;
  padding: 12px;
  margin: 0;
  position: relative;
}

.pagination {
  margin: 20px auto;
}

.form {
  // top: 0;
  // left: 0;
  // right: 0;
  // margin: 0 auto;
}

.tab {
  width: size(260);
  z-index: 20;
  left: 0;
  right: 0;
  margin: 0 auto size(15);
  .tab-list {
    position: relative;
    width: 100%;
  }
  .tab-item {
    color: #fff;
    cursor: pointer;
    font-size: size(24);
    letter-spacing: size(2);
    position: relative;
    padding: 0 size(10);
    // z-index: 2;
  }

  .tab-dot {
    width: 30px;
    height: 30px;
    background-color: #ff0000;
    color: #fff;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: -20px;
    top: -20px;
    font-size: 13px;
  }

  .bottom-line {
    position: absolute;
    bottom: size(-10);
    left: 0;
    width: size(95);
    height: 5px;
    background: #f9d849;
    transition: left 0.3s;

    &.right {
      left: size(163);
    }
  }
}

.dark {
  background: #2c2b45;
  .fix-searchbar {
    background: linear-gradient(93.1deg, #ffcb02 0%, #ffa902 84.41%);
  }

  .tab {
    .bottom-line {
      background: #2c2b45;
    }
  }

  .non-result-title {
    font-size: 20px;
    color: #eee;
    margin-top: 100px;
    padding: 0 20px;
    line-height: 1.3;
    text-align: center;
  }
}

.fix-searchbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  // height: size(140);
  padding: 30px 0 20px;
  background: rgba(3, 7, 30, 0.7);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.search-content {
  width: 1258px;
  margin: 0 auto;
}

.categorys {
  width: 688px;
  .btn {
    padding: 0 20px;
    margin-bottom: 15px;
  }
}

.search {
  // position: absolute;
  position: relative;
  // top: size(17);
  left: 0;
  right: 0;
  width: size(345);
  height: size(67);
  margin: 0 auto;
  z-index: 20;
}

.filter-block {
  margin-bottom: 30px;
}

.card-container {
  opacity: 0;
  transition: 0.3s;
  &.show {
    opacity: 1;
  }
}

.card-wrap {
  width: calc(50% - 20px);
  margin: 30px 10px;
}

.label {
  display: none;
}

.non-result-title {
  font-size: 24px;
  color: #888;
  margin-top: 100px;
}

/* 螢幕尺寸標準 */
/* 小電腦尺寸 */
@media only screen and (min-device-width: 1025px) and (max-device-width: 1280px) {
}

/* 螢幕尺寸標準 */
/* 平板尺寸 */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
}

/* 螢幕尺寸標準 */
/* 手機尺寸 */
@media screen and (max-width: 767px) {
  .container {
    padding-top: 20px;
  }
  .filter-block {
    display: block;
  }
  .left {
    width: 100%;
    height: auto;
  }

  .right {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .el-select {
    margin-bottom: 20px;
    margin-right: 0;
    width: 100%;
  }

  .card-wrap {
    width: 100%;
    margin: 0px;
    margin-bottom: 5px;
  }

  .el-button-group {
    width: 100%;

    &::v-deep {
      .el-button {
        width: 33.33%;
      }
    }
  }

  .label {
    display: block;
    width: 100%;
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
}
</style>
