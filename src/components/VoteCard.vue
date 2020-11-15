<template>
  <router-link class="vote-card" tag="div" :to="`/detail/vote?id=${vote.id}`">
    <div class="title">
      {{sliceTitle(vote.title)}}
    </div>
    <div class="imgs flex-ac flex-jr">
      <img :src="course.cover_image" alt="" v-for="course in vote.courses" :key="course.id">
    </div>
    <div class="subtitle">
      共計<span>{{vote.courses.length}}</span>門課程正在投票
    </div>
    <div class="vote-count">
      參與投票: <span>{{vote.vote_sum_count}}人</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'voteCard',
  data() {
    return {}
  },
  props: {
    vote: {
      default: {},
    },
  },

  computed: {},

  methods: {
    sliceTitle(text) {
      return text.slice(0, 20) + `${text.length > 20 ? '...' : ''}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.vote-card {
  // box-shadow: 0 1px 3px 0 rgba(0,0,0, .3);
  // background-color: #fff;
  width: calc(50% - 24px);
  height: 105px;
  margin: 0 12px;
  position: relative;
}

.title {
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.1em;
  color: #000000;
  min-height: 30px;
}

.subtitle {
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #666666;
  margin: 10px 0 10px;
  text-align: right;

  span {
    color: #be272d, 100%;
  }
}

.vote-count {
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #666666;
  margin: 10px 0 10px;
  text-align: right;
}

.imgs {
  img {
    width: 26px;
    margin: 5px;
  }
}
</style>
