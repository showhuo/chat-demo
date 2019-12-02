设计思路：

	* Store
			* 所有数据保存在 root state，通过 BroadcastChannel 在 tab 之间同步
			* 每个 user、group、chat 有自己的 subState
			* 对前端而言，更关注的是用户在本地发起的、需要放在 redux 的数据
	* 主要 subState：
		* user
			* friends
			* current chat，表示当前与谁聊天
		* group
			* members
		* chats：
			* user1-user2，存储这两人的对话
			* group，存储群对话
	* UI 组件
		* 整个页面是 SPA
		* 好友列表
			* 根据下发的 friends 渲染名字、顺序
			* 根据下发简要渲染最后消息
		* 右侧对话框
			* 上半部分是内容
				* 根据下发的 chatContent 渲染内容，包括文字和图片
				* 根据发言人区分不同位置，三种角色：root、me、others
				* 根据是否为群聊，渲染创建群聊和邀请入群两个不同按钮
			* 下半部分是输入框
				* 提供上传图片的按钮
				* 提供文字输入区域，回车即发送文字
	* Actions
		* 发送文字
		* 发送图片
		* 撤回消息
		* 创建群聊
		* 邀请入群
		* 新聊天置顶
		* broadcast 至其他 tab
		* 接受 broadcast 更新 state
	