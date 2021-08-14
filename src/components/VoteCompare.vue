<template>
  <div class="compare-container flex">
    <div class="compare-side" v-if="type === 0">
      <div class="side-title flex-c"></div>
      <div class="side-title flex-c"></div>
      <div class="side-title flex-c">課程平台</div>
      <div class="side-title flex-c">課程名稱</div>
      <div class="side-title flex-c">課程售價</div>
      <div class="side-title flex-c">上課人數</div>
      <div class="side-title flex-c">課程評價</div>
      <div class="side-title flex-c">課程長度</div>
      <div class="side-title flex-c">上架時間</div>
    </div>
    <div class="compare-side" v-if="type === 1">
      <div class="side-title flex-c"></div>
      <div class="side-title flex-c"></div>
      <div class="side-title flex-c">課程章節</div>
    </div>
    <div class="compare-side" v-if="type === 2">
      <div class="side-title flex-c"></div>
      <div class="side-title flex-c"></div>
      <div class="side-title flex-c">其他資訊</div>
    </div>
    <div class="compare-grid">
      <div class="compare-item" v-for="(item, columnIndex) in voteList" :key="`compare-${columnIndex}`">
        <!-- <div class="close-btn flex-c" @click.stop="removeCompare(item.id)">
          <img src="@/assets/img/close-w.png" alt="" />
        </div> -->
        <div v-if="type === 0">
          <div class="compare-row no-padding">
            <img :src="item.cover_image" alt="" class="compare-img">
          </div>
          <div class="compare-row action">
            <div @click="goDetail(item)" :class="`go-btn absolute blue`">查看課程詳情</div>
          </div>
          <div class="compare-row">
            <img :src="require(`@/assets/img/${item.platform}.png`)" alt="" class="row-platfom">
          </div>
          <div class="compare-row">
            <div class="row-desc">{{item.title.slice(0, 15)}}</div>
          </div>
          <div class="compare-row">
            <div class="row-desc">
              <div class="row-price center">
                {{item.price}}元
              </div>
            </div>
          </div>
          <div class="compare-row">
            <div class="row-desc">
              <div class="row-desc center">
                {{item.consumers}}
              </div>
            </div>
          </div>
          <div class="compare-row">
            <div class="row-desc center">
              <el-rate v-model="item.avg_rating" disabled show-score text-color="#ff9900" score-template="{value}">
              </el-rate>
              <!-- <div class="card-rating">
            ({{item.consumers === -1 ? '???' : (item.consumers === 0 ? '暫無評價' : item.consumers)}})
          </div> -->
            </div>
          </div>
          <div class="compare-row">
            <div class="row-desc">
              <div class="row-desc center">
                {{item.course_time_minute}}分鐘
              </div>
            </div>
          </div>
          <div class="compare-row">
            <div class="row-time">
              {{formatTime(item.published_at)}}
            </div>
          </div>
        </div>
        <div v-else-if="type === 1">
          <img :src="item.cover_image" alt="" class="compare-img">
          <div class="compare-row action">
            <div @click="goDetail(item)" :class="`go-btn absolute blue`">查看課程詳情</div>
          </div>
          <div class="compare-chapter">
            <div v-if="item.chapters.length > 0">
              <el-collapse v-model="activeChapter[columnIndex]" @change="handleToggleChapter">
                <el-collapse-item :title="item.chapters.length === 1 ? chapter.title : (index + 1) + ` ${chapter.title}`" v-for="(chapter, index) in item.chapters" :key="chapter.title + index" :name="index">
                  <div class="chapter-subtitle" v-for="(i, subIndex) in chapter.items" :key="i.content.title + index + subIndex">
                    <span>{{item.chapters.length === 1 ? i.content.title : `${index + 1}-${subIndex + 1}` + ` ${i.content.title}`}}</span>
                    <!-- <span class="time">{{item.content.duration}}</span> -->
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div v-else>
              <div class="empty-desc">
                無章節相關資料
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="type === 2">
          <img :src="item.cover_image" alt="" class="compare-img">
          <div class="compare-row action">
            <div @click="goDetail(item)" :class="`go-btn absolute blue`">查看課程詳情</div>
          </div>
          <div class="compare-other" v-html="formatContentByPlatform(item)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import device from '@/mixin/device.js'
import moment from 'moment'
export default {
  name: 'VoteCompare',

  mixins: [device],

  props: ['type', 'voteList'],

  // props: [], // 0: 課程簡介, 1:章節比較 2:其他資訊
  // 目前分不出來先保留 2: 建議背景 3: 適合對象 4: 課程目標
  computed: {
    // ...mapState('course', ['voteList']),
  },

  data() {
    return {
      activeChapter: [[0], [0], [0], [0]],
    }
  },

  methods: {
    changeTabAndFocus() {
      this.$store.commit('setCompareDialog', false)
    },
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD')
    },
    removeCompare(id) {
      this.$store.commit('course/removeCompareCourse', id)
    },

    handleToggleChapter() {
      // console.log(val)
    },

    goDetail(item) {
      if (this.$route.query.id === item.id) {
        this.$emit('closeDialog')
      } else {
        this.$router.push({ path: '/detail/course', query: { id: item.id, platform: item.platform } })
        this.$emit('closeDialog')
      }
    },

    formatContentByPlatform(item) {
      let content = ''
      switch (item.platform) {
        case 'hahow':
          content = `<div class="block">
            <div class="block-title">
              你將會學到
            </div>
            <pre class="block-desc">${item.willLearn}</pre>
          </div>
          <div class="block">
            <div class="block-title">
              適合對象
            </div>
            <pre class="block-desc">${item.targetGroup}</pre>
          </div>
          <div class="block">
            <div class="block-title">
              建議背景
            </div>
            <pre class="block-desc">${item.recommendedBackground}</pre>
          </div>`
          break
        case 'udemy':
          content = `${item.requirements}${item.will_learn}<div class="block"><div class="block-title">
              課程說明
            </div>
            <pre class="block-desc normal">${item.description}</pre>
          </div>`
          break
        case 'hiskio':
          content = `<div class="block">
            <div class="block-title">
              你將會學到
            </div>
            ${item.learn
              .map((text) => `<pre class="block-desc">${text}</pre>`)
              .join('')}
          </div>
          <div class="block">
            <div class="block-title">
              適合對象
            </div>
            ${item.object
              .map((text) => `<pre class="block-desc">${text}</pre>`)
              .join('')}
          </div>
          <div class="block">
            <div class="block-title">
              建議背景
            </div>
            ${item.knowledge
              .map((text) => `<pre class="block-desc">${text}</pre>`)
              .join('')}
          </div>`
          break
        case 'yotta':
          content = `${item.description.replace(
            /href/g,
            'target="_blank" href',
          )}`
          break
        default:
          content = ''
          break
      }
      return content
    },
  },
}
</script>
<style lang="scss">
@import '~@/assets/style/function.scss';
.block {
  margin-top: size-m(15);
  .block-title {
    font-size: size-m(16);
    margin-bottom: size-m(10);
  }
  .block-desc {
    font-size: size-m(12);
    color: #333;
    line-height: 2;
    width: 100%;
    white-space: pre-line;

    &.normal {
      white-space: normal;
    }
  }
}
.requirements__title,
.what-you-get__title {
  font-size: size-m(16);
  margin: size-m(20) 0 size-m(10);
}

.what-you-get__item,
.requirements__item {
  font-size: size-m(16);
  color: #333;
  line-height: 2;
}

.what-you-get__icon {
  display: none;
}

// yotta
.htmlStyle,
.course-intro-container {
  p {
    margin: 10px 0;
    color: #4c545a;
    line-height: 1.7em;
  }

  .fr-view img {
    margin: 5px auto;
    // display: none;
  }

  .fr-fic.fr-dib {
    display: none;
  }

  .fr-view .fr-video {
    width: 100%;
  }

  .fr-draggable {
    width: 100% !important;
  }

  .fr-view strong {
    display: block;
    font-size: size-m(14);
    line-height: 1.7em;
    font-weight: 700;
    color: #4c545a;
  }
}

.compare-other {
  margin: size-m(14);
  padding-bottom: 120px;

  > div:nth-last-child(1) {
    padding-bottom: 120px;
  }

  .udlite-heading-xl {
    font-size: size-m(16);
    margin-bottom: size-m(5);
    margin-top: size-m(5);
  }
  > * {
    font-size: 16px;
    line-height: 1.2;
  }
  .udlite-icon {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.compare-container {
  width: 100vw;
  position: relative;
  margin: 0 auto;
  background-color: #fefefe;
}

.compare-grid {
  display: grid;
  height: calc(100vh - 64px);
  grid-template-columns: repeat(5, 154px);
  position: fixed;
  top: 85px;
  left: 98px;
  overflow: scroll;
  width: calc(100vw - 98px);
}

.compare-side {
  width: 98px;
  height: calc(100vh - 64px);
  background: #f9f9f9;
  // box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 85px;
  left: 0;
  z-index: 10;
  color: #000;
  display: grid;
  grid-template-columns: 98px;
  grid-template-rows: 110px 2rem repeat(10, 4rem);
}
.compare-item {
  width: 154px;
  // height: calc(100vh - 64px);
  border-right: 1px solid #f1f1f1;
  background-color: #fff;
  position: relative;

  > div:not(.close-btn) {
    display: grid;
    grid-template-rows: 110px 2rem repeat(10, 4rem);
  }

  // &:hover {
  //   .go-btn {
  //     opacity: 1;
  //     top: 50%;
  //   }
  //   .card-mask {
  //     opacity: 1;
  //   }
  // }
}

.compare-img {
  width: 154px;
  height: 110px;
  min-height: 110px;
  object-fit: cover;
  display: block;
}

.compare-row {
  // height: 4rem;
  padding: 0 15px;
  // line-height: 1.2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e1e1e1;

  &.no-padding {
    padding: 0;
  }
}

.row-platfom {
  width: 45px;
  margin: 0px auto;
}

.row-price {
  color: #358af3;
}

.empty {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 240px;
  text-align: center;
  transform: translateY(-50%);
  font-size: 32px;
  white-space: nowrap;
  color: #999;

  > div {
    margin-top: 20px;
  }
}

.card-rating {
  margin-left: 2px;
}

.el-button {
  width: 60px;
  height: 60px;
}
.el-button--primary {
  width: 80%;
  height: 50px;
  margin: 10px auto;
  display: block;
}

.close-btn {
  width: 35px;
  height: 35px;
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 1;
  // display: none;
  border-radius: 999px;
  z-index: 3;
  background-color: rgba(255, 0, 0, 0.7);

  cursor: pointer;
  img {
    width: 50%;
  }
}
// .compare-item {
//   &:hover {
//     .close-btn {
//       display: block;
//     }
//   }
// }

.card-mask {
  width: 100%;
  height: 198px;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transition: opacity 0.3s;
}

.go-btn {
  width: 100%;
  height: 100%;
  // border: 2px solid #01D8F4;
  // color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  // border-radius: 50px / 50px;
  z-index: 2;
  cursor: pointer;
  transition: opacity 0.3s, background-color 0.3s, border 0.3s, top 0.5s;

  &:hover {
    // background-color: #358af3;
    // border: 2px solid #358af3;
    // color: #fff;
  }
}

.compare-chapter {
  padding: 0 15px;
  margin-bottom: 120px;
  > div {
    padding-bottom: 120px;
  }
}

.empty-desc {
  margin: 30px auto;
  text-align: center;
  font-size: 16px;
  color: #999;
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
  .compare-container {
    overflow-x: scroll;
    display: flex;
    position: absolute;
    top: 120px;
    width: 100vw;
    margin-bottom: 60px;
  }
  // .compare-side {
  //   display: none;
  // }

  .compare-row {
    height: 4rem;
    flex-wrap: wrap;

    &.action {
      height: 2rem;
    }
  }

  .compare-item {
    min-width: 65%;

    &:nth-last-child(1) {
      border-right: none;
    }
  }

  .compare-img {
    min-height: auto;
  }

  .empty {
    font-size: size-m(24);
  }

  .center {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
