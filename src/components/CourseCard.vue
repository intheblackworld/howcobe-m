<template>
  <router-link class="course-card" tag="div" :to="`/detail/course?id=${course.id}&platform=${course.platform}`">
    <div class="course-img relative" @click.stop="toggleCollect(course)">
      <img :src="course.cover_image" alt="">
      <img :src="require(`@/assets/img/${course.platform}.png`)" class="platform-img" alt="">
      <div class="collect-btn pink flex-c absolute" v-if="hasLike">
        <!-- 實心 -->
        <div v-if="check_collect(course.is_like)">
          移除收藏
        </div>
        <div v-if="!check_collect(course.is_like)">
          加入收藏
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
</template>

<script>
import moment from 'moment'
import { addCollectCourse, deleteCollectCourse } from '@/http/api'

export default {
  name: 'courseCard',
  data() {
    return {
      is_collect: 2
    }
  },
  props: {
    course: {
      default: {},
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
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.course-card {
  // box-shadow: 0 1px 3px 0 rgba(0,0,0, .3);
  // background-color: #fff;
  min-width: 218px;
  min-height: 246px;
  margin: 0 12px;
  position: relative;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
}

.course-img {
  width: 100%;
  height: 130px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    height: 130px;
    object-fit: cover;
  }

  .platform-img {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 5px;
    left: 5px;
    border-radius: 30px;
  }
}

.course-content {
  width: 100%;
  padding: 6px;
}

.title {
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.1em;
  color: #000000;
  min-height: 40px;
}

.subtitle {
  max-width: 120px;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #666666;
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
  color: #000000;
  margin-bottom: 5px;
}

.card-star {
  display: flex;
  align-items: center;
  margin-right: -7px;
}
.collect-btn {
  color: #fff;
  width: 100%;
  height: 25px;
  font-size: 12px;
  margin-top: -2px;
  bottom: 0;
}
</style>
