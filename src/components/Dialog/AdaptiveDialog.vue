<template>
  <div class="dialog flex-c">
    <div :class="`adaptive-form relative flex-as wrap`" v-if="status !== 2" key="status01">
      <img src="../../assets/img/nav-logo-2.png" alt="" class="logo">
      <div class="close" @click="closeAdaptiveDialog">
        <font-awesome :icon="['fa', 'slash']" />
        <font-awesome :icon="['fa', 'slash']" />
      </div>
      <div class="title">{{description}}</div>
      <div class="question" v-for="(q, index) in question" :key="q.title">
        <div class="q-title">{{`${index + 1}. ${q.content}`}}</div>
        <el-radio-group v-model="form.answer[index]">
          <el-radio-button v-for="option in q.option" :key="option.content" :label="option.code">{{option.content}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="submit-btn flex-c" @click="submitAdaptive">開始分析</div>
      <!-- <div class="bottom flex-c">
        <a href="">隱私權條款</a>
      </div> -->
    </div>
    <div :class="`adaptive-form relative flex-as wrap`" v-if="status === 2" key="status2">
      <div class="close" @click="closeAdaptiveDialog">
        <font-awesome :icon="['fa', 'slash']" />
        <font-awesome :icon="['fa', 'slash']" />
      </div>
      <div class="title">分析報告</div>
      <div class="result-title">
        推薦課程類型
      </div>
      <div class="cate-list">
        <div class="cate-item" v-for="cate in categories" :key="cate.value">
          {{findCategory(category_list, cate).label}}
        </div>
      </div>
      <div class="result-title">
        偏好分佈
      </div>
      <div class="cate-list">
        <v-chart :options="radarOption" class="chart" />
        <!-- <div class="cate-item" v-for="(cate, index) in result.categoryTendencyList" :key="`cate${index + 2}`">
            {{findCategory(category_list, Object.keys(cate)[0]).label}}:{{Object.values(cate)[0]}}
          </div> -->
      </div>
      <div class="result-title">
        推薦課程
      </div>
      <div class="cate-list">
        <div class="cate-item" v-for="cate in interest_list" :key="cate.id" @click="$router.push({path: '/detail', query: { id: cate.id, platform: cate.platform}})">
          {{cate.title}}
        </div>
      </div>

      <div class="reset-btn flex-c" @click="reTest">重新測驗</div>
      <div class="submit-btn flex-c" @click="save">儲存報告</div>
      <div style="height: 140px;"></div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import {
  getAdaptiveQuestion,
  resAdaptiveQuestion,
  saveAdaptive,
  searchCourse,
  getAdaptive,
} from '@/http/api'
import { category as category_list } from '@/info/category'
export default {
  name: 'adaptiveDialog',

  data() {
    return {
      category_list,
      interest_list: [],
      categories: [],
      form: {
        title: '',
        answer: ['', '', '', '', ''],
      },
      description: '',
      question: [],
      status: 0, // 0 初始 1 分析中 2 結果
      result: {},
      radarOption: {
        backgroundColor: '#222431',
        title: {
          text: '屬性分數',
          left: 'center',
          textStyle: {
            color: '#eee',
          },
        },
        radar: {
          indicator: [
            { name: '音樂', max: 20 },
            { name: '語言與學術', max: 20 },
            { name: '攝影', max: 20 },
            { name: '設計', max: 20 },
            { name: '創業與行銷', max: 20 },
            { name: '程式與軟體', max: 20 },
            { name: '投資與個人成長', max: 20 },
            { name: '職場技能', max: 20 },
            { name: '生活', max: 20 },
          ],
          shape: 'circle',
          splitNumber: 5,
          name: {
            textStyle: {
              color: 'rgb(238, 197, 102)',
            },
          },
          splitLine: {
            lineStyle: {
              color: [
                'rgba(238, 197, 102, 0.1)',
                'rgba(238, 197, 102, 0.2)',
                'rgba(238, 197, 102, 0.4)',
                'rgba(238, 197, 102, 0.6)',
                'rgba(238, 197, 102, 0.8)',
                'rgba(238, 197, 102, 1)',
              ].reverse(),
            },
          },
          splitArea: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(238, 197, 102, 0.5)',
            },
          },
        },
        // legend: {
        //   bottom: 5,
        //   data: ['北京', '上海', '广州'],
        //   itemGap: 20,
        //   textStyle: {
        //     color: '#fff',
        //     fontSize: 14,
        //   },
        //   selectedMode: 'single',
        // },
        // visualMap: {
        //     show: true,
        //     min: 0,
        //     max: 20,
        //     dimension: 6,
        //     inRange: {
        //         colorLightness: [0.5, 0.8]
        //     }
        // },
        series: [
          {
            name: '',
            type: 'radar',
            lineStyle: {
              normal: {
                width: 1,
                opacity: 0.5,
              },
            },
            data: [[55, 9, 56, 0.46, 18, 6, 1]],
            symbol: 'none',
            itemStyle: {
              color: '#F9713C',
            },
            areaStyle: {
              opacity: 0.1,
            },
          },
        ],
      },
    }
  },

  computed: {
    // ...mapGetters('user', ['isLogin', 'hasInterest']),
    // ...mapState('user', ['interests', 'name']),
  },
  methods: {
    closeAdaptiveDialog() {
      this.$store.commit('closeAdaptiveDialog')
    },

    submitAdaptive() {
      this.status = 1
      resAdaptiveQuestion(this.form).then((res) => {
        this.categories = res.categories
        this.interest_list = res.recommend_classes
        this.status = 2
        this.radarOption.series[0].data = [
          this.result.categoryTendencyList.map((c) => Object.values(c)[0]),
        ]
      })
    },

    findCategory(list, value) {
      // console.log(list, value)
      return _.find(list, { value })
    },

    save() {
      const data = {
        categoryTendencyList: this.result.categoryTendencyList,
        categories: this.result.categories,
      }

      saveAdaptive(data).then(() => {
        this.$message({
          message: '儲存成功，可至個人中心查看',
          type: 'success',
        })
        this.$store.commit('closeAdaptiveDialog')
      })
      this.closeAdaptiveDialog()
      if (this.$route.path.includes('quiz')) {
        this.$router.go(this.$router.currentRoute)
      }
    },

    reTest() {
      getAdaptiveQuestion().then((res) => {
        this.question = res.question
        this.form.title = res.title
        this.description = res.description
      })
      this.status = 1
    },
  },

  async mounted() {
    getAdaptive().then(async (res) => {
      if (res.userAdaptiveRecord.categoryTendencyList) {
        this.radarOption.series[0].data = [
          res.userAdaptiveRecord.categoryTendencyList.map(
            (c) => Object.values(c)[0],
          ),
        ]
        this.status = 2
        this.categories = res.userAdaptiveRecord.categories
        await Promise.all(
          this.categories.map(async (category) => {
            searchCourse({
              limit: 3,
              page: Math.floor(Math.random() * 3) + 1,
              sortway: 'DESC',
              sortvalue: 'avg_rating',
              category,
            }).then((res) => {
              this.interest_list.push(...res.courses)
            })
          }),
        )
      } else {
        getAdaptiveQuestion().then((res) => {
          this.question = res.question
          this.form.title = res.title
          this.description = res.description
        })
        this.status = 1
      }
    })

    // resAdaptiveQuestion(this.form).then(res => {
    //   this.result = res
    //   this.status = 2
    //   this.radarOption.series[0].data = [
    //     this.result.categoryTendencyList.map(c => Object.values(c)[0]),
    //   ]
    // })
    // this.selected_interests = this.transToInterest(this.category_list)
  },

  // async mounted() {
  //   getAdaptive().then(async (res) => {
  //     this.radarOption.series[0].data = [
  //       res.userAdaptiveRecord.categoryTendencyList.map(
  //         (c) => Object.values(c)[0],
  //       ),
  //     ]
  //   })
  // },
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

    .el-radio-button__orig-radio:checked:hover+.el-radio-button__inner {
      color: #fff;
    }
  }
}

.chart {
  width: 90vw;
  margin: 0 auto;
  > div {
    width: 100% !important;
  }
}

.logo {
  width: 97%;
  display: block;
  margin: 20px auto 40px;
}

.close {
  position: absolute;
  right: 0px;
  top: 0px;
  // z-index: 10;
  cursor: pointer;
  color: #fff;

  svg {
    position: absolute;
    top: 15px;
    right: 10px;

    &:nth-child(1) {
      transform: rotate(95deg);
    }

    &:nth-child(2) {
      transform: rotate(5deg);
    }
  }
}

.question {
  color: #fff;
  margin-bottom: 15px;
  .q-title {
    font-size: 14px;
    line-height: 1.3;
    margin-bottom: 8px;
  }

  &::v-deep .el-radio__label {
    color: #fff;
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
.google {
  width: 200px;
  height: 140px;
  background-color: brown;
  color: #fff;
  cursor: pointer;
}

.adaptive-form {
  // width: 640px;
  // height: 667px;
  padding: 20px 20px;
  background-color: #222431;
  border-radius: 5px;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.3);
  overflow-y: scroll;
  transition: all 0.3s;

  &.short {
    height: 500px;

    & .logo {
      width: 97%;
      display: block;
      margin: 20px auto 60px;
    }
  }

  &:hover {
    box-shadow: 0 40px 130px rgba(0, 0, 0, 0.4);
  }
}

.title {
  font-size: 19px;
  color: #fff;
  width: 100%;
  margin-bottom: 25px;
  text-align: left;
  width: 100%;
}

.result-title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 30px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.cate-list {
  color: #fff;
  letter-spacing: 1px;
  line-height: 1.3;
}

.btn {
  width: 100%;
  height: 40px;
  color: #fff;
  font-size: 18px;
  text-decoration: none;
  border-radius: 3px;
  margin: 0 auto;
  margin-bottom: 20px;
  cursor: pointer;
  svg {
    margin-right: 5px;
    width: 8px;
  }

  &:nth-last-child(1) {
    margin-bottom: 0;
  }

  &.fb {
    background-color: #4db8cc;
  }

  &.google {
    border: 1px solid #4db8cc;
    background-color: transparent;
    color: #4db8cc;
    font-weight: bold;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.bottom {
  width: 100%;
  height: 30px;
  position: absolute;
  background-color: #fff;
  bottom: 0;
  left: 0;

  a {
    color: #333;
    text-decoration: none;
    font-size: 14px;
  }
}

.interest-title {
  font-size: 16px;
  color: #fff;
  margin: 40px 0px 0px;
}

.interest-hint {
  font-size: 16px;
  color: #fff;
  margin: 20px 0px 0px;
}

.interests {
  width: 100%;
  margin: 10px -10px 20px;

  .item {
    padding: 5px 20px;
    background-color: transparent;
    border-radius: 3px;
    border: 1px solid #fff;
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    margin: 10px;
    cursor: pointer;
    transition: all 0.1s;

    &:hover {
      border: 1px solid #4db8cc;
      color: #4db8cc;
    }

    &.selected {
      background-color: #4db8cc;
      border: 1px solid #4db8cc;
      color: #fff;
    }
  }
}
.reset-btn {
  width: 160px;
  height: 35px;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  margin: 20px auto 10px;
  cursor: pointer;
}
.submit-btn {
  width: 160px;
  height: 35px;
  background-color: #cca04d;
  color: #fff;
  border-radius: 5px;
  margin: 20px auto;
  cursor: pointer;
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
    // align-items: center !important;
    // align-content: center;

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
