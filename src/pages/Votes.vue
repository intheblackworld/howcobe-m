<template>
  <div :class="`vote main flex-jr`">
    <div class="loading-text flex-c" v-if="busy">
      <div class="hint">資料讀取中</div>
    </div>
    <div class="tab-container fixed frost dark flex-js flex-ac">
      <div :class="`tab-item ${category.value === form.category ? 'active' : ''}`" v-for="category in category_list" :key="category.value" @click="changeCategory(category)">
        {{category.label}}
      </div>
    </div>
    <div class="vote-container">
      <div v-infinite-scroll="() => loadMore(result.currentPage, result.pages)" :infinite-scroll-disabled="busy" infinite-scroll-distance="50">
        <div v-if="result.numOfResults > 0">
          <!-- <div class="card-wrap" v-for="item in result.votes" :key="item.title">
          <Card :inRow="false" :item="item" />
        </div> -->
          <LongCard :inRow="false" :vote="vote" v-for="vote in result.votes" :key="vote.id"></LongCard>
        </div>
        <div v-else-if="result.numOfResults === 0" class="flex-c">
          <div class="non-result-title">
            找不到你搜尋的投票，請重新搜尋
          </div>
        </div>
      </div>

      <!-- <el-pagination v-if="result.numOfResults > 0" class="pagination flex-c" background layout="prev, pager, next" :total="result.numOfResults" :page-size="form.limit" :current-page="Number(result.currentPage)" @current-change="changePage">
      </el-pagination> -->
    </div>

  </div>
</template>

<script>
// import Row from '@/components/CourseRow'
// import Card from '@/components/CourseCard'
// TODO 清除舊有邏輯
// TODO Skeleton 樣式
// TODO 加入比課 卡片中的的圖片不見
import infiniteLoad from '@/mixin/infiniteLoad.js'
import LongCard from '@/components/VoteLongCard'
import { mapState, mapGetters } from 'vuex'
// import InfiniteLoading from 'vue-infinite-loading'
// import EmptyLongCard from '@/components/EmptyLongCard'
import { vote_category as category_list } from '@/info/category'
// import Search from '@/components/Search.vue'
import { info } from '@/info/meta'
import _ from 'lodash'

export default {
  name: 'votes',

  mixins: [infiniteLoad],

  components: {
    // Row,
    // Card,
    // EmptyLongCard,
    // Search,
    LongCard,
    // InfiniteLoading,
  },

  metaInfo() {
    return {
      title: `好課比 - ${this.pageTitle}`,
      meta: [
        {
          property: 'title',
          content: `好課比 - ${this.pageTitle}`,
          vmid: 'title',
        },
        {
          property: 'og:title',
          content: `好課比 - ${this.pageTitle}`,
          vmid: 'og:title',
        },
        {
          property: 'description',
          content: info.description,
          vmid: 'description',
        },
        {
          property: 'og:description',
          content: info.description,
          vmid: 'og:title',
        },
        {
          property: 'keywords',
          content: info.keywords,
          vmid: 'keywords',
        },
        {
          property: 'og:url',
          content: window.location.href,
          vmid: 'og:url',
        },
        {
          property: 'og:image',
          content: 'https://howcobe.com/img.png',
        },
      ],
    }
  },

  // jsonld() {
  //   return this.result.votes.map((course, index) => ({
  //     '@context': 'https://schema.org',
  //     '@type': 'ItemList',
  //     url: 'https://howcobe.com',
  //     itemListElement: [
  //       {
  //         '@type': 'ListItem',
  //         position: index + 1,
  //         // item: {
  //         //   '@type': 'Course',
  //         //   url: `https://howcobe.com/detail?id=${course.id}&platform=${course.platform}`,
  //         //   name: course.title,
  //         //   description: course.description,
  //         //   provider: {
  //         //     '@type': 'Organization',
  //         //     name: course.lecturers[0].name,
  //         //   },
  //         // },
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
        votes: [],
        currentPage: 0,
        numOfResults: -1,
        pages: 1,
      },

      form: {
        limit: 12,
        page: 1,
        search: '',
        category: 'all',
      },
      showCourse: true,
      pageIndex: 1,

      category: 'all',
      category_list,
      tabIndex: 0,
      tab_list: [
        {
          name: '熱門',
          type: 'hot',
        },
        {
          name: '最新',
          type: 'new',
        },
        {
          name: '好評',
          type: 'fivestar',
        },
      ],
    }
  },

  watch: {
    $route() {
      this.getVotes()
    },
    search() {
      this.getVotes()
    },
    category() {
      this.getVotes()
    },
  },

  computed: {
    pageTitle() {
      let title = '課程列表'
      if (this.$route.query.type) {
        switch (this.$route.query.type) {
          case 'hot':
            title = '熱門課程'
            break
          case 'new':
            title = '最新課程'
            break
          case 'fivestar':
            title = '好評課程'
            break
          default:
            title = '熱門課程'
            break
        }
      }

      if (this.$route.query.category) {
        const category = this.transCategory(this.$route.query.category)
        const label = _.find(category_list, { value: category }).label || ''
        title = '課程分類：' + label
      }

      return title
    },
    // typeTitle() {
    // let title = ''
    // switch (this.$route.query.type) {
    //   case 'hot':
    //     title = '熱門課程'
    //     break
    //   case 'new':
    //     title = '最新課程'
    //     break
    //   case 'fivestar':
    //     title = '好評課程'
    //     break
    //   default:
    //     title = '熱門課程'
    //     break
    // }
    // return title
    // },

    type() {
      return this.$route.query.type || 'course'
    },

    ...mapState('vote', ['vote_list']),
    ...mapState(['pattern', 'search']),

    ...mapGetters('user', ['isLogin', 'hasInterest']),
  },

  async mounted() {
    await this.getVotes()
    // if (this.isLogin && this.hasInterest) {
    //   this.tab_list = [
    //     {
    //       name: '熱門',
    //       type: 'hot',
    //     },
    //     {
    //       name: '最新',
    //       type: 'new',
    //     },
    //     {
    //       name: '好評',
    //       type: 'fivestar',
    //     },
    //     {
    //       name: '推薦',
    //       type: 'suggest',
    //     },
    //   ]
    // } else {
    //   this.tab_list = [
    //     {
    //       name: '熱門',
    //       type: 'hot',
    //     },
    //     {
    //       name: '最新',
    //       type: 'new',
    //     },
    //     {
    //       name: '好評',
    //       type: 'fivestar',
    //     },
    //   ]
    // }
    // window.addEventListener('scroll', this.onScroll, false)
  },

  methods: {
    // search(val) {
    //   // if (!this.form.search && !this.form.category) {
    //   //   return
    //   // }

    //   this.getSearchCourse()
    // },

    changePage(val) {
      this.form.page = val
      this.getVotes()
    },

    changeCategory(category) {
      this.form.page = 1
      this.result = {
        numOfResults: 0,
        votes: [],
      }
      this.category = category.value
      this.form.category = category.value
    },

    // infiniteHandler() {
    //   this.changePage()
    // },

    transCategory(val) {
      switch (val) {
        case 'language':
          val = 'language&academics'
          break
        case 'investment':
          val = 'investment&growth'
          break
        default:
          break
      }
      return val
    },

    async getVotes() {
      this.result = {
        votes: [],
        currentPage: 0,
        numOfResults: -1,
        pages: 1,
      }
      this.form.page = 1
      this.form.limit = 12
      if (this.search) {
        this.form.search = this.search
      }

      if (this.category) {
        this.form.category = this.category
      }
      if (this.sortvalue) {
        this.form.sortvalue = this.sortvalue.type
      }
      // switch (this.type) {
      //   default:
      //     if (this.$route.query.search) {
      //       this.form.search = this.$route.query.search
      //     }

      // if (this.$route.query.category) {
      //   this.form.category = this.transCategory(this.$route.query.category)
      // }
      const addon = await this.$store.dispatch('vote/getVotes', {
        ...this.form,
      })
      // }
      this.result = {
        ...addon,
        votes: [...this.result.votes, ...addon.voteCompareCourses],
      }
    },

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
    // window.removeEventListener('scroll', this.onScroll, false)
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.vote {
  padding: 0;
  height: calc(100vh - 60px - 63px);
  position: absolute;
  top: 60px;
  bottom: 63px;
  z-index: 2;
  padding-bottom: 60px;
  // transition: all 0.4s;
  overflow-y: scroll;
}

.vote-container {
  width: 100%;
  padding: 40px 0 120px;
  margin: 0;

  &.full {
    width: 100%;
    padding: 60px 0;
  }
}

.tab-container {
  width: 100vw;
  height: 38px;
  top: 60px;
  left: 0;
  z-index: 10;
  overflow-x: scroll;
  padding: 0 20px;
  // background-color: rgba(12, 23, 47, 0.7);
}

.tab-item {
  display: inline-block;
  min-width: 80px;
  margin-right: 20px;
  font-size: size-m(16);
  line-height: 100%;
  text-align: center;
  letter-spacing: 0.02em;
  color: #fff;
  position: relative;
  white-space: nowrap;
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
    background: linear-gradient(93.1deg, #439da0 0%, #82d6c4 84.41%);
  }

  .tab {
    .bottom-line {
      background: #2c2b45;
    }
  }

  .non-result-title {
    color: #eee;
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
  font-size: 20px;
  color: #888;
  margin-top: 100px;
  padding: 0 20px;
  line-height: 1.3;
  text-align: center;
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
    padding-top: 40px;
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
