<template>
	<div class=" container-fluid text-center Chat">
		<div id="Interface">
			<div class="assembly">
				<div class="who">
					<div>{{ who }}</div>
				</div>
				<div id="DisplayPanel" ref="chatbox">
					<div :class="item[0]" class="information" v-for="(item, key) in data[subscript].data" :key="key">
						{{ item[1] }}
					</div>
				</div>
				<div id="InpuBox">
					<input class="input" placeholder="说点什么吧!" type="text" v-model="input" @keyup.enter="get()" />
					<input type="button" class="btn btn-info" value="发送" @click="get()" />
				</div>
			</div>
			<div id="GoodFriend">
				<div id="name">
					<div :ref="key" class="name" @click="change(key)" v-for="(name,key) in username" :key="key">
						{{ name }}
					</div>
				</div>
				<input type="button" class="btn btn-danger button" @click="LogOut()" value="退出登录" />
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
				data: [{
					name: "选择一个用户开始聊天吧~",
					data: [],
				}],
				who: "选择一个用户开始聊天吧~",
				username: [],
				Signin: "",
				subscript: 0
			};
		},
		methods: {
			change(key) {
				this.user(key).then(() => {
					this.bottom();
				})
				let people = this.$refs[key];
				people[0].className = "name";
			},
			user(key) {
				this.who = this.username[key];
				this.subscript = key + 1;
				return Promise.resolve("true");
			},
			bottom() {
				this.$refs.chatbox.scrollTop = 999999999;
			},
			get() {
				if (this.who != "选择一个用户开始聊天吧~") {
					if (this.input !== "") {
						// 创建对话
						let input = this.input;
						this.input = "";
						this.Signin.createConversation({
							members: [this.who],
							// 对话名称
							name: this.name + ' & ' + this.who,
							unique: true
						}).then((i) => {
							i.send(new TextMessage(input)).then((message) => {
								for (let who of this.data) {
									if (who.name == this.who) {
										who.data.push(["user", message.text]);
										setTimeout(() => {
											this.bottom();
										}, 10);
									}
								}
							}).catch(() => {
								alert("发送失败啦！");
							});
						});
					}
				} else {
					alert("请选择一个用户开始通讯哦")
				}
			},
			LogOut() {
				//用户退出登录
				AV.User.logOut();
				this.Signin.close().then(function() {});
				this.$emit("up", "SignIn");
			}
		},
		mounted() {
			//获取所有其他用户
			const name = new AV.Query("UserName");
			name.find().then((names) => {
				for (const i of names) {
					let n = i.attributes.name;
					if (n != this.name) {
						this.username.push(n);
						this.data.push({
							name: n,
							data: []
						});
					}
				}
			});
			//用户登录
			realtime.createIMClient(this.name).then((i) => {
				this.Signin = i;
				//获取历史消息
				var query = i.getQuery();
				query.contains('name', this.name);
				query.find().then((conversations) => {
					conversations.map((a) => {
						var names = a.members;
						var name;
						for (let s of names) {
							if (s !== this.name) {
								name = s;
							}
						}
						a.queryMessages({
							limit: 100, // limit 取值范围 1~100，默认 20
						}).then((messages) => {
							// 最新的100条消息，按时间增序排列
							for (let n = 0; n < this.data.length; n++) {
								if (this.data[n].name == name) {
									for (let i = 0; i < messages.length; i++) {
										if (messages[i].from == this.name) {
											this.data[n].data.push(["user", messages[i]
												.text
											]);
										} else {
											this.data[n].data.push(["reply", messages[i]
												.text
											]);
										}
									}
								}
							}
						});
					});
				});
			});
			//时刻接收信息
			realtime.createIMClient(this.name).then((jerry) => {
				jerry.on(Event.INVITED, function invitedEventHandler(payload, conversation) {});
				jerry.on(Event.MESSAGE, (message, conversation) => {
					for (let who of this.data) {
						if (who.name == message.from) {
							who.data.push(["reply", message.text]);
							setTimeout(() => {
								this.bottom();
							}, 10);
							for (let i = 0; i < this.username.length; i++) {
								if (who.name === this.username[i] && this.who != who.name) {
									let people = this.$refs[i];
									people[0].className = "received";
								}
							}
						}
					}
				});
			});
		},
	};
</script>

<style scoped>
	@keyframes twinkle {
		0% {
			background-color: none;
		}

		50% {
			background-color: rgba(243, 89, 89, 0.5);
		}

		100% {
			background-color: none;
		}
	}

	.received {
		animation-name: twinkle;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		padding: 8px 0;
		border-top: 1px solid white;
		border-radius: 3px;
		cursor: progress;
		color: wheat;
	}

	.Chat {
		height: 100vh;
		width: 100%;
		padding: 0;
	}

	#InpuBox {
		display: flex;
		flex-direction: row;
	}

	#Interface {
		height: 100%;
		display: flex;
		flex-direction: row;
		background: linear-gradient(to bottom,
				rgba(27, 27, 27, 0.3) 0%,
				rgba(27, 27, 27, 0.3) 100%),
			url("../../public/img/background-6.jpg");
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: scroll;
		background-size: cover;
	}

	.assembly {
		height: 100%;
		width: calc(100% - 100px);
		padding: 20px;
	}

	.who {
		color: white;
	}

	#DisplayPanel {
		height: calc(100% - 78px);
		padding: 20px;
		margin-bottom: 10px;
		overflow: auto;
	}

	.input {
		padding-left: 10px;
		height: 40px;
		width: 100%;
		border: none;
		outline: none;
		border-radius: 4px;
		background-color: rgba(255, 255, 255, 0.8);
		margin-right: 10px;
	}
	
	.input:focus{
		background-color: rgba(255, 255, 255, 1);
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
		height: 100%;
		width: 100px;
		padding: 20px 0;
		border-left: 1.5px solid white;
	}

	#name {
		height: calc(100% - 32px);
		overflow: auto;
	}

	#name::-webkit-scrollbar {
		display: none;
	}

	#DisplayPanel::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		background-color: #dbdbdb;
		border-radius: 10px;
	}

	#DisplayPanel::-webkit-scrollbar {
		width: 6px;
		background-color: #F5F5F5;
		border-radius: 10px;
	}

	#DisplayPanel::-webkit-scrollbar-thumb {
		background-color: #8f8f8f;
		border-radius: 10px;
	}

	.name {
		padding: 8px 0;
		border-top: 1px solid white;
		border-radius: 3px;
		cursor: progress;
		color: wheat;
		transition: background-color .2s linear;
	}

	.name:hover {
		background-color: rgba(89, 156, 243, 0.3);
	}

	.button {
		font-size: .5em;
	}
</style>
