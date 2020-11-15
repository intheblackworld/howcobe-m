<template>
  <div class="dialog flex-c">
    <div :class="`vote-form relative flex-as wrap`">
      <!-- <img src="../assets/img/nav-logo-2.png" alt="" class="logo"> -->
      <div class="vote-head relative yellow">
        <div class="dialog-title">發起課程投票</div>
        <div class="dialog-close" @click="closeDialog">
          <font-awesome :icon="['fa', 'slash']" />
          <font-awesome :icon="['fa', 'slash']" />
        </div>
      </div>
      <el-form :model="form" :rules="voteInfoRules" ref="voteForm" class="flex-ac flex-jb wrap form">
        <div>
          <el-form-item prop="title">
            <div class="label">想問的問題</div>
            <el-input placeholder="想要轉職工程師從哪一門課程學比較好？" v-model="form.title" autocomplete="off" :disabled="$store.state.isFetchingData" />
          </el-form-item>
          <el-form-item prop="category">
            <div class="label">投票分類</div>
            <el-select v-model="form.category" placeholder="請選擇分類">
              <el-option v-for="item in category_list" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="description">
            <div class="label">問題描述</div>
            <el-input placeholder="目前剛入職一年，文科背景出身，對程式一竅不通，算是零基礎，這樣的我要選哪一門線上課程開始會比較好入門呢？" v-model="form.description" type="textarea" autocomplete="off" :disabled="$store.state.isFetchingData" />
          </el-form-item>
        </div>
        <div>
          <el-form-item>
            <div class="label">所選課程</div>
            <div class="flex flex-jb wrap">
              <div class="item relative" :key="item.id" v-for=" item in compare_list">
                <img :src="item.cover_image" alt="" class="item-img">
                <div class="item-title">
                  {{item.title}}
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="submit neon-yellow round-big big btn flex-c" @click="submit">確認送出</div>
      </el-form>

      <!-- <div v-if="!isLogin">
          <div class="title">登入/註冊</div>
          <div class="form-group">
            <div class="btn fb flex-c" @click="fbLogin">Facebook 登入</div>
            <div class="btn google flex-c" @click="googleLogin">Google 登入</div>
          </div>
      </div> -->
      <!-- <div v-else>
        <div class="title">{{name ? `哈囉，${name}`: ''}}</div>
      </div> -->
      <!-- <div v-if="isLogin && !hasInterest">
        <div class="interest-title">請選擇感興趣的課程</div>
        <div class="interests flex wrap ">
          <div :class="`item ${interest.selected ? 'selected' : ''}`" v-for="interest in selected_interests" @click="select_interest(interest)" :key="interest.value">
            {{interest.label}}
          </div>
        </div>
        <div class="interest-hint">至多五項</div>
        <div class="interest-btn flex-c" v-if="selected_interests_count > 0" @click="updateInterests">送出</div>
      </div>
      <div class="bottom flex-c">
        <a href="">隱私權條款</a>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  mapState,
  // mapGetters
} from 'vuex'
import { vote_category as category_list } from '@/info/category'
import { addVote } from '@/http/api'

export default {
  name: 'voteDialog',

  data() {
    return {
      // category_list: category_list.slice(1, category_list.length),
      // selected_interests: [],
      category_list,
      form: {
        category: '',
        title: '',
        description: '',
      },
      voteInfoRules: {
        title: { required: true, message: '問題為必填', trigger: 'blur' },
        description: { required: true, message: '敘述為必填', trigger: 'blur' },
        category: { required: true, message: '分類為必填', trigger: 'blur' },
      },
    }
  },

  computed: {
    // ...mapGetters('user', ['isLogin', 'hasInterest']),
    ...mapState('user', ['interests', 'name']),
    ...mapState('course', ['compare_list', 'compare_course_id']),

    selected_interests_count() {
      return this.selected_interests.filter(item => item.selected === true)
        .length
    },
  },
  methods: {
    submit() {
      this.$refs.voteForm.validate(valid => {
        if (valid) {
          addVote({
            compare_course_id: this.compare_course_id,
            title: this.form.title,
            description: this.form.description,
            category: this.form.category,
          }).then(async () => {
            this.$message({
              message: '成功發起投票',
              type: 'success',
            })

            this.closeDialog()
          })
        } else {
          return false
        }
      })
    },
    // googleLogin() {
    //   googleLogin().then(res => {
    //     window.location.href = res.url
    //   })
    // },
    // fbLogin() {
    //   fbLogin().then(res => {
    //     window.location.href = res.url
    //   })
    // },

    // transToInterest(category_list) {
    //   return category_list.map(category => ({ ...category, selected: false }))
    // },

    // select_interest(interest) {
    //   const objIndex = this.selected_interests.findIndex(
    //     obj => obj.value === interest.value,
    //   )
    //   if (this.selected_interests_count >= 5) {
    //     this.selected_interests[objIndex].selected = false
    //   } else {
    //     this.selected_interests[objIndex].selected = !this.selected_interests[
    //       objIndex
    //     ].selected
    //   }
    // },

    closeDialog() {
      this.$emit('closeDialog')
      // if (this.isLogin && this.selected_interests_count === 0) {
      //   this.$message({
      //     message: '請先選擇感興趣的課程',
      //     type: 'warning',
      //   })
      // } else {
      // this.$store.commit('closeDialog')
      // }
    },

    // updateInterests() {
    //   editUserInfo({
    //     interests: this.selected_interests
    //       .filter(item => item.selected === true)
    //       .map(i => i.value),
    //   }).then(async res => {
    //     this.$message({
    //       message: '修改成功',
    //       type: 'success',
    //     })
    //     await this.$store.dispatch('user/getUserInfo')
    //     await this.$store.dispatch('course/getInterestsCourse')
    //     this.$store.commit('closeDialog')
    //   })
    // },
  },

  async mounted() {
    // this.selected_interests = this.transToInterest(this.category_list)
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.7);
  z-index: 1000;
  // background-color: #999;

  &::v-deep .el-input,
  &::v-deep .el-textarea {
    .el-input__inner {
      background-color: #121220;
      background-image: none;
      border-radius: 8px;
      letter-spacing: 0.1em;
      border: none;
      box-sizing: border-box;
      color: #fff;
      display: inline-block;
      font-size: inherit;
      height: 38px;
      line-height: 38px;
      outline: 0;
      padding: 0 15px;
      &::placeholder {
        color: #999;
      }
    }
    .el-textarea__inner {
      display: block;
      resize: vertical;
      padding: 20px 15px 40px;
      line-height: 1.5;
      letter-spacing: 0.1em;
      box-sizing: border-box;
      width: 100%;
      font-size: inherit;
      color: #fff;
      background-color: #121220;
      background-image: none;
      border-radius: 8px;
      border: none;
      font-family: Arial, Helvetica, sans-serif;
      &::placeholder {
        color: #999;
      }
    }
  }
}

// .logo {
//   width: 97%;
//   display: block;
//   margin: 20px auto 40px;
// }

.dialog-title {
  padding: 15px 20px;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0.1em;
}

.dialog-close {
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

.el-form {
  padding: 20px;
}

.label {
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin-bottom: 15px;
}
.item {
  width: 47%;
  height: 123px;
  margin-bottom: 15px;
}

.item-title {
  width: 100%;
  // height: 20px;
  padding: 5px 10px;
  background: rgba(18, 18, 32, 0.7);
  color: #fff;
  font-size: 12px;
  line-height: 1.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
}
.item-img {
  width: 100%;
  height: 123px;
  object-fit: cover;
}
.vote-form {
  width: 100vw;
  // height: 667px;
  // padding: 20px 30px;
  background-color: #222431;
  overflow: hidden;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.3);
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

.form {
  > div {
    width: 45%;
  }
}

.vote-head {
  height: 44px;
}

.title {
  font-size: 16px;
  color: #fff;
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
  width: 100%;
}

.submit {
  width: 360px;
  margin: 0 auto;
  padding: 20px 0;
}

// .btn {
//   width: 100%;
//   height: 40px;
//   color: #fff;
//   font-size: 18px;
//   text-decoration: none;
//   border-radius: 3px;
//   margin: 0 auto;
//   margin-bottom: 20px;
//   cursor: pointer;
//   svg {
//     margin-right: 5px;
//     width: 8px;
//   }

//   &:nth-last-child(1) {
//     margin-bottom: 0;
//   }

//   &.fb {
//     background-color: #4db8cc;
//   }

//   &.google {
//     border: 1px solid #4db8cc;
//     background-color: transparent;
//     color: #4db8cc;
//     font-weight: bold;

//     svg {
//       width: 20px;
//       height: 20px;
//     }
//   }
// }

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

.interest-btn {
  width: 160px;
  height: 35px;
  background-color: #4db8cc;
  color: #fff;
  border-radius: 5px;
  margin: 20px auto;
  cursor: pointer;
}
/* 螢幕尺寸標準 */
/* 平板尺寸 */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
}

/* 螢幕尺寸標準 */
/* 手機尺寸 */
@media screen and (max-width: 767px) {
  .logo {
    margin-bottom: 100px !important;
  }

  .vote-head {
    width: 100vw;
  }
  .vote-form {
    height: 100vh;
    display: flex;
    overflow-y: scroll;
    // align-items: center !important;
    // align-content: center;

    .form > div {
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
