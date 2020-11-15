<template>
  <div class="block-head flex-ac flex-jb">
    <div class="title">
      {{title}}
    </div>
    <router-link tag="div" class="link flex-c" :to="link.to">
      {{link.name}}
      <img src="@/assets/img/icons/chevron-right.png" alt="">
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'block_head',
  props: ['title', 'link'],
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.block-head {
  width: 100vw;
  padding: 0 10px;
  margin: 30px 0 24px;
}
.title {
  font-size: 18px;
  line-height: 100%;
  text-align: center;
  letter-spacing: 0.1em;
  position: relative;

  &::after {
    content: '';
    width: 40px;
    border-bottom: 3px solid #f9d849;
    position: absolute;
    bottom: -10px;
    left: 0;
  }
}

.link {
  color: #333;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0.1em;
}
</style>