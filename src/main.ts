// 你自定义的 css
import './styles/main.css'
import './styles/tailwind/index.scss'
import 'babel-polyfill'

import App from './App.vue'
import axios from "axios";
const app = createApp(App)

import useGlobalConfigStore from "~/stores/global-config";
const globalConfigStore = useGlobalConfigStore();

import config from '../package.json'

axios.get('/zfile.config.json').then((res) => {
  globalConfigStore.updateZfileConfig(res.data);
}).finally(() => {
  app.mount('#app')
})
