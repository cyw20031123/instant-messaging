import Vue from 'vue'
import App from './App.vue'

// Vue.config.productionTip = false
const {
	Query,
	User
} = AV;
AV.init({
	appId: "coJvzqIgHkiuWHgUDuMtOC37-gzGzoHsz",
	appKey: "y9tnM5dWs5eC3ubS6OXIrSqm",
	serverURL: "https://cojvzqig.lc-cn-n1-shared.com",
});
Vue.config.assetsPublicPath = "./"
new Vue({
	render: h => h(App),
}).$mount('#app')
