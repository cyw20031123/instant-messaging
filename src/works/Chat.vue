<template>
	<div class="page-section container-fluid text-center Chat">
		<div id="Interface">
			<div class="assembly">
				<div class="button">
					<div>{{ who }}</div>
				</div>
				<div class="DisplayPanel">
					<div :class="item[0] + ' information'" v-for="(item, key) in data" :key="key">
						{{ item[1] }}
					</div>
				</div>
				<input class="input" placeholder="想聊什么呢？" type="text" v-model="input" @keyup.enter="get" />
			</div>
			<div id="GoodFriend">
				<div class="name" @click="user(key)" v-for="(name,key) in username" :key="key">
					{{ name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const {
		Realtime,
		TextMessage,
		Event
	} = AV;
	const realtime = new Realtime({
		appId: 'coJvzqIgHkiuWHgUDuMtOC37-gzGzoHsz',
		appKey: 'y9tnM5dWs5eC3ubS6OXIrSqm',
		server: 'https://cojvzqig.lc-cn-n1-shared.com',
	});
	export default {
		props: ["name"],
		name: "Chat",
		data() {
			return {
				input: "",
				data: [],
				who: "请选择一个好友",
				username: []
			};
		},
		methods: {
			user(key) {
				this.who = this.username[key];
			},
			get() {
				if (this.who != "请选择一个好友") {
					realtime.createIMClient(this.name).then((i) => {
						// 创建与 Jerry 之间的对话
						i.createConversation({
							members: [this.who],
							// 对话名称
							name: this.nema + ' & ' + this.who,
							unique: true
						}).then((i) => {
							i.send(new TextMessage(this.input)).then((message) => {
								this.data.push(["user", message.text]);
								console.log('发送成功！');
							}).catch(() => {
								alert("发送失败啦！");
							});
						});
					});
				} else {
					alert("请选择一个用户开始通讯哦")
				}
			},
		},
		mounted() {
			// Jerry 登录
			realtime.createIMClient(this.name).then((jerry) => {
				jerry.on(Event.INVITED, function invitedEventHandler(payload, conversation) {
					console.log(payload.invitedBy, conversation.id);
					console.log(conversation);
				});
				jerry.on(Event.MESSAGE, (message, conversation) => {
					this.data.push(["reply", message.text,message.from]);
				});
			}).catch(console.error);
			const name = new AV.Query("UserName");
			name.find().then((names) => {
				for (const i of names) {
					if (i.attributes.name != this.name) {
						this.username.push(i.attributes.name);
					}
				}
			});
		},
	};
</script>

<style scoped>
	.Chat {
		width: 600px;
		padding-bottom: 0;
	}

	#Interface {
		display: flex;
		flex-direction: row;
		border-radius: 3px;
		background: linear-gradient(to bottom,
				rgba(27, 27, 27, 0.3) 0%,
				rgba(27, 27, 27, 0.3) 100%),
			url("../../public/assets/img/background-6.jpg");
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: scroll;
		background-size: cover;
	}

	.assembly {
		width: calc(100% - 100px);
		padding: 10px;
		border: 1px solid gray;
	}

	@media screen and (max-width: 640px) {
		.Chat {
			width: calc(100% - 40px);
		}
	}

	.button {
		color: white;
	}

	.DisplayPanel {
		padding: 20px;
		margin-bottom: 10px;
		height: 300px;
		overflow: auto;
	}

	.DisplayPanel::-webkit-scrollbar {
		display: none;
	}

	.input {
		padding-left: 10px;
		width: 100%;
		border: 1px solid gray;
		outline: none;
		border-radius: 10px;
		background-color: rgba(255, 255, 255, 0.8);
	}

	.reply {
		margin-right: auto;
		background-color: rgba(89, 156, 243, 0.5);
	}

	.user {
		margin-left: auto;
		background-color: rgba(243, 89, 89, 0.5);
	}

	.information {
		padding: 5px 10px;
		width: fit-content;
		border: 1px solid gray;
		border-radius: 10px;
		margin-bottom: 10px;
	}

	#GoodFriend {
		width: 100px;
		padding: 20px 10px;
	}
	.name {
		padding:5px 0;
		border-bottom: 1px solid white;
		cursor: progress;
		color: wheat;
		transition: background-color .2s linear;
	}
	.name:hover{
		background-color: #597ca1;
		
	}
</style>
