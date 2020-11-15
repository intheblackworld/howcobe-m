import _ from 'lodash'
export const category = [
  { label: '全部課程', value: '', },
  { label: '音樂', value: 'music', },
  { label: '語言與學術', value: 'language&academics', },
  { label: '攝影', value: 'photography', },
  { label: '設計', value: 'design', },
  { label: '創業與行銷', value: 'marketing', },
  { label: '程式與軟體', value: 'programming', },
  { label: '投資與個人成長', value: 'investment&growth', },
  { label: '職場技能', value: 'career-skills', },
  { label: '生活', value: 'lifestyle', },
  // { label: '其他', value: 'others', },
]

export const vote_category = [
  {
    label: '全部投票',
    value: 'all'
  },
  {
    label: '興趣相關',
    value: 'hobby'
  },
  {
    label: '工作相關',
    value: 'work'
  },
  {
    label: '個人成長相關',
    value: 'grow-up'
  },
  {
    label: '人際相關',
    value: 'friend'
  },
  {
    label: '其他投票',
    value: 'others'
  },
]

export const transCategory = (value) => {
  const item = _.find(category, { value })
  if (item) {
    return item.label
  } else {
    return '其他'
  }
}
