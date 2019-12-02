import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  createUser,
  sendMsg,
  retractMsg,
  createGroup,
  inviteToGroup,
  switchChat,
  syncState,
  moveChatToTop
} from "./reducer";
import getUrlParamObj from "../../utils/qs";
import ChatContent from "./chat-content";
import ChatList from "./chat-list";
import ChatInput from "./chat-input";
import "./index.less";
import { Map, Set } from "immutable";

const { user } = getUrlParamObj();

const bc = new BroadcastChannel("chat-demo");
class Home extends React.Component {
  static propTypes = {
    rootData: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };
  componentDidMount() {
    bc.onmessage = e => {
      const newState = JSON.parse(e.data);
      this.props.actions.syncState(newState);
    };
  }
  // 本地模拟服务端通信
  broadcast = () => {
    setTimeout(() => {
      const { rootData } = this.props;
      bc.postMessage(JSON.stringify(rootData));
    }, 0);
  };

  render() {
    const { rootData, actions } = this.props;
    const data = rootData.get(user) || Map();
    const friends = data.get("friends") || Set();
    const currentChat = data.get("currentChat");
    const chatContent = rootData.getIn(["chats", currentChat]);
    const chats = rootData.get("chats");
    const groupMember = rootData.get(currentChat);
    const groupNum = rootData.get("groupNum");
    const {
      sendMsg,
      retractMsg,
      createGroup,
      inviteToGroup,
      switchChat,
      moveChatToTop
    } = actions;
    return (
      <div className="home">
        <ChatList
          friends={friends}
          user={user}
          switchChat={switchChat}
          currentChat={currentChat}
          chats={chats}
        />
        <div className="chat-body">
          <ChatContent
            chatContent={chatContent}
            user={user}
            friends={friends}
            currentChat={currentChat}
            groupMember={groupMember}
            retractMsg={retractMsg}
            inviteToGroup={inviteToGroup}
            createGroup={createGroup}
            switchChat={switchChat}
            groupNum={groupNum}
            broadcast={this.broadcast}
            moveChatToTop={moveChatToTop}
          />
          <ChatInput
            user={user}
            sendMsg={sendMsg}
            currentChat={currentChat}
            broadcast={this.broadcast}
            moveChatToTop={moveChatToTop}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ rootData: state.home }),
  dispatch => ({
    actions: bindActionCreators(
      {
        createUser,
        sendMsg,
        retractMsg,
        createGroup,
        inviteToGroup,
        switchChat,
        syncState,
        moveChatToTop
      },
      dispatch
    )
  })
)(Home);
