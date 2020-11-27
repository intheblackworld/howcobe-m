<template>
  <div class="dialog flex-c">
    <div :class="`login-form relative wrap ${(isLogin && !hasInterest) ? '' : 'short'}`">
      <img src="../../assets/img/nav-logo-2.png" alt="" class="logo">
      <div class="close" @click="closeLoginDialog">
        <font-awesome :icon="['fa', 'slash']" />
        <font-awesome :icon="['fa', 'slash']" />
      </div>
      <div v-if="!isLogin">
        <div class="title">登入/註冊</div>
        <div class="form-group">
          <div class="btn google flex-c" @click="googleLogin">Google 登入</div>
          <div class="btn fb flex-c" @click="fbLogin">Facebook 登入</div>
        </div>
      </div>
      <div v-else>
        <div class="title">{{name ? `哈囉，${name}`: ''}}</div>
      </div>
      <div v-if="isLogin && !hasInterest">
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
        <!-- <a href="">隱私權條款</a> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { googleLogin, fbLogin, editUserInfo } from '@/http/api'
import { category as category_list } from '@/info/category'
export default {
  name: 'loginDialog',

  data() {
    return {
      category_list: category_list.slice(1, category_list.length),
      selected_interests: [],
    }
  },

  computed: {
    ...mapGetters('user', ['isLogin', 'hasInterest']),
    ...mapState('user', ['interests', 'name']),

    selected_interests_count() {
      return this.selected_interests.filter(item => item.selected === true)
        .length
    },
  },
  methods: {
    googleLogin() {
      googleLogin().then(res => {
        window.location.href = res.url
      })
    },
    fbLogin() {
      fbLogin().then(res => {
        window.location.href = res.url
      })
    },

    transToInterest(category_list) {
      return category_list.map(category => ({ ...category, selected: false }))
    },

    select_interest(interest) {
      const objIndex = this.selected_interests.findIndex(
        obj => obj.value === interest.value,
      )
      if (this.selected_interests_count >= 5) {
        this.selected_interests[objIndex].selected = false
      } else {
        this.selected_interests[objIndex].selected = !this.selected_interests[
          objIndex
        ].selected
      }
    },

    closeLoginDialog() {
      if (this.isLogin && this.selected_interests_count === 0) {
        this.$message({
          message: '請先選擇感興趣的課程',
          type: 'warning',
        })
      } else {
        this.$store.commit('closeLoginDialog')
      }
    },

    updateInterests() {
      editUserInfo({
        interests: this.selected_interests
          .filter(item => item.selected === true)
          .map(i => i.value),
      }).then(async () => {
        this.$message({
          message: '修改成功',
          type: 'success',
        })
        await this.$store.dispatch('user/getUserInfo')
        await this.$store.dispatch('course/getInterestsCourse')
        this.$store.commit('closeLoginDialog')
        this.$store.commit('openAdaptiveDialog')
      })
    },
  },

  async mounted() {
    this.selected_interests = this.transToInterest(this.category_list)
  },
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

.login-form {
  width: 100vw;
  height: 100vh;
  padding: 20px 30px;
  background-color: #222431;
  border-radius: 5px;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;

  &.short {
    height: 100vh;
    overflow-y: scroll;

    & .logo {
      width: 97%;
      display: block;
      margin: 20px auto 20px;
    }
  }

  &:hover {
    box-shadow: 0 40px 130px rgba(0, 0, 0, 0.4);
  }
}

.title {
  font-size: 16px;
  color: #fff;
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
  width: 100%;
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
    border: 1px solid #4db8cc;
    background-color: transparent;
    color: #4db8cc;
    font-weight: bold;
  }

  &.google {
    background-color: #4db8cc;

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
    // margin-bottom: 100px !important;
  }
  .login-form {
    height: 100vh;
    // display: flex;
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
