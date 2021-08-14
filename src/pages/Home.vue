<template>
  <div class="home main no-tab">
    <div class="slide-section relative flex-c wrap">
      <div class="animate-slide">
        <div v-for="slide in slide_list" :key="slide._id +'first'" class="slide-item">
          <img :src="slide.cover_image" alt="" class="slide-img">
          <img :src="require(`@/assets/img/${slide.platform}.png`)" class="platform-img" alt="">
        </div>
        <div v-for="slide in slide_list" :key="slide._id +'two'" class="slide-item relative">
          <img :src="slide.cover_image" alt="" class="slide-img">
          <img :src="require(`@/assets/img/${slide.platform}.png`)" class="platform-img" alt="">
        </div>
      </div>
      <div class="darken-bg pale"></div>
      <h3 class="slide-subtitle">
        好課比，比好課
      </h3>
      <h3 class="slide-title">
        整合不同線上課程平台
        <br />1500多門中文線上課課程
      </h3>
    </div>
    <BlockHead title="最新投票" :link="{name: '更多投票', to: '/votes?type=hot'}" />
    <div class="flex">
      <VoteCard v-for="vote in votes.slice(0, 2)" :key="vote.id" :vote="vote" />
    </div>
    <BlockHead title="隨機課程" :link="false" />
    <SwipeCards :courses="platform_courses.slice(0, 4)" />
    <BlockHead title="熱門課程" :link="{name: '更多課程', to: '/course?type=hot'}" />
    <SwipeCards :courses="hot_courses" />

    <BlockHead title="熱門比課" :link="{name: '更多比課', to: '/compares?type=hot'}" />
    <div>
      <CompareLongCard v-for="compare in hot_compares.slice(0, 4)" :key="compare.compare_course_id" :compare="compare" />
    </div>

    <BlockHead title="最新課程" :link="{name: '更多課程', to: '/course?type=new'}" />
    <SwipeCards :courses="new_courses" />

    <BlockHead title="最新比課" :link="{name: '更多比課', to: '/compares?type=new'}" />
    <div>
      <CompareLongCard v-for="compare in new_compares.slice(0, 4)" :key="compare.compare_course_id" :compare="compare" />
    </div>

    <BlockHead title="好評課程" :link="{name: '更多課程', to: '/course?type=fivestar'}" />
    <!-- <BlockHead title="推薦課程" :link="{name: '更多課程', to: '/course?type=suggest'}" /> -->
    <div class="flex scroll-x">
      <CourseCard v-for="course in fivestar_courses" :key="course.id" :course="course" />
    </div>
    <BlockHead :title="special_title_1" :link="{name: '', to: ''}" />
    <SwipeCards :courses="special_list_1.slice(0, 4)" />

    <BlockHead :title="special_title_2" :link="{name: '', to: ''}" />
    <SwipeCards :courses="special_list_2.slice(0, 4)" />

    <BlockHead :title="special_title_3" :link="{name: '', to: ''}" />
    <SwipeCards :courses="special_list_3.slice(0, 4)" />

    <div class="footer flex-c">
      <a target="_blank" href="https://m.me/howcobe">
        聯絡我們
      </a><br />
      <div>Copyright 2020 Howcobe</div>
    </div>
    <div class="cart-btn yellow round-big big btn flex-c relative" v-if="compareCount > 0 || compareCount === 'M'" @click="goCompare">
      查看比課
      <div class="menu-dot" v-show="compareCount">{{compareCount}}</div>
    </div>
    <transition name="slide-left">
      <CompareDialog v-if="isDialog" @closeDialog="isDialog=false"></CompareDialog>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import '~@/assets/style/function.scss';
.home {
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 183px;
  // padding-top: 98px;
  // min-height: calc(100vh - 63px);
  // position: relative;
  // z-index: 2;
  // transition: all 0.4s;
}
.slide-section {
  width: 100vw;
  min-height: size-m(189);
  background-color: #1a192e;
}
.slide-subtitle {
  width: 100%;
  text-align: center;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 150%;
  letter-spacing: 0.1em;
  color: #eee;
  margin-bottom: 15px;
  text-shadow: 0 2px 3px #000;
  position: relative;
}
.slide-title {
  width: 100%;
  text-align: center;
  font-style: normal;
  font-weight: normal !important;
  font-size: 18px;
  line-height: 120%;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 3px #000;
  color: #fff;
  position: relative;
}

.animate-slide {
  display: flex;
  position: absolute;
  z-index: 0;
  left: 0;
  animation: moving 80s linear infinite;
  height: 100%;
  padding-top: 30px;

  &:hover {
    animation-play-state: paused;
  }
}
@keyframes moving {
  0% {
    transform: translateX(0vw);
  }

  100% {
    transform: translateX(size(-288 * 12)); // 獲取數量 * 寬度
  }
}

.slide-item {
  width: size-m(220);
  position: relative;
  padding: size-m(10);
  z-index: 10;

  .slide-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: #1d1c26;
  }

  .platform-img {
    width: 35px;
    height: 35px;
    position: absolute;
    top: 15px;
    left: 15px;
    border-radius: 35px;
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

.footer {
  width: 100vw;
  height: 36px;
  background-color: #1a192e;

  a {
    text-align: center;
    color: #fff;
    font-size: 16px;
    text-decoration: none;
    margin-right: 15px;
  }

  div {
    color: #fff;
    font-size: 12px;
    text-align: center;
  }
}
</style>

<script>
// @ is an alias to /src
// import CategoryList from '@/components/CategoryList.vue'
import BlockHead from '@/components/BlockHead.vue'
import VoteCard from '@/components/VoteCard.vue'
import SwipeCards from '@/components/SwipeCards.vue'
import CompareLongCard from '@/components/CompareLongCard.vue'
import CourseCard from '@/components/CourseCard.vue'
import { mapState } from 'vuex'
import { info } from '@/info/meta'
import {
  // searchCourse,
  getVotes,
  getHotCourse,
  getNewCourse,
  getFiveStarCourse,
  getCompareHot,
  getCompareStack,
  getPlatformCourse,
  addCompareStack,
  getSpecialCourse,
} from '@/http/api'
import CompareDialog from '@/components/Dialog/CompareDialog.vue'
export default {
  name: 'Home',
  components: {
    // CategoryList,
    BlockHead,
    VoteCard,
    SwipeCards,
    CompareLongCard,
    CourseCard,
    CompareDialog,
  },
  data() {
    return {
      slide_list: [],
      votes: [],
      hot_courses: [],
      hot_compares: [],
      new_courses: [],
      new_compares: [],
      platform_courses: [],
      fivestar_courses: [],
      plaform_courses: [],

      special_list_1: [],
      special_list_2: [],
      special_list_3: [],
      special_title_1: '',
      special_title_2: '',
      special_title_3: '',

      isDialog: false,
    }
  },

  metaInfo: {
    title: info.title,
    meta: [
      {
        property: 'title',
        content: info.title,
        vmid: 'title',
      },
      {
        property: 'og:title',
        content: info.title,
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
        content: 'https://m.howcobe.com/',
        vmid: 'og:url',
      },
      {
        property: 'og:image',
        content: 'https://m.howcobe.com/img.png',
      },
    ],
  },

  jsonld: [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      name: info.title,
      url: 'https://m.howcobe.com/',
      // potentialAction: [
      //   {
      //     "@type": "SearchAction",
      //     target: "https: blog.lalacube.com search article?p={search_term_string}",
      //     "query-input": "required name=search_term_string"
      //   }
      // ]
    },
    {
      '@context': 'http://schema.org',
      '@type': 'WebApplication',
      name: info.title,
      description: info.description,
      operatingSystem: 'Windows 7, OSX 10.6',
      browserRequirements: 'requires HTML5 support',
      applicationCategory: 'DeveloperApplication',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        ratingCount: '3224',
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '0',
        priceCurrency: 'TWD',
      },
      // "image": "https://m.howcobe.com/",
      url: 'https://m.howcobe.com/',
      // author: {
      //   "@context": "http://schema.org",
      //   "@type": "Organization",
      //   name: "好課比",
      //   url: "https://m.howcobe.com/",
      //   logo: "https: blog.lalacube.com mei img app privacy i_512x512.png",
      //   sameAs: ["https: www.facebook.com mei.studio.li "]
      // }
    },
  ],

  methods: {
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
  },

  computed: {
    ...mapState('course', ['compare_list']),
    compareCount() {
      return this.compare_list.length === 5 ? 'M' : this.compare_list.length
    },
  },
  async mounted() {
    // const result = await searchCourse({
    //   page: 1,
    //   limit: 12,
    //   search: '',
    //   sortway: 'DESC',
    //   category: '',
    // })

    // this.slide_list = result.courses
    getVotes({}).then((res) => {
      this.votes = res.voteCompareCourses
    })

    getPlatformCourse().then((res) => {
      this.platform_courses = res
      this.slide_list = res
    })
    getHotCourse({ limit: 4 }).then((res) => {
      this.hot_courses = res.courses
    })
    getNewCourse({ limit: 4 }).then((res) => {
      this.new_courses = res.courses
    })
    getFiveStarCourse({ limit: 4 }).then((res) => {
      this.fivestar_courses = res.courses
    })
    getCompareHot({}).then((res) => {
      this.hot_compares = res
    })
    getCompareStack({}).then((res) => {
      this.new_compares = res
    })

    getSpecialCourse({}).then((res) => {
      this.special_list_1 = res.courses[0]
      this.special_list_2 = res.courses[1]
      this.special_list_3 = res.courses[2]
      this.special_title_1 = res.specialTags[0]
      this.special_title_2 = res.specialTags[1]
      this.special_title_3 = res.specialTags[2]
    })
  },
}
</script>
