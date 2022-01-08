<template>
	<div id="app">
		<transition mode="out-in">
			<component :is="page" @up="up" :name="name"></component>
		</transition>
	</div>
</template>

<script>
	import SignIn from "./works/SignIn.vue";
	import Chat from './works/Chat.vue';
	export default {
		name: "App",
		components: {
			SignIn,
			Chat
		},
		data() {
			return {
				page: "SignIn",
				name:""
			};
		},
		methods: {
			up(i) {
				if(i instanceof Array){
					this.page = i[0];
					this.name = i[1]
				}else{
					this.page = i;
				}
			}
		}
	};
</script>

<style scoped>
	.v-leave-to,
	.v-enter {
		opacity: 0;
	}

	.v-enter-active,
	.v-leave-active {
		transition: all 0.2s ease-in-out;
	}
</style>
