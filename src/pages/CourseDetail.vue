<template>
  <div class="detail">
    <div :class="`submit-footer flex-c ${isShowBtn ? 'show' : ''}`">
      <div class="yellow round-big big btn flex-c" @click="addCompare(current)" v-if="!isPick">加入比課</div>
      <div class="blue round-big big btn flex-c" @click="removeCompare(current)" v-if="isPick">移除比課</div>
      <div class="red round-big big btn flex-c" @click="goCourse">前往課程</div>
    </div>
    <div class="detail-thumb relative" v-if="!is_fix_thumb">
      <img :src="current.cover_image" class="thumb-img">
      <div class="darken-bg purple-bg frost"></div>
      <div class="back-btn" @click="hasHistory() 
    ? $router.go(-1) 
    : $router.push('/home')">
        <font-awesome :icon="['fa', 'chevron-left']" />
      </div>
      <!-- <div class="share-btn" @click="share(current)">
        <font-awesome :icon="['fa', 'external-link-alt']" />
      </div> -->
      <div class="collect-btn" @click="toggleCollect(current)">
        <!-- 實心 -->
        <font-awesome :icon="['fa', 'heart']" v-show="check_collect(current.is_like)" />
        <!-- 空心 -->
        <font-awesome :icon="['far', 'heart']" v-show="!check_collect(current.is_like)" />
      </div>
      <div class="thumb-title relative">
        {{current.title}}
        <div class="hot-list">
          <div class="hot-item round-big big btn flex-c">
            {{transName(current.category)}}
          </div>
        </div>
      </div>
    </div>
    <div class="thumb-container relative">
      <div class="thumb-content flex-ac flex-jb">
        <div class="flex-ac">課程售價: ${{current.price}}</div>
        <div class="flex-ac">上課人數: {{current.consumers}}</div>
      </div>
      <div class="thumb-content flex-ac flex-jb">
        <div class="flex-ac" v-if="current.platform">課程平台: <img :src="require(`@/assets/img/${current.platform}.png`)" alt="" class="thumb-content-img"></div>
        <div class="flex-ac">上架日期: {{formatTime(current.published_at)}}</div>
      </div>
    </div>
    <div class="tab-container flex-ac flex-ja">
      <div :class="`tab-item ${tabIndex === 0 ? 'active' : ''}`" @click="tabIndex = 0">
        課程簡介
      </div>
      <div :class="`tab-item ${tabIndex === 1 ? 'active' : ''}`" @click="tabIndex = 1">
        課程章節
      </div>
    </div>
    <transition-group name="fade" mode="out-in">
      <div class="container flex" key="detail-content" v-if="current.title && tabIndex === 0">
        <div class="content">
          <div class="block">
            <div class="block-title">
              課程評價
            </div>
            <div class="card-star flex-ac">
              <el-rate v-model="current.avg_rating" disabled show-score text-color="#ff9900" score-template="">
              </el-rate>
              <div class="card-rating">
                ({{current.avg_rating === -1 ? '???' : (current.avg_rating === 0 ? '暫無評價' : current.avg_rating)}})
              </div>
            </div>
          </div>
          <div class="block">
            <div class="block-title">
              已購人數
            </div>
            <div class="block-desc">
              {{current.consumers}}人
            </div>
          </div>
          <div class="block">
            <div class="block-title">
              講者
            </div>
            <pre class="block-desc">{{current.lecturers[0].name}}</pre>
          </div>
          <div class="htmlStyle" v-html="formatContentByPlatform(current.platform)"></div>
          <div class="block" v-if="current.requiredTools">
            <div class="block-title">
              課前準備
            </div>
            <pre class="block-desc">{{current.requiredTools}}</pre>
          </div>
          <div class="block">
            <div class="block-title">
              您可能感興趣
            </div>
          </div>
          <div class="cards">
            <SwipeCards :courses="interest_list" v-if="interest_list.length > 0" />
          </div>
        </div>

      </div>
      <div class="container flex" key="detail-chapter" v-if="current.title && tabIndex === 1">
        <div class="content">
          <div class="block">
            <div class="block-title">
              課程總時
            </div>
            <div class="block-desc">
              {{current.course_time_minute}}分鐘
            </div>
          </div>
          <div class="block">
            <div class="block-title">
              課程章節
            </div>
            <el-collapse v-model="activeChapter">
              <el-collapse-item :title="chapter.title" v-for="(chapter, index) in formatChapters(current.chapters)" :key="chapter.title + index" :name="index">
                <div class="chapter-subtitle" v-for="(item, subIndex) in chapter.items" :key="item.content.title + index + subIndex">
                  <span>{{item.content.title}}</span>
                  <!-- <span class="time">{{item.content.duration}}</span> -->
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </transition-group>
    <div class="cart-btn yellow round-big big btn flex-c relative" v-if="compareCount > 0 || compareCount === 'M'" @click="goCompare">
      查看比課
      <div class="menu-dot" v-show="compareCount">{{compareCount}}</div>
    </div>
    <transition name="slide-left">
      <CompareDialog v-if="isDialog" @closeDialog="isDialog=false"></CompareDialog>
    </transition>
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

.htmlStyle {
  * {
    max-height: auto !important;
  }
}

// yotta
.htmlStyle,
.course-intro-container {
  p {
    margin: 10px 0;
    color: #4c545a;
    line-height: 1.7em;
  }

  img {
    max-width: 100%;
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
  padding-bottom: 60px;
  height: calc(100vh);
  // position: absolute;
  // top: 0px;
  // bottom: 63px;
  z-index: 2;
  overflow-y: scroll;
}

.detail-thumb {
  width: 100vw;
  min-height: 140px;
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
  padding: 63px 17px 0px;
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
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
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
    margin: 0 15px 18px 0;
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
      background-color: #f57b51;
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
  font-size: sizem(16);
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

.cart-btn {
  position: fixed;
  z-index: 10;
  right: 10px;
  bottom: 75px;
}

.menu-dot {
  width: 20px;
  height: 20px;
  background-color: #ff0000;
  color: #fff;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0px;
  top: -5px;
  font-size: 14px;
  animation: jump 1s ease-in-out 0s alternate-reverse infinite;
}

@keyframes jump {
  to {
    margin-top: -5px;
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
import {
  addCollectCourse,
  deleteCollectCourse,
  searchCourse,
  addCompareStack,
} from '@/http/api'
import { mapState } from 'vuex'
import moment from 'moment'
// import EmptyContent from '@/components/EmptyContent'
// import ShareLinks from '@/components/ShareLinks.vue'
import SwipeCards from '@/components/SwipeCards'
import CompareDialog from '@/components/Dialog/CompareDialog.vue'
// import EmptyCard from '@/components/EmptyCard'
import { transCategory } from '@/info/category'
import { isMobile } from '@/util/device'

export default {
  name: 'courseDetail',
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
    SwipeCards,
    CompareDialog,
    // EmptyContent,
    // ShareLinks,
    // Card,
    // EmptyCard,
  },
  
  async beforeMount() {
    await this.$store.dispatch('course/getCourseDetail', {
      id: this.$route.query.id,
    })
    searchCourse({
      limit: 3,
      page: Math.floor(Math.random() * 20) + 1,
      sortway: 'DESC',
      sortvalue: 'avg_rating',
      category: this.current.category,
    }).then((res) => {
      this.interest_list = res.courses
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
      this.$store.dispatch('course/getCourseDetail', {
        id: this.$route.query.id,
      })
    },
  },

  computed: {
    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapState('course', ['current', 'compare_list']),
    ...mapState(['isFetchingData']),

    compareCount() {
      return this.compare_list.length === 5 ? 'max' : this.compare_list.length
    },

    isPick() {
      return this.compare_list
        .map((course) => course._id)
        .includes(this.current._id)
    },
  },
  methods: {
    hasHistory() {
      return window.history.length > 2
    },
    goCourse() {
      get('/ichannel/url', {
        platform: this.$route.query.platform,
        platform_course_id: this.current.platform_course_id,
      }).then((res) => {
        if (this.$router.query.source === 'line') {
          window.location.href = res.url
        } else {
          window.open(res.url)
        }
        // https://product.mchannles.com/redirect_wa.php?k=2f8rH&tourl=https://hahow.in/courses/5d77176845639e00212bc562&uid1=user01&uid2=hahow
      })
    },
    formatChapters(chapters) {
      if (this.current.platform === 'pressplay') {
        return [
          {
            title: '暫無資料',
          },
        ]
        // return chapters[0].split('\n').filter((s) => !!s).map((c) => ({ title: c }))
      } else {
        return chapters
      }
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
        case 'pressplay':
          content = `${
            this.current.recommendedBackground
          }<br/>${this.current.will_learn_pressplay.map(
            (text) => `<pre class="block-desc">${text}</pre>`,
          )}<div class="block"><div class="block-title">
              課程說明
            </div>
            <pre class="block-desc normal">${this.current.description
              .split('\n')
              .filter((s) => !!s)
              .join('<br />')}</pre>
          </div>`
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

    goCompare() {
      if (this.compareCount > 1 || this.compareCount == 'M') {
        addCompareStack({
          course_ids: this.compare_list.map((item) => item.id),
        }).then((res) => {
          this.$store.commit('course/setCompareId', res.documents.id)
        })
        this.$store.commit('setCompare', true)
      }
      this.isDialog = true
    },
    addCompare(item) {
      this.$store.dispatch('course/addCompareCourse', item)
    },

    removeCompare() {
      this.$store.commit('course/removeCompareCourse', this.current.id)
    },

    transName(value) {
      return transCategory(value)
    },

    share(current) {
      console.log(current)
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
