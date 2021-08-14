<template>
  <div class="course-swipe">
    <router-link class="course-card flex-at flex-jb" tag="div" :to="`/detail/course?id=${course.id}&platform=${course.platform}`" v-for="course in courses" :key="course.id">
      <div class="course-img" @click.stop="deleteCollectCourse(course)">
        <img :src="course.cover_image" alt="">
        <img :src="require(`@/assets/img/${course.platform}.png`)" class="platform-img" alt="">
        <div class="collect-btn pink flex-c" v-if="hasLike">
          <!-- 實心 -->
          <div>
            移除收藏
          </div>
        </div>
      </div>
      <div class="course-content">
        <div class="title">
          {{sliceTitle(course.title)}}
        </div>
        <div class="flex-ab flex-jb">
          <div class="subtitle">
            {{course.course_time_minute ? `課程長度: ${course.course_time_minute}分鐘;` : ''}}
          </div>
          <div class="price">
            ${{course.price}}
          </div>
        </div>
        <div class="flex-ab flex-jb">
          <div class="subtitle">
            講者：{{sliceName(course.lecturers[0].name)}}
          </div>
          <div class="card-star flex-ab flex-jb">
            <el-rate v-model="course.avg_rating" disabled show-score text-color="#ff9900" score-template="">
            </el-rate>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import moment from 'moment'
import {deleteCollectCourse } from '@/http/api'

export default {
  name: 'swipeAdminCards',
  data() {
    return {}
  },
  props: {
    courses: {
      default: [],
    },
    hasLike: {
      default: true,
    },
  },

  computed: {},

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

    check_collect(is_like) {
      if (this.is_collect === '') {
        return is_like
      } else if (this.is_collect === 1) {
        return is_like || true
      } else if (this.is_collect === 2) {
        return false
      }
    },

    deleteCollectCourse(course) {
      deleteCollectCourse(course.id).then(() => {
        this.$message({
          message: '已移除此課程',
          type: 'success',
        })
        this.is_collect = 2
        this.$emit('update')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.course-swipe {
  margin: 0 12px;
}
.course-card {
  // box-shadow: 0 1px 3px 0 rgba(0,0,0, .3);
  // background-color: #fff;
  width: 100%;
  height: 85px;
  margin: 12px 12px 12px 0;
  position: relative;
}

.course-img {
  width: 25%;
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
  width: 70%;
}

.title {
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.1em;
  color: #000000;
  min-height: 40px;
}

.subtitle {
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #666666;
  text-align: left;
  margin-bottom: 5px;
  width: 60%;

  span {
    color: #be272d, 100%;
  }
}

.price {
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #000000;
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
