import { get, post, remove } from './axios'

// post 範例
export const updateUserInfo = (data) => post('/api/user/updateUserInfo', data)

// 暫定拿課程列表，希望預計新增分類 filter(熱門, 推薦，好評)
export const getHotCourse = ({ limit = 8, page = 1 }) => get('/courses', { limit, page, sortway: 'DESC', sortvalue: 'consumers' })

export const getNewCourse = ({ limit = 8, page = 1 }) => get('/courses', { limit, page, sortway: 'DESC', sortvalue: 'published_at' })

export const getFiveStarCourse = ({ limit = 8, page = 1 }) => get('/courses', { limit, page, sortway: 'DESC', sortvalue: 'avg_rating' })

export const getInterestsCourse = ({ limit = 8, page = 1, category }) => {
  return get('/courses', { limit, page, sortway: 'DESC', sortvalue: 'avg_rating', categories: `["${category.join('","')}"]` })
}

// 快速搜尋用的搜尋列表
export const getQuickCourse = () => get('/courses-list', {})

export const searchCourse = ({ limit = 12, page = 1, search = '', sortway = 'DESC', category, sortvalue = '' }) => get('/courses', {
  limit,
  page,
  search,
  category,
  sortvalue,
  sortway,
})

export const getCourseDetail = ({ id }) => get(`/course/${id}`, {})

export const fbLogin = () => get('/facebook', {})
export const googleLogin = () => get('/google', {})
export const getUserInfo = () => get('/user/me', {})
export const editUserInfo = (data) => post('/user/me', data)

export const getToken = (data) => post('/token', data)

export const getBuyCourse = ({ order_start_time, order_end_time }) => get('/user/order', {
  order_start_time,
  order_end_time,
})

// 收藏課程相關
export const getCollectList = () => get('/like-course', {})
export const addCollectCourse = (course_id) => post('/like-course', { course_id })
export const deleteCollectCourse = (id) => remove(`/like-course/${id}`, {})

// 收藏比課相關
export const getCollectCompare = () => get('/like-compare-course', {})
export const addCollectCompare = (compare_course_id) => post('/like-compare-course', { compare_course_id })
export const deleteCollectCompare = (_id) => remove(`/like-compare-course/${_id}`, {})

// 比課列表相關
export const getCompareStack = () => get('/search-compare-course', {})
export const getCompareHot = () => get('/search-compare-course-hot', {})
export const addCompareStack = ({ course_ids }) => post('/search-compare-course', { course_ids })

// 學習地圖相關
export const getLearningMaps = () => get('/learningmaps', {})
export const getLearningMapDetail = ({ id }) => get(`/learningmap/${id}`, {})

// 投票相關
export const getVotes = ({ limit = 10, page = 1, category = 'all', search = '' }) => get('/vote-compare-courses', { limit, page, category, search })

export const getVoteDetail = ({ id }) => get(`/vote-compare-course/${id}`, {})
export const getMyVotes = () => get('/my-vote', {})

// 發起投票
export const addVote = (data) => post('/vote-compare-course', data)
export const voteCompare = (data) => post('/vote-vcc', data)
// let a = {
//   "course_id": "795df86c-4280-44e5-9c55-2655da022bcc",
//   "choice_index": 0,
//   "vote_compare_courses_id": "b041bc24-045e-45a3-b766-34d84fcbf2f1",
//   "courses_id": [
//     "795df86c-4280-44e5-9c55-2655da022bcc",
//     "f5114b61-b220-4fb9-bd9f-025cbbfb2485"
//   ]
// }

// 適性分析
export const getAdaptiveQuestion = () => get('adaptive-question', {})
export const resAdaptiveQuestion = (form) => post('adaptive-analysis', form)

// 申請提領
export const withdraw = () => post('/user/withdraw')

// 抓取熱門關鍵字
export const getHotKeyword = () => get('/search-keyword-hot')

// 查看待出金列表
export const getWithdrawList = ({ account, password }) => get(`/admin/withdraw?account=${account}&password=${password}`)

export const checkWithdraw = ({ account, password, userId }) => post(`/admin/withdraw/over?account=${account}&password=${password}`, { userId })
