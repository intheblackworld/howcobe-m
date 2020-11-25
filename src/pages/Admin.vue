<template>
  <div class="admin">
    <el-dialog title="修改個人資料" width="90%" :visible.sync="isEditDialog">
      <el-form :model="form" :rules="editUserInfoRules" ref="editForm">
        <el-form-item label="姓名" prop="name" label-width="120px">
          <el-input placeholder="姓名" v-model="form.name" autocomplete="off" :disabled="$store.state.isFetchingData" />
        </el-form-item>

        <el-form-item label="感興趣課程" label-width="120px" prop="interests">
          <el-select multiple placeholder="選擇你感興趣的課程" v-model="form.interests" :disabled="$store.state.isFetchingData">
            <el-option v-for="item in category_list" :key="item.value" :label="item.label" :value="item.value" :disabled="form.interests.length >= 5">
            </el-option>
          </el-select>
          (至多五項)
        </el-form-item>
        <!-- <el-form-item
            label="銀行代號"
            prop="bank_code"
            label-width="120px"
          >
            <el-select
              v-model="form.bank_code"
              filterable
              placeholder="請輸入銀行代號"
              :disabled="$store.state.isFetchingData"
            >
              <el-option
                v-for="item in bank_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="銀行帳號"
            label-width="120px"
            prop="bank_account"
          >
            <el-input
              placeholder="銀行帳號"
              v-model="form.bank_account"
              autocomplete="off"
              @keyup.native="InputNumber('bank_account')"
              :disabled="$store.state.isFetchingData"
            />
          </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialog = false" style="margin-right: 15px">取消</el-button>
        <el-button type="primary" :disabled="$store.state.isFetchingData" @click="editUserInfo">確定</el-button>
      </span>
    </el-dialog>
    <div class="detail-thumb relative">
      <div class="darken-bg purple-bg frost">
        <div class="title">個人資訊&nbsp;&nbsp;&nbsp;&nbsp;
          <font-awesome :icon="['fa', 'pen-alt']" class="icon" @click="isEditDialog = true" />
        </div>
        <div class="desc">姓名：{{name}}</div>
        <div class="logout" @click="logout">登出</div>
      </div>
    </div>
    <div class="item-container flex wrap">
      <div :class="`item ${typeIndex === 0 ? 'active' : ''}`" @click="typeIndex = 0">
        收藏課程
      </div>
      <div :class="`item ${typeIndex === 1 ? 'active' : ''}`" @click="typeIndex = 1">
        收藏比課
      </div>
      <div :class="`item ${typeIndex === 2 ? 'active' : ''}`" @click="typeIndex = 2">
        參與投票
      </div>
      <div :class="`item ${typeIndex === 3 ? 'active' : ''}`" @click="typeIndex = 3">
        發起投票
      </div>
    </div>
    <div class="content-container">
      <div v-if="typeIndex === 0">
        <div v-if="collect_courses.length > 0">
          <SwipeCards :courses="collect_courses" @update="$store.dispatch('course/getCollectList')" />
        </div>
        <div v-else class="non-result-title">
          目前沒有收藏課程
          <div class="yellow round-big middle btn flex-c" @click="$router.push('/courses')">前往課程列表</div>
        </div>
      </div>

      <div v-if="typeIndex === 1">
        <div v-if="collect_compare.length > 0">
          <CompareLongCard v-for="compare in collect_compare" :key="compare.compare_course_id" :compare="compare" @update="$store.dispatch('course/getCollectCompare')" />
        </div>
        <div v-else class="non-result-title">
          目前沒有收藏比課
          <div class="yellow round-big middle btn flex-c" @click="$router.push('/compares')">前往比課專區</div>
        </div>
      </div>
      <div v-if="typeIndex === 2">
        <div v-if="result.vote_voter.length > 0">
          <VoteLongCard :vote="vote" v-for="vote in result.vote_voter" :key="vote.id"></VoteLongCard>
        </div>
        <div v-else class="non-result-title">
          目前沒有參與投票
          <div class="yellow round-big middle btn flex-c" @click="$router.push('/votes')">前往投票專區</div>
        </div>
      </div>
      <div v-if="typeIndex === 3">
        <div v-if="result.vote_organizer.length > 0">
          <VoteOrganCard :vote="vote" v-for="vote in result.vote_organizer" :key="vote.id"></VoteOrganCard>
        </div>
        <div v-else class="non-result-title">
          目前沒有發起投票
          <div class="yellow round-big middle btn flex-c" @click="$router.push('/votes')">前往投票專區</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import { get } from '@/http/axios'
import { findBank, bank_list } from '@/info/bank'
import { category as category_list } from '@/info/category'
import SwipeCards from '@/components/SwipeAdminCards.vue'
import CompareLongCard from '@/components/CompareLongAdminCard'
import VoteLongCard from '@/components/VoteLongAdminCard'
import VoteOrganCard from '@/components/VoteOrganAdminCard'
import {
  getBuyCourse,
  // getCollectCompare,
  deleteCollectCompare,
  withdraw,
  editUserInfo,
} from '@/http/api'
import { logout } from '@/util/auth.js'
// import Table from '@/components/Table.vue'

export default {
  name: 'admin',
  components: {
    // Table,
    SwipeCards,
    CompareLongCard,
    VoteLongCard,
    VoteOrganCard,
  },

  data() {
    return {
      isEditDialog: false,
      activeTab: 'collect_course',
      category_list: category_list.slice(1, category_list.length),
      buy_course_data: [],
      buy_course_label_list: [
        {
          label: '課程名稱',
          prop: 'order_goods',
        },
        {
          label: '購買日期',
          prop: 'order_date',
        },
        {
          label: '課程平台',
          prop: 'platform',
        },
        {
          label: '課程價格',
          prop: 'order_price',
        },
        {
          label: '購買狀態',
          prop: 'commission_status',
        },
        {
          label: '佣金',
          prop: 'user_commission',
        },
      ],
      collect_course_label_list: [
        {
          label: '課程名稱',
          prop: 'title',
        },
        {
          label: '課程平台',
          prop: 'platform',
        },
        {
          label: '購買人數',
          prop: 'consumers',
        },
        {
          label: '課程價格',
          prop: 'price',
        },
        {
          label: '課程長度(分)',
          prop: 'course_time_minute',
        },
      ],
      collect_compare_label_list: [],

      pocket: {
        all_commission: 0, // 總金額
        draw_money: 0, // 已提領
        wait_to_withdraw: 0, // 待提領
        wait_to_check: 0, // 待確認
      },

      form: {
        name: '',
        email: '',
        bank_code: '',
        bank_account: '',
        interests: [],
      },

      editUserInfoRules: {
        name: { required: true, message: '姓名為必填', trigger: 'blur' },
        bank_code: {
          required: true,
          message: '銀行代號為必填',
          trigger: 'blur',
        },
        bank_account: [
          { required: true, message: '銀行帳號為必填', trigger: 'blur' },
          { min: 11, max: 14, message: '銀行帳號限制在11碼到14碼之間' },
        ],
        interests: {
          required: true,
          message: '感興趣課程為必填',
          trigger: 'blur',
        },
        // name: { required: true, message: '姓名為必填', trigger: 'blur' },
      },

      bank_list,

      typeIndex: 0,
      result: {
        vote_organizer: [],
        vote_voter: [],
      },
    }
  },
  computed: {
    ...mapState('user', [
      'name',
      'email',
      'bank_code',
      'bank_account',
      'draw_status',
      'interests',
    ]),
    ...mapState('course', ['collect_list', 'collect_compare']),

    collect_courses() {
      if (this.collect_list) {
        return this.collect_list.map((course) => ({
          course_id: course.course_id,
          ...course.like_course,
        }))
      } else {
        return []
      }
    },
    // collect_compare_data() {
    //   return this.formatCollectCompareData(this.collect_compare)
    // },
  },

  methods: {
    async getMyVotes() {
      this.result = await this.$store.dispatch('vote/getMyVotes')
      // let addon
      // switch (this.type) {
      //   default:
      //     if (this.$route.query.search) {
      //       this.form.search = this.$route.query.search
      //     }

      //     // if (this.$route.query.category) {
      //     //   this.form.category = this.transCategory(this.$route.query.category)
      //     // }
      // addon = await this.$store.dispatch('vote/getMyVotes', {
      //   ...this.form,
      // })
      //     // console.log(addon)
      //     break
      // }
      // this.result = {
      //   ...addon,
      //   votes: [...this.result.votes, ...addon.voteCompareCourses],
      // }
      // console.log(this.result)
    },
    handleClick() {},

    InputNumber(property) {
      this.form[property] = this.limitInputNumber(this.form[property])
    },

    limitInputNumber(val) {
      if (val) {
        return String(val).replace(/\D/g, '')
      }
      return val
    },

    formatCollectCompareData(my_like_compare_course) {
      return my_like_compare_course.map((item) => ({
        _id: item._id,
        name: (item.user && item.user.name) || '訪客',
        title: '',
        platform: _.uniq(item.courses.map((course) => course.platform)),
        price: item.courses.reduce((a, b) => ({ price: a.price + b.price }))
          .price,
        consumers: item.courses.reduce((a, b) => ({
          consumers: a.consumers + b.consumers,
        })).consumers,
        course_time_minute: item.courses.reduce((a, b) => ({
          course_time_minute: a.course_time_minute + b.course_time_minute,
        })).course_time_minute,
        children: item.courses,
      }))
    },

    deleteCompare(row) {
      // console.log(row)
      if (row._id) {
        deleteCollectCompare(row._id).then(async () => {
          await this.$store.dispatch('course/getCollectCompare')
        })
      }
    },

    goCourse(row) {
      get('/ichannel/url', {
        platform: row.platform,
        platform_id: row.id,
      }).then((res) => {
        // console.log(res.url)
        window.open(res.url)
        // https://product.mchannles.com/redirect_wa.php?k=2f8rH&tourl=https://hahow.in/courses/5d77176845639e00212bc562&uid1=user01&uid2=hahow
      })
    },

    withdraw() {
      if (!this.bank_code || !this.bank_account) {
        this.$message({
          message: '請先填寫銀行資料',
          type: 'warning',
        })
      } else {
        withdraw().then(() => {
          this.$message({
            message: '已申請提領成功',
            type: 'success',
          })
        })
      }
    },

    editUserInfo() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editUserInfo({
            name: this.form.name,
            // email: this.form.email,
            // bank_code: this.form.bank_code,
            // bank_account: this.form.bank_account,
            interests: this.form.interests,
          }).then(async () => {
            this.$message({
              message: '修改成功',
              type: 'success',
            })

            this.isEditDialog = false
            await this.$store.dispatch('user/getUserInfo')
            await this.$store.dispatch('course/getInterestsCourse')

            this.form = {
              name: this.name,
              email: this.email,
              // bank_code: this.bank_code,
              // bank_account: this.bank_account,
              interests: this.interests,
            }
          })
        } else {
          return false
        }
      })
    },

    findBank(val) {
      return findBank(val)[0].label
    },
    logout() {
      logout.bind(this)(this, false)
    },
  },

  async mounted() {
    await this.$store.dispatch('user/getUserInfo')

    this.form = {
      name: this.name,
      email: this.email,
      bank_code: this.bank_code,
      bank_account: this.bank_account,
      interests: this.interests,
    }

    // 已購課程
    getBuyCourse({
      order_star_time: '20200401',
      order_end_time: moment().format('YYYYMMDD'),
    }).then((res) => {
      if (res.error_question) {
        this.buy_course_data = []
      } else {
        this.buy_course_data = res.order
        this.pocket = res.statistics
      }
    })

    // 收藏課程
    this.$store.dispatch('course/getCollectList')

    // 收藏比課
    await this.$store.dispatch('course/getCollectCompare')

    // 投票相關
    await this.getMyVotes()
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/function.scss';
.admin {
  background-color: #eee;
  min-height: 100vh;
  // padding-top: 80px;
}

.container {
  background-color: #fff;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2);
}

.title {
  font-size: size(32);
  margin-bottom: 20px;
}

.desc {
  font-size: size(18);
  color: #666;
  margin-bottom: 15px;
}

.icon {
  margin-left: 15px;
  cursor: pointer;
}

.row-platfom {
  width: 45px;
  margin: 0px 5px;
  box-shadow: 0 1px 2px 0 #333;
}

.withdraw-btn {
  margin-bottom: 20px;
}

.ps {
  color: #666;
  margin-top: 10px;
}

.detail-thumb {
  width: 100vw;
  min-height: 160px;
  position: relative;
  margin-top: 0px;
  opacity: 0;
  z-index: 0;
  background: linear-gradient(to right, #333, #505763);
  animation: slide-in 0.5s ease 0.8s forwards;
  > div {
    padding: 20px;
  }
  .title {
    font-size: 16px;
    color: #fff;
  }

  .desc {
    font-size: 14px;
    color: #ccc;
  }
}

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

.item-container {
  background: #fff;
  // border-radius: 16px;
  width: 100%;
  margin: -30px auto 0;
  position: relative;
  z-index: 3;
  padding: 15px;

  .item {
    width: 25%;
    position: relative;
    text-align: center;

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
}

.logout {
  border-radius: 25px / 25px;
  border: 1px solid #fff;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  color: #fff;
}

.non-result-title {
  font-size: 20px;
  color: #888;
  margin-top: 100px;
  padding: 0 20px;
  line-height: 1.3;
  text-align: center;
}

.btn {
  margin: 0 auto;
  margin-top: 30px;
  width: 50%;
}

/* 螢幕尺寸標準 */
/* 手機尺寸 */
@media screen and (max-width: 767px) {
  .admin::v-deep {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .el-button + .el-button {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  .title {
    font-size: 18px;
  }
  .desc {
    font-size: 14px;
    svg {
      font-size: 20px;
    }
  }
}
</style>
