import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

class ChatInput extends React.Component {
  static propTypes = {
    user: PropTypes.string.isRequired,
    sendMsg: PropTypes.func.isRequired,
    currentChat: PropTypes.string.isRequired,
    broadcast: PropTypes.func.isRequired,
    moveChatToTop: PropTypes.func.isRequired
  };
  state = { msg: "" };
  handleInputChange = e => {
    const msg = e.target.value;

    this.setState({ msg });
  };
  render() {
    const { user, currentChat, sendMsg, broadcast, moveChatToTop } = this.props;
    const { msg } = this.state;
    return currentChat ? (
      <div className="chat-input">
        <div>Upload image</div>
        <Input
          value={msg}
          onChange={this.handleInputChange}
          onPressEnter={() => {
            sendMsg(user, currentChat, msg);
            // 需要在双方的界面，将对话置顶
            moveChatToTop(user, currentChat);
            broadcast();
            this.setState({ msg: "" });
          }}
        />
      </div>
    ) : null;
  }
}

export default ChatInput;
