import React from "react";
import PropTypes from "prop-types";
import { List, Avatar } from "antd";
import { isImmutable } from "immutable";

function ChatList({ friends, groups, user, switchChat, currentChat, chats }) {
  const triggerSwitchChat = name => () => {
    switchChat(user, name);
  };
  // 除了好友名字之外，还要显示每个好友的最后对话
  const createItem = item => {
    let chatKey = item;
    const isGroup = item.includes("group");
    if (!isGroup) {
      chatKey =
        user.localeCompare(item) < 0 ? `${user}-${item}` : `${item}-${user}`;
    }
    const lastMsg = chats.get(chatKey) && chats.get(chatKey).last();
    const { name, msg } = isImmutable(lastMsg) ? lastMsg.toJS() : {};
    return (
      <List.Item
        onClick={triggerSwitchChat(item)}
        className={`${currentChat.includes(item) ? "active" : ""}`}
      >
        <Avatar icon="user" style={{ marginRight: "5px" }} />
        {item}
        <div>{name && `${isGroup ? name + ": " : ""}${msg}`}</div>
      </List.Item>
    );
  };
  const listData = friends.concat(groups).toJS();

  return (
    <div className="chat-list">
      <List bordered dataSource={listData} renderItem={createItem} />
    </div>
  );
}

ChatList.propTypes = {
  friends: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
  currentChat: PropTypes.string.isRequired,
  switchChat: PropTypes.func.isRequired,
  chats: PropTypes.object.isRequired
};

export default ChatList;
