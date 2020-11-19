<template>
  <div :class="`compare-long ${dark ? 'dark-card' : ''}`">
    <div class="compare-card flex-ac flex-jb" v-if="compare.courses.length > 0">
      <div class="content flex-ac flex-jb wrap">
        <div class="course" v-for="course in compare.courses.slice(0, 4)" :key="course.id">
          <div class="compare-img flex-ac flex-jr relative">
            <img :src="course.cover_image" alt="">
            <img :src="require(`@/assets/img/${course.platform}.png`)" class="platform-img" alt="">
          </div>
          <div class="title">
            {{sliceTitle(course.title)}}
          </div>
        </div>
      </div>
      <div class="action">
        <!-- <div class="yellow round-big middle btn flex-c" @click="addCompare(compare.courses)">參考比較</div> -->
        <div class="pink round-big middle btn flex-c" @click="deleteCompareToCollect(compare.compare_course_id)">移除收藏</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { deleteCollectCompare } from '@/http/api'

export default {
  name: 'compareLongAdminCard',
  data() {
    return {}
  },
  props: {
    compare: {
      default: [],
    },
    dark: {
      default: false,
    }
  },

  computed: {},

  methods: {
    addCompare(list) {
      this.$store.commit('course/setCompareCourse', [])
      list.forEach(course => {
        this.$store.dispatch('course/addCompareCourse', course)
      })
      this.$store.commit('setCompare', true)
    },
    deleteCompareToCollect(compare_course_id) {
      deleteCollectCompare(compare_course_id).then(() => {
        this.$message({
          message: '已移除此比課',
          type: 'success',
        })
        this.$emit('update')
      })
    },
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
      const length_list = chapters.map(cha => cha.items.length)
      return length_list.reduce((a, b) => a + b, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.compare-long {
  margin: 0 12px;

  &.dark-card {
    .compare-card {
      border-bottom: 1px solid #333;
    }

    .title {
      color: #fff;
    }

    .subtitle {
      color: #ccc;
    }

    .price {
      color: #ccc;
    }
  }
}
.compare-card {
  // box-shadow: 0 1px 3px 0 rgba(0,0,0, .3);
  // background-color: #fff;
  width: 100%;
  // height: 85px;
  margin: 12px 12px 24px 0;
  position: relative;
  border-bottom: 1px solid #eee;
}

.compare-img {
  width: 100%;
  height: 63px;
  border-radius: 6px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
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

.content {
  width: 65%;
  margin-right: 5%;
}

.action {
  width: 30%;
}

.course {
  width: 45%;
  margin-bottom: 12px;
}

.title {
  font-size: 12px;
  line-height: 120%;
  letter-spacing: 0.1em;
  color: #000000;
  min-height: 40px;
  margin-top: 6px;
}

.subtitle {
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

.btn {
  margin-bottom: 10px;
  font-size: 13px;
  padding: 5px 0;
}
</style>
