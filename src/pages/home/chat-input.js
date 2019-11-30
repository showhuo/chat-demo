import React from "react";
import PropTypes from "prop-types";
import { Input, Upload, Button, Icon, message } from "antd";

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
  // upload
  createUploadComponent = () => {
    const { user, currentChat, sendMsg, broadcast, moveChatToTop } = this.props;
    const uploadprops = {
      beforeUpload: file => {
        if (!this.checkFile(file)) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          sendMsg(user, currentChat, "", reader.result);
          moveChatToTop(user, currentChat);
          broadcast();
        };
        return false;
      },
      fileList: []
    };
    return (
      <Upload {...uploadprops}>
        <Button type="primary" style={{ margin: "0.1rem 0 0.1rem 0" }}>
          <Icon type="upload" /> Upload Image
        </Button>
      </Upload>
    );
  };
  // limit file type and size
  checkFile = file => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    return true;
  };
  render() {
    const { user, currentChat, sendMsg, broadcast, moveChatToTop } = this.props;
    const { msg } = this.state;
    return currentChat ? (
      <div className="chat-input">
        {this.createUploadComponent()}
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
