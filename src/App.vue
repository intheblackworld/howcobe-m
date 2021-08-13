<template>
  <div id="app" ref="quicklink">
    <div ref="gtmNoScript" />
    <trans-page>
      <router-view />
    </trans-page>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<style lang="scss">
</style>

<script>
import gtm from "@/mixin/gtm.js";
import TransPage from "@/components/TransPage.vue";
import liff from "@line/liff";
import { isPC } from "@/util/device.js";
// import { get } from "@/http/axios";
import axios from "axios";
// import { lineLogin } from "@/http/api";
export default {
  name: "App",

  mixins: [gtm],
  data() {
    return {
      isPC
    };
  },
  components: {
    TransPage
  },

  async mounted() {
    // window.alert('liff')
    await liff.init({
      liffId: process.env.VUE_APP_LIFF_ID
    });

    if (liff.isLoggedIn()) {
      if (!this.$store.state.user.refresh_token) {
        const res = await axios("/line");
        window.location.href = res.data.url;
      }
    }
    // .then(() => {
    // window.alert('liff3~')
    // let context = liff.getContext();

    // let profile = liff.getProfile().then(function(p){
    //     window.alert('profile:',p)
    // })
    // 手機開啟liff
    // console.log(liff.isLoggedIn());

    // var user = liff.getDecodedIDToken();
    // var email = user.email;
    // console.log("email:", email);
    // })
    // .catch(function(error) {
    //   window.alert(error)
    // });
    // window.alert(liff.isLoggedIn(), "是否登入");
  }
};
</script>