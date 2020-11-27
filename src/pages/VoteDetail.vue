<template>
  <div class="detail">
    <transition name="slide-left">
      <VoteCompareDialog v-if="isDialog" @closeDialog="isDialog=false" :voteList="detail_context.courses"></VoteCompareDialog>
    </transition>
    <div class="detail-thumb relative" v-if="!is_fix_thumb">
      <!-- <img :src="current.cover_image" class="thumb-img"> -->
      <div class="darken-bg purple-bg frost"></div>
      <div class="back-btn" @click="hasHistory() 
    ? $router.go(-1) 
    : $router.push('/')">
        <font-awesome :icon="['fa', 'chevron-left']" />
      </div>
      <div class="thumb-title relative">
        <div>
          {{detail_context.title}}
        </div>
        <div class="hot-list flex-jb flex-ac">
          <div class="subtitle">
            參與投票: {{detail_context.votePerson.length}}人
          </div>
          <div class="hot-item round-big big btn flex-c">
            {{transName(detail_context.category)}}
          </div>
        </div>
      </div>
    </div>
    <div class="tab-container flex-ac">
      {{detail_context.description}}
    </div>
    <div class="container flex" key="detail-content">
      <div class="rank-item flex-ac flex-ja" v-for="(course, index) in detail_context.courses" :key="`rank ${course.cover_image}`">
        <img :src="course.cover_image" alt="" class="rank-img">
        <div class="rank-mask flex-ac">
          <div class="flex-ac flex-ja">
            <div class="rank-middle flex-ac wrap">
              <div class="rank-text flex-ac flex-js">
                <div class="rank-order absolute">第{{index + 1}}名</div>
                <div class="rank-title">
                  {{course.title}}
                </div>
              </div>
              <div class="rank-bar relative" :style="`width: ${countBarWidth((detail_context.votenumber[index]))}%`">
                <div class="rank-vote">
                  {{detail_context.votenumber[index]}} 票
                </div>
              </div>
            </div>
            <div class="rank-right flex-ac wrap flex-jr">
              <div class="yellow round-big big btn flex-c" @click="vote(course, index)">投他一票</div>
              <div class="blue round-big big btn flex-c" @click="goCompare">詳細比較</div>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 100px;"></div>
    </div>
  </div>
</template>
<style lang="scss">
@import '~@/assets/style/function.scss';
.block {
  margin-top: size(50);
  .block-title {
    font-size: size(32);
    margin-bottom: size(20);
  }
  .block-desc {
    font-size: size(18);
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
  font-size: size(32);
  margin: size(50) 0 size(20);
}

.what-you-get__item,
.requirements__item {
  font-size: size(18);
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
    font-size: size(16);
    line-height: 1.7em;
    font-weight: 700;
    color: #4c545a;
  }
}

.udlite-icon {
  display: none;
}
/* 螢幕尺寸標準 */
/* 手機尺寸 */
@media screen and (max-width: 767px) {
  .block {
    margin-top: size-m(30);
    .block-title {
      font-size: size-m(18);
      margin-bottom: size-m(15) !important;
    }

    .block-desc {
      font-size: size-m(14);
    }
  }

  .requirements__title,
  .what-you-get__title {
    font-size: size-m(18);
    margin-top: size-m(30);
    margin-bottom: size-m(15);
  }

  .what-you-get__item,
  .requirements__item {
    font-size: size-m(14);
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
      font-size: size-m(16);
      line-height: 1.7em;
      font-weight: 700;
      color: #4c545a;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '~@/assets/style/function.scss';

.detail {
  // background-color: rgb(245, 245, 245);
  // margin-top: 40px;
  height: calc(100vh);
  // position: absolute;
  // top: 0px;
  // bottom: 63px;
  z-index: 2;
  overflow-y: scroll;
}

.detail-thumb {
  width: 100vw;
  min-height: 72px;
  position: relative;
  margin-top: 0px;
  opacity: 0;
  padding-bottom: 10px;
  z-index: 0;
  background: linear-gradient(to right, #333, #505763);
  animation: slide-in 0.5s ease 0.8s forwards;
}

.thumb-img {
  width: 100vw;
  height: 100%;
  object-fit: cover;
  position: absolute;
}

.thumb-title {
  width: 100vw;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin: 0 auto;
  padding: 10px 17px 0px 40px;
}

.thumb-container {
  width: 100vw;
  height: 120px;
  margin: 0 auto;
  margin-top: -10px;
  left: 0;
  right: 0;
  padding: 25px 17px;
  z-index: 3;
  // box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  background-color: #fff;
}

.thumb-content {
  > div {
    width: 50%;
    min-height: 45px;
  }
}

.tab-container {
  background-color: #fcfcfc;
  min-height: 60px;
  color: #000;
  padding: 17px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.tab-item {
  font-size: size-m(16);
  line-height: 100%;
  text-align: center;
  letter-spacing: 0.02em;
  color: #000;
  margin-top: 15px;
  margin-bottom: 15px;
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

.mb-30 {
  margin-bottom: 30px;
}

.thumb-content-img {
  width: 34px;
  margin-left: 20px;
}

// .class-btn {
//   width: 137px;
//   height: 41px;
//   // margin-bottom: 20px;
// }

@keyframes slide-in {
  0% {
    top: 30px;
    opacity: 0;
  }

  100% {
    top: 1px;
    opacity: 1;
  }
}

.container {
  width: 1070px;
  max-width: 100vw;
  z-index: 2;
  left: 0;
  right: 0;
  margin: 0 auto 100px;
  padding-top: 0px;
}

.content {
  width: 100%;
  min-height: 20vh;
  background-color: transparent;
  margin-right: 30px;
  padding: 0px 40px 40px;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 40px;
  line-height: 1.5;
  font-weight: bold;
}

.subtitle {
  font-size: 12px;
  line-height: 1.5;
  font-weight: normal;
}

.desc {
  font-size: size(18);
  color: #666;
  line-height: 1.4;
  letter-spacing: 0.3px;
  white-space: pre-line;
}

.hot-list {
  // position: absolute;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;

  .hot-item {
    cursor: pointer;
    height: 22px;
    background-color: #f6eedf;
    // margin: 0 15px 18px 0;
    box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;

    &:hover {
      box-shadow: inset 0 1px 1px 1px rgba(0, 0, 0, 0.7);
    }

    &:nth-child(1) {
      color: #fff;
      background: linear-gradient(91.97deg, #ff0000 -10.07%, #fd666f 126.39%);
    }

    &:nth-child(2) {
      color: #fff;
      background: linear-gradient(91.97deg, #ff0000 -10.07%, #fd666f 126.39%);
    }

    &:nth-child(3) {
      background-color: #d1cebd;
    }
  }
}

.heart-item {
  height: size(32);
}

.card-rating {
  font-size: size(16);
  color: #666;
  margin-left: 10px;
}

.block {
  margin-top: size(50);
  .block-title {
    font-size: size(32);
    margin-bottom: size(20);
  }
  .block-desc {
    font-size: size(18);
    color: #333;
    line-height: 2;
    width: 100%;
    white-space: pre-line;
  }
}

.side {
  width: 38%;
  background-color: #fff;
  position: relative;
  z-index: 1;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.24);
}

img {
  background-color: #fff;
  max-width: 100%;
}

.submit {
  width: size(180);
  height: size(55);
  color: #fff;
  font-weight: 400;
  font-size: size(20);
  letter-spacing: 1px;
  margin: 30px auto;
  padding: 0;
}

.card-row {
  flex-wrap: nowrap;
  overflow: visible;
  > div {
    width: 50%;
  }
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

.rank-item {
  height: 155px;
  // margin-bottom: 65px;
  position: relative;
  .rank-order {
    font-size: 16px;
    color: #fff;
    top: 5px;
    left: 5px;
    border-radius: 32px / 32px;
    padding: 10px 20px;
    text-shadow: 0 0 2px #000;
  }
  &:nth-child(1) {
    .rank-bar,
    .rank-order {
      background: linear-gradient(to right, #fa3052, #ffd519);
    }
  }
  &:nth-child(2) {
    .rank-bar,
    .rank-order {
      background: linear-gradient(to right, #a8ff78, #78ffd6);
    }
  }
  &:nth-child(3) {
    .rank-bar,
    .rank-order {
      background: linear-gradient(to right, #9797eb, #367cff, #57fff4);
    }
  }

  &:nth-child(4) {
    .rank-bar,
    .rank-order {
      background: linear-gradient(to right, #800080, #ffc0cb);
    }
  }

  &:nth-child(5) {
    .rank-bar,
    .rank-order {
      background: linear-gradient(to right, #3a7bd5, #3a6073);
    }
  }

  .rank-middle {
    width: 65%;
    height: 100%;
  }

  .rank-right {
    width: 35%;
    height: 100%;
    padding-top: 15px;
  }

  .rank-mask {
    width: 100%;
    padding: 0 10px;
    height: 155px;
    object-fit: cover;
    z-index: 1;
    // border-radius: 999px;
    top: 0;
    left: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    > div {
      width: 100%;
    }
  }

  .rank-img {
    width: 100%;
    height: 155px;
    object-fit: cover;
    z-index: 0;
    // border-radius: 999px;
    top: 0;
    left: 0;
    position: absolute;
  }

  .rank-text {
    width: 100%;
  }

  .rank-title {
    font-size: 14px;
    color: #fff;
  }

  .rank-bar {
    width: 80%;
    height: 8px;
    border-radius: 12px / 12px;
    margin-top: 15px;
  }

  .rank-vote {
    width: 100%;
    color: #ccc;
    font-size: 18px;
    margin-bottom: 10px;
    text-align: right;
    position: absolute;
    top: 15px;
    right: 0px;
    white-space: nowrap;
  }

  .btn {
    white-space: nowrap;
    font-size: 14px;
    margin-bottom: 15px;
  }
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
  .detail {
    // margin-top: 60px;
  }

  .container {
    display: block;
    padding: 0;
  }

  .content {
    width: 100%;
    padding: 20px;
    // padding-bottom: 60px;
    box-shadow: none;
  }

  .cover {
    width: 100vw;
    display: block;
  }

  .title {
    font-size: size-m(26);
    margin-bottom: 15px;
  }

  .desc {
    font-size: size-m(15);
    line-height: 1.6;
  }

  .card-star {
    margin-bottom: 15px;
  }

  .block {
    .block-title {
      font-size: size-m(18);
    }

    .block-desc {
      font-size: size-m(14);
    }
  }

  .data-row {
    margin: 20px 0 30px;
    .row {
      height: 2.8rem;
    }

    .row-content {
      .row-img {
        width: auto;
        height: 2.8rem;
      }
    }
  }

  .submit-footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 63px;
    background-color: #fefefe;
    border-top: 1px solid #eee;
    left: 0;
    z-index: 11;
    &.show {
      display: flex;
    }
  }

  .submit {
    margin: 0 auto;
    width: size-m(180);
    height: size-m(60);
    font-size: size-m(18);
    margin-top: 0;
    font-weight: 300;
  }

  .share-title {
    font-size: size-m(16);
    margin: 15px auto;
    color: #666;
    width: 85%;
  }

  .overlfow {
    width: 100%;
    overflow: scroll;
  }

  .card-row {
    flex-wrap: wrap;
    overflow: scroll;
    > div {
      width: 100%;
    }
  }

  .cards {
    margin: 0 -15px;
  }
}
</style>

<script>
// TODO 清除舊有的邏輯
// TODO Skeleton 樣式
// TODO scroll and fix header
import { get } from '@/http/axios'
import { addCollectCourse, deleteCollectCourse, voteCompare } from '@/http/api'
import { mapState } from 'vuex'
import moment from 'moment'
// import EmptyContent from '@/components/EmptyContent'
// import ShareLinks from '@/components/ShareLinks.vue'
// import SwipeCards from '@/components/SwipeCards'
// import EmptyCard from '@/components/EmptyCard'
import { transCategory } from '@/info/category'
import { isMobile } from '@/util/device'
import VoteCompareDialog from '@/components/Dialog/VoteCompareDialog.vue'

export default {
  name: 'voteDetail',
  data() {
    return {
      isMobile,
      isDialog: false,
      isShowBtn: false,
      activeChapter: [0],
      interest_list: [],
      is_fix_thumb: false,
      is_collect: '',
      tabIndex: 0,
    }
  },
  components: {
    VoteCompareDialog,
    // SwipeCards,
    // EmptyContent,
    // ShareLinks,
    // Card,
    // EmptyCard,
  },
  async beforeMount() {
    await this.$store.dispatch('vote/getVoteDetail', {
      id: this.$route.query.id,
    })
  },

  // metaInfo() {
  //   return {
  //     title: `好課比 - ${this.current.platform} - ${this.current.title}`,
  //     meta: [
  //       {
  //         property: 'title',
  //         content: `好課比 - ${this.current.platform} - ${this.current.title}`,
  //         vmid: 'title',
  //       },
  //       {
  //         property: 'og:title',
  //         content: this.current.title,
  //         vmid: 'og:title',
  //       },
  //       {
  //         property: 'description',
  //         content: this.current.description,
  //         vmid: 'description',
  //       },
  //       {
  //         property: 'og:description',
  //         content: this.current.description,
  //         vmid: 'og:title',
  //       },
  //       {
  //         property: 'keywords',
  //         content: this.current.keywords,
  //         vmid: 'keywords',
  //       },
  //       {
  //         property: 'og:url',
  //         content: `https://howcobe.com/detail?id=${this.$route.query.id}`,
  //         vmid: 'og:url',
  //       },
  //       {
  //         property: 'og:image',
  //         content: this.current.cover_image,
  //       },
  //     ],
  //   }
  // },

  // jsonld() {
  //   return [
  //     {
  //       '@context': 'http://schema.org',
  //       '@type': 'WebSite',
  //       name: this.current.title,
  //       url: 'https://howcobe.com/',
  //       // potentialAction: [
  //       //   {
  //       //     "@type": "SearchAction",
  //       //     target: "https: blog.lalacube.com search article?p={search_term_string}",
  //       //     "query-input": "required name=search_term_string"
  //       //   }
  //       // ]
  //     },
  //     {
  //       '@context': 'http://schema.org',
  //       '@type': 'WebApplication',
  //       name: this.current.title,
  //       description: this.current.description,
  //       operatingSystem: 'Windows 7, OSX 10.6',
  //       browserRequirements: 'requires HTML5 support',
  //       applicationCategory: 'DeveloperApplication',
  //       aggregateRating: {
  //         '@type': 'AggregateRating',
  //         ratingValue: this.current.avg_rating,
  //         ratingCount: this.current.consumers,
  //       },
  //       offers: {
  //         '@type': 'Offer',
  //         availability: 'https://schema.org/InStock',
  //         price: this.current.price,
  //         priceCurrency: 'TWD',
  //       },
  //       // "image": "https://howcobe.com/",
  //       url: `https://howcobe.com/detail?id=${this.$route.query.id}`,
  //       author: {
  //         '@context': 'http://schema.org',
  //         '@type': 'Organization',
  //         name: this.current.author,
  //         // url: 'https://howcobe.com/',
  //         // logo: 'https: blog.lalacube.com mei img app privacy i_512x512.png',
  //       },
  //     },
  //   ]
  // },

  mounted() {
    // this.$store.dispatch('course/getCourseDetail', { id: this.$route.query.id })
    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.onScroll, false)
  },

  watch: {
    // '$store.state.viewIndex': function(val) {
    //   if (val >= 2) {
    //     this.isShowBtn = true
    //   } else {
    //     this.isShowBtn = false
    //   }
    // },

    $route: function () {
      this.$store.dispatch('vote/getVoteDetail', {
        id: this.$route.query.id,
      })
    },
  },

  computed: {
    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapState('vote', ['currents', 'detail_context']),
    ...mapState(['isFetchingData']),
    totalVote() {
      return this.detail_context.votenumber.reduce((a, b) => a + b, 0)
    },
    current() {
      return this.currents[this.course_index] || {}
    },
  },

  methods: {
    goCompare() {
      // addCompareStack({
      //   course_ids: this.compare_list.map((item) => item.id),
      // }).then((res) => {
      //   this.$store.commit('course/setCompareId', res.documents.id)
      // })
      // this.$store.commit('setCompare', true)
      this.isDialog = true
    },
    // addCompare(course) {
    //   this.$store.commit('setPattern', 'compare')
    //   this.$store.dispatch('course/addCompareCourse', course)
    // },
    hasHistory() {
      return window.history.length > 2
    },
    goCourse() {
      get('/ichannel/url', {
        platform: this.$route.query.platform,
        platform_course_id: this.current.platform_course_id,
      }).then((res) => {
        window.open(res.url)
        // https://product.mchannles.com/redirect_wa.php?k=2f8rH&tourl=https://hahow.in/courses/5d77176845639e00212bc562&uid1=user01&uid2=hahow
      })
    },

    formatContentByPlatform(platform) {
      let content = ''
      switch (platform) {
        case 'hahow':
          content = `<div class="block">
            <div class="block-title">
              你將會學到
            </div>
            <pre class="block-desc">${this.current.willLearn}</pre>
          </div>
          <div class="block">
            <div class="block-title">
              適合對象
            </div>
            <pre class="block-desc">${this.current.targetGroup}</pre>
          </div>
          <div class="block">
            <div class="block-title">
              建議背景
            </div>
            <pre class="block-desc">${this.current.recommendedBackground}</pre>
          </div>`
          break
        case 'udemy':
          content = `${this.current.requirements}${this.current.will_learn}<div class="block"><div class="block-title">
              課程說明
            </div>
            <pre class="block-desc normal">${this.current.description}</pre>
          </div>`
          break
        case 'hiskio':
          content = `<div class="block">
            <div class="block-title">
              你將會學到
            </div>
            ${this.current.learn
              .map((text) => `<pre class="block-desc">${text}</pre>`)
              .join('')}
          </div>
          <div class="block">
            <div class="block-title">
              適合對象
            </div>
            ${this.current.object
              .map((text) => `<pre class="block-desc">${text}</pre>`)
              .join('')}
          </div>
          <div class="block">
            <div class="block-title">
              建議背景
            </div>
            ${this.current.knowledge
              .map((text) => `<pre class="block-desc">${text}</pre>`)
              .join('')}
          </div>`
          break
        case 'yotta':
          content = `${this.current.description.replace(
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

    formatTime(time) {
      if (!time) {
        return '無資訊'
      }
      return moment(time).format('YYYY-MM-DD')
    },

    check_collect(is_like) {
      if (this.is_collect === '') {
        return is_like
      } else if (this.is_collect === 1) {
        return is_like || true
      } else if (this.is_collect === 2) {
        return false
      }
    },
    toggleCollect(course) {
      if (this.$store.state.isFetchingData) {
        return
      }
      if (this.check_collect(course.is_like)) {
        deleteCollectCourse(course.id).then(() => {
          this.$message({
            message: '已移除此課程',
            type: 'success',
          })
          this.is_collect = 2
        })
      } else {
        addCollectCourse(course.id).then(() => {
          this.$message({
            message: '已收藏此課程',
            type: 'success',
          })
          this.is_collect = 1
        })
      }
    },
    // onScroll() {
    //   const scrollTop =
    //     window.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop
    //   const offsetTop = document.querySelector('.thumb-container').offsetTop
    //   if (scrollTop > offsetTop) {
    //     this.is_fix_thumb = true
    //   } else {
    //     this.is_fix_thumb = false
    //   }
    // },
    // onScroll() {
    //   const scrollTop =
    //     document.documentElement.scrollTop || document.body.scrollTop
    //   if (scrollTop >= window.innerHeight * 0.2) {
    //     this.$store.commit('setViewIndex', 2)
    //   } else {
    //     this.$store.commit('setViewIndex', 1)
    //   }
    // },

    addCompare(item) {
      this.$store.dispatch('course/addCompareCourse', item)
    },

    transName(value) {
      return transCategory(value)
    },

    share(current) {
      console.log(current)
    },

    vote(course, index) {
      // TODO 投票流程
      //      vote-vcc 投票 API
      //      "id":"a372509a-6646-454a-9308-2eae343907de", // 所選課程
      //     "choice_index":1, // 排序
      //     "vote_compare_courses_id":"24bd5237-6af9-44f1-98e4-0b59ce60a6ba", // 該投票id
      //     "courses_id": [ // 參與投票的課程選項
      //     "bb9edc43-284f-4354-bcd9-2986f1cc285a",
      //     "a372509a-6646-454a-9308-2eae343907de"
      //     ]
      voteCompare({
        course_id: course.id,
        choice_index: index,
        vote_compare_courses_id: this.detail_context.id,
        courses_id: this.detail_context.course_ids,
      }).then(() => {
        this.$message({
          message: '投票成功',
          type: 'success',
        })

        this.$store.dispatch('vote/getVoteDetail', {
          id: this.$route.query.id,
        })
      })
    },

    countBarWidth(votes) {
      return (votes / this.totalVote) * 98 + 2
    },
  },

  destroyed() {
    this.$store.commit('course/setCurrentCourse', {
      owner: { name: '' },
      coverImage: '',
    })

    window.removeEventListener('scroll', this.onScroll, false)
  },
}
</script>
