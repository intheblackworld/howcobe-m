import Vue from 'vue'
import {
  Button, Dialog,
  Radio,
  RadioGroup,
  RadioButton,
  Select,
  Input,
  Option,
  Checkbox,
  TimeSelect,
  Rate,
  ButtonGroup,
  Message,
  Pagination,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Loading,
  Tooltip,
  Collapse,
  CollapseItem,
  FormItem,
  Form
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/zh-TW'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.prototype.$message = Message

Vue.use(Pagination)
Vue.use(Button)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Input)
Vue.use(Option)
Vue.use(Checkbox)
Vue.use(TimeSelect)
Vue.use(Rate)
Vue.use(ButtonGroup)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Loading)
Vue.use(Tooltip)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(FormItem)
Vue.use(Form)
