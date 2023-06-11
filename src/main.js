import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "element-plus/theme-chalk/index.css";
import "./assets/main.scss";
const app = createApp(App);

app.use(router);

app.mount("#app");

// 1. 先自己构造一些假数据，实现根据文职渲染内容
// 2. 配置组件对应的映射关系 {preview: xxx, render: xxx}
