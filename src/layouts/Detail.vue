<template>
  <div>
    <router-view></router-view>
    <Navigator />
  </div>
</template>

<script>
import Navigator from '@/components/Navigator.vue'

export default {
  name: 'detail_layout',
  components: {
    Navigator,
  } 
}
</script>

<style>
</style>
