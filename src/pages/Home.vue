<template>
  <div class="home main">
    <CategoryList />
    <BlockHead title="最新投票" :link="{name: '更多投票', to: '/votes?type=hot'}" />
    <div class="flex">
      <VoteCard v-for="vote in votes.slice(0, 2)" :key="vote.id" :vote="vote" />
    </div>
    <BlockHead title="熱門課程" :link="{name: '更多課程', to: '/courses?type=hot'}" />
    <SwipeCards :courses="hot_courses" />

    <BlockHead title="熱門比課" :link="{name: '更多比課', to: '/compares?type=hot'}" />
    <div>
      <CompareLongCard v-for="compare in hot_compares.slice(0, 4)" :key="compare.compare_course_id" :compare="compare" />
    </div>

    <BlockHead title="最新課程" :link="{name: '更多課程', to: '/courses?type=new'}" />
    <SwipeCards :courses="new_courses" />

    <BlockHead title="最新比課" :link="{name: '更多比課', to: '/compares?type=new'}" />
    <div>
      <CompareLongCard v-for="compare in new_compares.slice(0, 4)" :key="compare.compare_course_id" :compare="compare" />
    </div>

    <BlockHead title="好評課程" :link="{name: '更多課程', to: '/courses?type=fivestar'}" />
    <!-- <BlockHead title="推薦課程" :link="{name: '更多課程', to: '/courses?type=suggest'}" /> -->
    <div class="flex scroll-x">
      <CourseCard v-for="course in fivestar_courses" :key="course.id" :course="course" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CategoryList from '@/components/CategoryList.vue'
import BlockHead from '@/components/BlockHead.vue'
import VoteCard from '@/components/VoteCard.vue'
import SwipeCards from '@/components/SwipeCards.vue'
import CompareLongCard from '@/components/CompareLongCard.vue'
import CourseCard from '@/components/CourseCard.vue'
import {
  getVotes,
  getHotCourse,
  getNewCourse,
  getFiveStarCourse,
  getCompareHot,
  getCompareStack,
} from '@/http/api'
export default {
  name: 'Home',
  components: {
    CategoryList,
    BlockHead,
    VoteCard,
    SwipeCards,
    CompareLongCard,
    CourseCard,
  },
  data() {
    return {
      votes: [],
      hot_courses: [],
      hot_compares: [],
      new_courses: [],
      new_compares: [],
      fivestar_courses: [],
    }
  },

  methods: {},
  mounted() {
    getVotes({}).then(res => {
      this.votes = res.voteCompareCourses
    })
    getHotCourse({ limit: 4 }).then(res => {
      this.hot_courses = res.courses
    })
    getNewCourse({ limit: 4 }).then(res => {
      this.new_courses = res.courses
    })
    getFiveStarCourse({limit: 4}).then(res => {
      this.fivestar_courses = res.courses
    })
    getCompareHot({}).then(res => {
      this.hot_compares = res
    })
    getCompareStack({}).then(res => {
      this.new_compares = res
    })
  },
}
</script>
