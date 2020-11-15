<template>
  <div class="default">
    <Header />
    <router-view></router-view>
    <Navigator />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Navigator from '@/components/Navigator.vue'

export default {
  name: 'default_layout',
  components: {
    Header,
    Navigator,
  } 
}
</script>

<style lang="scss" scoped>
.default {
  
}
</style>
