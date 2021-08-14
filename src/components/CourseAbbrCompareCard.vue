<template>
  <router-link tag="div" :class="`course-card flex-at flex-jb ${(pattern === 'pick') ? 'pick' : ''} ${isPick ? 'picked' : ''}`" :to="`/detail/course?id=${course.id}&platform=${course.platform}`">
    <div class="course-img" @click.stop="toggleCompare(course)">
      <img :src="course.cover_image" alt="">
      <img :src="require(`@/assets/img/${course.platform}.png`)" class="platform-img" alt="">
      <div class="collect-btn yellow flex-c" v-if="hasLike">
      <div v-if="isPick">
        移除比課
      </div>
      <div v-if="!isPick">
        加入比課
      </div>
    </div>
    </div>
    <div class="course-content">
      <div class="title">
        {{sliceTitle(course.title)}}
      </div>
      <div class="flex-ab flex-jr">
        <!-- <div class="subtitle">
          {{course.course_time_minute ? `課程長度: ${course.course_time_minute}分鐘;` : ''}}
        </div> -->
        <div class="price">
          ${{course.price}}
        </div>
      </div>
      <div class="flex-ab flex-jr">
        <div class="card-star flex-ab flex-jb">
          <el-rate v-model="course.avg_rating" disabled show-score text-color="#ff9900" score-template="">
          </el-rate>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
// import { addCollectCourse, deleteCollectCourse } from '@/http/api'

export default {
  name: 'CourseAbbrCard',
  data() {
    return {}
  },
  props: {
    course: {
      default: [],
    },
    hasLike: {
      default: true,
    },
  },

  computed: {
    ...mapState(['pattern']),
    ...mapState('course', ['compare_list']),
    isPick() {
      return (
        this.pattern === 'compare' &&
        this.compare_list.map(course => course._id).includes(this.course._id)
      )
    },
  },

  methods: {
    sliceTitle(text) {
      return text.slice(0, 25) + `${text.length > 25 ? '...' : ''}`
    },

    sliceName(text) {
      return text.slice(0, 40) + `${text.length > 40 ? '...' : ''}`
    },
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD')
    },

    countChapter(chapters) {
      const length_list = chapters.map(cha => cha.items ? cha.items.length : 0)
      return length_list.reduce((a, b) => a + b, 0)
    },

    toggleCompare(course) {
      if (this.isPick) {
        this.removeCompare(course.id)
      } else {
        this.addCompare(course)
      }
    },

    addCompare(course) {
      this.$store.commit('setPattern', 'compare')
      this.$store.dispatch('course/addCompareCourse', course)
    },

    removeCompare(id) {
      this.$store.commit('course/removeCompareCourse', id)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.course-long {
  margin: 0 12px;
}
.course-card {
  // box-shadow: 0 1px 3px 0 rgba(0,0,0, .3);
  // background-color: #fff;
  width: 100%;
  height: 100px;
  margin: 12px 12px 24px 0;
  position: relative;
  padding-bottom: 15px;
  border-bottom: 1px solid #39405B;
}

.course-img {
  width: 45%;
  height: 85px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    height: 60px;
    object-fit: cover;
  }
  .platform-img {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 2px;
    left: 2px;
    border-radius: 20px;
  }
}

.course-content {
  width: 50%;
}

.title {
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.1em;
  color: #fff;
  min-height: 40px;
}

.subtitle {
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #ccc;
  text-align: right;
  margin-bottom: 5px;

  span {
    color: #be272d, 100%;
  }
}

.price {
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #f9d849;
  margin-bottom: 5px;
}

.card-star {
  display: flex;
  align-items: center;
  font-size: 13px;
}
.collect-btn {
  color: #fff;
  height: 25px;
  font-size: 12px;
  margin-top: -2px;
}
</style>
