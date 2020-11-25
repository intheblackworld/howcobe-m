
<template>
  <div class="dialog">
    <div class="dialog-header dark">
      <div class="flex-jb flex-ac head">
        <div class="back-btn" @click="$emit('closeDialog')">
          <font-awesome :icon="['fa', 'chevron-left']" />
        </div>
        <div class="dialog-head flex-ac flex-jb">
          <div class="head-title">課程比拼</div>
          <div class="yellow round-big middle btn flex-c" @click="showVoteDialog" v-show="compare_list.length >= 2">發起投票</div>
          <div class="flex-ac flex-jb">
            <!-- TODO 發起投票流程 -->
            <!-- 1. search-compare-course 存入比較課程的搜尋紀錄 使用這隻API 回傳的 id -->
            <!-- 2. 拿此 id 發起投票 -->
            <!-- 3. vote-compare-course 發起比較課程的投票 -->

            <!-- TODO 投票流程 -->
            <!-- vote-vcc 投票 API -->
            <!-- "id":"a372509a-6646-454a-9308-2eae343907de", // 所選課程
            "choice_index":1, // 排序
            "vote_compare_courses_id":"24bd5237-6af9-44f1-98e4-0b59ce60a6ba", // 該投票id
            "courses_id": [ // 參與投票的課程選項
            "bb9edc43-284f-4354-bcd9-2986f1cc285a",
            "a372509a-6646-454a-9308-2eae343907de"
            ] -->
            <!-- <div class="share-btn" @click="share(current)">
              <font-awesome :icon="['fa', 'external-link-alt']" />
            </div> -->
            <div class="collect-btn" @click="addCompareToCollect" v-show="compare_list.length >= 2">
              <!-- 空心 -->
              <font-awesome :icon="['far', 'heart']" />
            </div>

          </div>
          <!-- <div class="flex-ac flex-jb">
            <div class="head-btn">更多投票</div>
            <img src="../section/chevron-right.png" alt="" class="head-chevron">
          </div> -->
        </div>
      </div>
      <div class="head-mao flex-ac flex-ja">
        <div :class="`head-tab ${type === index ? 'active' : ''}`" v-for="(tab, index) in tabList" :key="`compare-dialog-tab-${tab.name}`" @click="type = index">
          {{tab.name}}
          <div class="bottom-line"></div>
        </div>
      </div>
    </div>
    <!-- <div :class="`search-list ${searchResult.length > 0 ? 'show' : ''}`">
      <div class="search-list-title">搜尋結果</div> -->
    <!-- <div class="search-head flex-ac">
        <div class="search-td"><span class="red">加入比課</span></div>
        <div class="search-td">課程平台</div>
        <div class="search-td">課程評分</div>
        <div class="search-td">課程價格</div>
      </div> -->
    <!-- <div
        class="search-row flex-ac wrap"
        v-for="(result, index) in searchResult"
        :key="`${result.title}-${index}`"
      >
        <img
          :src="result.coverImage"
          alt=""
          class="cover"
        >
        <img
          :src="require(`@/assets/img/${result.platform}.png`)"
          alt=""
          class="platform-img"
        >
        <div class="title">{{result.title}}</div>
        <div class="rate flex-ac">
          <el-rate
            v-model="result.avg_rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template=""
          >
          </el-rate>
          <div class="card-rating">
            ({{result.consumers === -1 ? '???' : (result.consumers === 0 ? '暫無評價' : result.consumers)}})
          </div>
        </div>
        <div class="price">${{result.price}}</div>
        <div
          class="go-btn"
          @click="$router.push({path: 'detail', query: { id: result.id, platform: result.platform}})"
        >
          詳細內容
          <el-button
            icon="el-icon-right"
            circle
            :disabled="$store.state.isFetchingData"
          ></el-button>
        </div> -->
    <!-- 加入比課的特殊案例， 這裡的資料從quick_list來，沒有章節的資料，傳_id, 在 addCompare另外做處理 -->
    <!-- <div
          class="add-btn"
          @click="addCompare(result.id)"
        >
          加入比課
          <el-button
            icon="el-icon-plus"
            circle
            :disabled="$store.state.isFetchingData"
          ></el-button>
        </div>
      </div>
      <router-link
        class="link flex-c"
        v-if="searchResult.length === 5"
        :to="`course?type=course&search=${searchVal}`"
      >查看更多</router-link>
      <div class="flex-c">
        <div
          v-if="compare_list.length >= 2"
          class="more-link flex-c"
          @click="beginCompare"
        >開始比課</div>
      </div>
    </div> -->
    <div>
      <Compare :type="type" @closeDialog="$emit('closeDialog')" />
    </div>
    <!-- <div class="flex-c">
      <div
        class="more-link flex-c"
        @click="addCompareToCollect"
        v-show="compare_list.length >= 2"
      >收藏此比課</div>
    </div>
    <div
      class="toggle-btn flex-c"
      @click="toggleType"
      v-show="compare_list.length >= 2"
    >{{type === 0 ? '章節比較' : '課程簡介'}}</div> -->
    <VoteDialog v-if="isVoteDialog" @closeDialog="isVoteDialog = false" />
  </div>

</template>

<script>
import Compare from '@/components/Compare.vue'
import { mapState } from 'vuex'
import { addCompareStack, addCollectCompare } from '@/http/api'
import VoteDialog from '@/components/Dialog/VoteDialog.vue'

export default {
  data() {
    return {
      searchVal: '',
      type: 0,
      isVoteDialog: false,
      tabList: [
        {
          name: '重點整理',
        },
        {
          name: '章節比較',
        },
        {
          name: '其他資訊',
        },
        // {
        //   name: '適合對象',
        // },
        // {
        //   name: '課程目標',
        // },
      ],
    }
  },

  components: {
    Compare,
    VoteDialog,
  },

  computed: {
    searchResult() {
      if (!this.searchVal) {
        return []
      } else {
        return this.searchReg(
          this.$store.state.course.quick_list,
          this.searchVal,
        )
      }
    },
    ...mapState('course', ['compare_list', 'compare_course_id']),
  },

  watch: {
    '$store.state.course.compare_list': function (list) {
      if (list.length >= 2) {
        this.beginCompare()
      }
    },
  },

  methods: {
    showVoteDialog() {
      this.isVoteDialog = true
    },
    focus() {
      this.$emit('focusSearch')
    },

    searchReg(list, val) {
      return list
        .filter((item) => item.title.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5)
    },

    // addCompare(result) {
    //   this.$store.dispatch('course/addCompareCourse', result)
    // },

    addCompareToCollect() {
      addCollectCompare(this.compare_course_id).then(() => {
        this.$message({
          message: '已收藏此列表',
          type: 'success',
        })
        this.isVoteDialog = false
        // this.$store.commit('course/setCompareCourse', [])
      })
    },

    // searchByEnter(e) {
    //   if (e.keyCode === 13) {
    //     this.$router.push(`course?type=course&search=${this.searchVal}`)
    //   }
    // },

    clearSearch() {
      this.searchVal = ''
    },

    beginCompare() {
      this.searchVal = ''
      addCompareStack({
        course_ids: this.compare_list.map((item) => item.id),
      }).then((res) => {
        this.$store.commit('course/setCompareId', res.documents._id)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.dialog {
  width: 100vw;
  height: 100vh;
  // background-color: #f2f2f2;
  position: absolute;
  top: 0;
  z-index: 100;
  // overflow-y: scroll;
}

.dialog-header {
  background: #1a192e; /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  // height: 100px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;

  .head {
    width: 100vw;
    margin: 0 auto;
    display: block;
  }

  .head-mao {
    height: 36px;
    background-color: #fff;
    .head-tab {
      color: #000;
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
  }

  .dialog-title {
    font-size: 36px;
    color: #fff;
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
    // display: none;
  }

  .dialog-desc {
    color: #eee;
    font-size: 16px;
    text-align: center;
  }

  .close {
    display: none;
  }
  .clear {
    opacity: 0.5;
    width: 14px;
    position: absolute;
    right: 26vw;
    top: 108px;
    cursor: pointer;
  }

  .head-title {
    margin-left: 40px;
    font-size: 18px;
  }
}
.search-input {
  outline: none;
  width: 50vw;
  height: 48px;
  display: block;
  border: none;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 14px;
  padding: 0 15px;
  color: #333;
  margin: 0 auto;
  font-weight: 300;
}

.search-list {
  width: 100vw;
  background-color: #fff;
  opacity: 0;
  height: auto;
  transition: all 0.3s;
  transform: translateY(70px);
  position: absolute;
  box-shadow: 0 300px 10px 300px rgba(0, 0, 0, 0.5);
  &.show {
    z-index: 2;
    opacity: 1;
    padding-top: 0px;
    transform: translateY(0px);
  }
}

.search-list-title {
  color: #666;
  font-size: size(18);
  padding: 15px;
  width: 60vw;
  margin: 0 auto;
}

.search-head {
  height: 2.5rem;
  border-bottom: 2px solid #ccc;
}

.search-row {
  width: 60vw;
  margin: 0 auto;
  height: auto;
  padding: 15px 0;
  border-bottom: 1px solid #f1f1f1;
  position: relative;
}

.platform-img {
  margin-left: 20px;
  margin-right: 15px;
}
.cover {
}
.title {
  font-size: size(24);
  line-height: 1.5;
  width: 40%;
  padding-right: 20px;
  display: inline-block;
  vertical-align: top;
  min-height: 3.5rem;
}

.rate {
  margin-left: 20px;
  margin-right: 10px;
  font-size: size(17);
  margin-top: 15px;
}

.price {
  color: #358af3;
  font-size: 20px;
  font-size: size(22);
  margin-top: 15px;
}

.go-btn {
  position: absolute;
  right: 20px;
  bottom: 45px;
  color: #333;
  font-size: 18px;
  cursor: pointer;
}

.add-btn {
  position: absolute;
  right: 20px;
  bottom: 10px;
  color: #ce0000;
  font-size: 18px;
  cursor: pointer;
}

.gray {
  color: #999;
  font-size: 18px;
}

.red {
  color: #ce0000;
  font-size: 16px;
}

.platform-img {
  width: 40px;
}

.card-rating {
  margin-left: 5px;
}

.el-rate {
  width: 100%;
  white-space: nowrap;
}

.el-button {
  width: 25px;
  height: 25px;
  padding: 0 !important;
}

.link {
  color: #358af3;
  margin: 20px 0;
  font-size: 18px;
  letter-spacing: 1px;
}

.more-link {
  color: #fff;
  background-color: #ce0000;
  margin: 20px;
  font-size: 18px;
  letter-spacing: 1px;
  padding: 20px;
  width: 20vw;
  cursor: pointer;
}

.toggle-btn {
  position: fixed;
  right: 0;
  top: 300px;
  width: 65px;
  padding: 5px 5px 5px 10px;
  color: #fff;
  background-color: #333;
  font-size: 18px;
  line-height: 1.2;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  cursor: pointer;
  user-select: none;
}

.collect-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #fff;
  z-index: 2;
  width: 25px;
  height: 25px;
  svg {
    width: 100%;
    height: 100%;
  }
}

.share-btn {
  position: absolute;
  right: 48px;
  top: 10px;
  color: #fff;
  z-index: 2;
  width: 25px;
  height: 25px;
  svg {
    width: 100%;
    height: 100%;
  }
}

.back-btn {
  position: absolute;
  left: 10px;
  top: 10px;
  color: #fff;
  z-index: 2;
  width: 25px;
  height: 25px;
  svg {
    width: 100%;
    height: 100%;
  }
}
/* 螢幕尺寸標準 */
/* 平板尺寸 */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  html,
  body {
    overflow-x: hidden;
    *::-webkit-scrollbar {
      display: none;
    }
  }
}

/* 螢幕尺寸標準 */
/* 手機尺寸 */
@media screen and (max-width: 767px) {
  .dialog {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    position: fixed;
    top: 0;
    z-index: 100;
    overflow-y: scroll;
  }

  .dialog-header {
    // background-color: #358af3;
    width: 100%;
    // padding-top: 15px;

    .head {
      display: flex;
      height: 48px;
    }

    .dialog-title {
      font-size: size-m(18);
      color: #fff;
      width: 100%;
      text-align: center;
    }

    .dialog-desc {
      display: none;
    }

    .close {
      width: 24px;
      position: absolute;
      left: 3vw;
      display: block;
    }
    .clear {
      opacity: 0.5;
      width: 14px;
      position: absolute;
      right: 5vw;
      top: 75px;
    }
  }
  .search-input {
    outline: none;
    width: 95vw;
    height: 48px;
    display: block;
    border: none;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-size: 14px;
    padding: 0 15px;
    color: #333;
    margin: 0 auto;
    font-weight: 300;
  }

  .search-list {
    background-color: #fff;
    opacity: 0;
    height: auto;
    transition: all 0.3s;
    transform: translateY(70px);
    position: relative;
    &.show {
      z-index: 2;
      opacity: 1;
      padding-top: 0px;
      transform: translateY(0px);
    }
  }

  .search-list-title {
    color: #666;
    font-size: size-m(14);
    padding: 15px;
    width: 100vw;
  }

  .search-head {
    height: 2.5rem;
    border-bottom: 1px solid #ccc;
  }

  .search-row {
    height: auto;
    padding: 10px 0;
    border-bottom: 1px solid #f1f1f1;
    position: relative;
    width: 100vw;
  }

  .platform-img {
    margin-left: 20px;
    margin-right: 15px;
  }
  .cover {
  }
  .title {
    font-size: size-m(14);
    line-height: 1.5;
    width: 75%;
    padding-right: 20px;
    display: inline-block;
    vertical-align: top;
    min-height: 3.5rem;
  }

  .rate {
    margin-left: 20px;
    margin-right: 10px;
    font-size: size-m(12);
    margin-top: 15px;
  }

  .price {
    color: #358af3;
    font-size: 20px;
    font-size: size-m(16);
    margin-top: 15px;
  }

  .go-btn {
    position: absolute;
    right: 20px;
    bottom: 45px;
    color: #333;
    font-size: size-m(13);
  }

  .add-btn {
    position: absolute;
    right: 20px;
    bottom: 10px;
    color: #ce0000;
    font-size: size-m(13);
  }

  .gray {
    color: #999;
    font-size: 18px;
  }

  .red {
    color: #ce0000;
    font-size: 16px;
  }

  .platform-img {
    width: 40px;
  }

  .card-rating {
    margin-left: 5px;
  }

  .el-rate {
    width: 100%;
    white-space: nowrap;
  }

  .el-button {
    width: 25px;
    height: 25px;
    padding: 0 !important;
  }

  .more-link {
    margin: 20px 0;
    font-size: 18px;
    letter-spacing: 1px;
    padding: 15px 25px;
    width: 100vw;
  }
}
</style>
