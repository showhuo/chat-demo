import React from "react";
import PropTypes from "prop-types";
import { Modal, Checkbox, Card, Button } from "antd";

class ChatContent extends React.Component {
  static propTypes = {
    chatContent: PropTypes.object.isRequired,
    retractMsg: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    friends: PropTypes.object.isRequired,
    currentChat: PropTypes.string.isRequired,
    switchChat: PropTypes.func.isRequired,
    createGroup: PropTypes.func.isRequired,
    inviteToGroup: PropTypes.func.isRequired,
    groupMember: PropTypes.object,
    groupNum: PropTypes.number.isRequired,
    broadcast: PropTypes.func.isRequired
  };
  state = { showFriendsModal: false, friendsWillBeInvited: [] };
  // 创建每一条消息单体，用 className 区分样式，包括系统消息、我发的消息、别人发的消息
  createMsgRow = ({ name, msg, key }) => {
    const { retractMsg, currentChat, user, broadcast } = this.props;
    const msgType = {
      root: "root-msg",
      [user]: "my-msg"
    };
    return (
      <div
        className={`msg-row ${msgType[name] || "other-msg"}`}
        key={key}
        onMouseDown={e => {
          // 左键点击可撤回自己的消息
          if (e.button === 0 && name === user) {
            Modal.confirm({
              title: "Retract your message ?",
              onOk() {
                retractMsg(user, currentChat, key);
                broadcast();
              }
            });
          }
        }}
      >
        {name === user ? "me" : name}: {msg}
      </div>
    );
  };
  // 如果当前是群聊模式，创建邀请入群的弹框组件
  createModal = () => {
    const { friends, currentChat, groupMember } = this.props;
    const isGroup = currentChat.includes("group");
    if (isGroup) {
      const friendsNotInCurGroup = friends.toJS().filter(name => {
        return !name.includes("group") && !groupMember.has(name);
      });
      const options = friendsNotInCurGroup.map(f => ({
        label: f,
        value: f
      }));
      return (
        <Modal
          title="Add group member"
          visible={this.state.showFriendsModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <Checkbox.Group
            options={options}
            onChange={friendsWillBeInvited => {
              this.setState({ friendsWillBeInvited });
            }}
          />
        </Modal>
      );
    }
  };
  // 确认邀请入群
  handleOk = () => {
    const { friendsWillBeInvited } = this.state;
    const { user, currentChat, inviteToGroup, broadcast } = this.props;
    inviteToGroup(user, friendsWillBeInvited, currentChat);
    this.setState({ showFriendsModal: false });
    broadcast();
  };
  handleCancel = () => {
    this.setState({ friendsWillBeInvited: [], showFriendsModal: false });
  };
  // 如果是与个人对话，可以在当前窗口直接创建群聊
  tryCreateGroup = () => {
    // 1 创建群，2 更新好友列表，3 切换到当前群聊窗口
    const {
      createGroup,
      user,
      switchChat,
      currentChat,
      groupNum,
      broadcast
    } = this.props;
    const friendName = currentChat.split("-").find(name => name !== user);
    createGroup(user, friendName);
    switchChat(user, `group${groupNum + 1}`);
    broadcast();
  };
  theExtraBtn = () => {
    const { currentChat } = this.props;
    const isGroup = currentChat && currentChat.includes("group");
    return isGroup ? (
      <Button
        type="primary"
        onClick={() => {
          this.setState({ showFriendsModal: true });
        }}
      >
        Add member
      </Button>
    ) : (
      <Button type="primary" onClick={this.tryCreateGroup}>
        Create group
      </Button>
    );
  };
  render() {
    const { chatContent, currentChat } = this.props;

    return currentChat ? (
      <div className="chat-content">
        <Card
          title={currentChat}
          extra={this.theExtraBtn()}
          style={{ height: "3rem", overflow: "auto" }}
        >
          {chatContent.toJS().map((obj, key) => {
            const { name, msg } = obj;
            return this.createMsgRow({ name, msg, key });
          })}
        </Card>
        {this.createModal()}
      </div>
    ) : null;
  }
}

export default ChatContent;
