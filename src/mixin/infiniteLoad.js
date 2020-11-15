export default {
  data() {
    return {
      busy: false,
    }
  },

  methods: {
    async loadMore(currentPage, totalPage) {
      // console.log(123123123)
      if (this.busy) {
        return
      }
      if (currentPage >= totalPage) {
        return
      }
      this.busy = true
      // TODO 資料數超過的時候不能抓
      this.form.page = this.form.page + 1
      const path = this.$route.path
      if (path.includes('/course') || path.includes('/compares')) {
        await this.addCourse()
      } else if (path.includes('/vote')) {
        await this.getVotes()
      }
      // setTimeout(() => {
      this.busy = false
      // }, 500)
    },
  }
}
