<template>
  <div class="dialog flex-c">
    <div :class="`newbie-form relative flex-c wrap`" key="status01">
      <img src="../../assets/img/nav-logo-2.png" alt="" class="logo">
      <div class="submit-btn flex-ac" @click="enterQuiz">我是新手<br />請給我推薦課程 (30秒測驗)</div>
      <div class="ghost-btn flex-ac" @click="passQuiz">我是老手<br />跳過適性測驗</div>
      <!-- <div class="bottom flex-c"> -->
      <!-- <a href="">隱私權條款</a> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
// import { mapState, mapGetters } from 'vuex'
// import _ from 'lodash'
// import {
//   getAdaptiveQuestion,
//   resAdaptiveQuestion,
//   saveAdaptive,
// } from '@/http/api'
// import { category as category_list } from '@/info/category'
export default {
  name: 'newBieDialog',

  data() {
    return {}
  },

  computed: {
    // ...mapGetters('user', ['isLogin', 'hasInterest']),
    // ...mapState('user', ['interests', 'name']),
  },
  methods: {
    closeAdaptiveDialog() {
      this.$store.commit('closeAdaptiveDialog')
    },

    enterQuiz() {
      // this.$store.commit('closeNewBieDialog')
      this.$store.commit('openAdaptiveDialog')
    },

    passQuiz() {
      // this.$store.commit('closeNewBieDialog')
      this.$store.commit('user/passQuiz')
    },

    // submitAdaptive() {
    //   this.status = 1
    //   resAdaptiveQuestion(this.form).then((res) => {
    //     this.result = res
    //     this.status = 2
    //     this.radarOption.series[0].data = [
    //       this.result.categoryTendencyList.map((c) => Object.values(c)[0]),
    //     ]
    //   })
    // },

    // findCategory(list, value) {
    //   // console.log(list, value)
    //   return _.find(list, { value })
    // },
  },

  async mounted() {},
}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(56, 71, 94, 0.9);
  z-index: 1000;
  // background-color: #999;

  &::v-deep {
    .el-radio-button__inner {
      background: transparent;
      color: #fff;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #428d9b;
      border-color: #428d9b;
      color: #fff;
      box-shadow: none;
    }
    .el-radio-button__inner:hover {
      color: #333;
      background: #fff;
    }

    .el-radio-button__orig-radio:checked:hover + .el-radio-button__inner {
      color: #fff;
    }
  }
}

.chart {
  width: 90%;
  margin: 0 auto;
  > div {
    width: 100% !important;
  }
}

.newbie-form {
  width: 100%;
  height: 100vh;
  padding: 20px 0px;
  background-color: #25243c;
  border-radius: 5px;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.3);
  overflow-y: scroll;
  transition: all 0.3s;

  &.short {
    height: 500px;
  }

  &:hover {
    box-shadow: 0 40px 130px rgba(0, 0, 0, 0.4);
  }

  & .logo {
    width: 90%;
    display: block;
    margin: 20px auto 20px;
  }
}

.submit-btn {
  width: 90%;
  height: 60px;
  background: linear-gradient(95.61deg, #c669ff -3.41%, #5487ff 103.97%);
  color: #fff;
  border-radius: 35px;
  margin: 20px auto;
  padding: 0 40px;
  text-align: left;
  font-size: 16px;
  letter-spacing: 0.8px;
  line-height: 1.3;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(95.61deg, #5487ff -3.41%, #c669ff 103.97%);
  }
}

.ghost-btn {
  width: 90%;
  height: 60px;
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 35px;
  margin: 20px auto;
  padding: 0 40px;
  text-align: left;
  font-size: 16px;
  letter-spacing: 0.8px;
  line-height: 1.3;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #25243c;
    background: #fff;
  }
}

.cate-item {
  margin-bottom: 5px;
  text-decoration: underline;
}

/* 螢幕尺寸標準 */
/* 平板尺寸 */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
}

/* 螢幕尺寸標準 */
/* 手機尺寸 */
@media screen and (max-width: 767px) {
  .logo {
    // margin-bottom: 100px !important;
  }
  .adaptive-form {
    height: 100vh;
    display: flex;
    align-items: center !important;
    align-content: center;

    > div {
      width: 100%;
    }

    &.short {
      height: 100vh;
    }
  }

  .back {
    position: fixed;
    left: 20px;
    top: 20px;
    z-index: 10;
    cursor: pointer;
    color: #fff;
  }

  .form-group {
  }
}
</style>
