// 需權限頁面
const restrict_list = [
  'admin',
]
// 判斷此頁面是否需要權限
export default routeName => routeName && restrict_list.every(name => routeName.includes(name))
