<template>
  <div class="category-list dark flex wrap">
    <div class="category-item flex-c wrap" v-for="category in category_list" :key="`category-${category.value}`" @click="$router.push(`/courses?category=${category.value}`)">
      <img :src="category.icon" alt="" class="category-icon">
      <div class="category-name">
        {{category.label}}
      </div>
    </div>
  </div>
</template>

<script>
// import { category as category_list } from '@/info/category'
export default {
  name: 'category_list',
  data() {
    return {
      category_list: [
        {
          label: '全部課程',
          value: '',
          icon: require('@/assets/img/icons/all.png'),
        },
        { label: '音樂', value: 'music', icon: require('@/assets/img/icons/music.png') },
        {
          label: '語言與學術',
          value: 'language&academics',
          icon: require('@/assets/img/icons/language.png'),
        },
        {
          label: '攝影',
          value: 'photography',
          icon: require('@/assets/img/icons/camera.png'),
        },
        {
          label: '設計',
          value: 'design',
          icon: require('@/assets/img/icons/design.png'),
        },
        {
          label: '創業與行銷',
          value: 'marketing',
          icon: require('@/assets/img/icons/startup.png'),
        },
        {
          label: '程式與軟體',
          value: 'programming',
          icon: require('@/assets/img/icons/code.png'),
        },
        {
          label: '投資與成長',
          value: 'investment&growth',
          icon: require('@/assets/img/icons/investment.png'),
        },
        {
          label: '職場技能',
          value: 'career-skills',
          icon: require('@/assets/img/icons/work.png'),
        },
        {
          label: '生活',
          value: 'lifestyle',
          icon: require('@/assets/img/icons/life.png'),
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.category-item {
  width: 20%;
  height: 80px;
}

.category-icon {
  margin-bottom: 12px;
  width: 24px;
}
.category-name {
  width: 100%;
  text-align: center;
  font-size: 12px;  
}
</style>