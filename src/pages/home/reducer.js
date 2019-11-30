// [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux)
import { fromJS, List, Map } from "immutable";
import typeToReducer from "type-to-reducer";

// Actions
const CREATE_USER = "create_user";
const SEND_MSG = "send_message";
const RETRACT_MSG = "retract_message";
const SWITCH_CHAT = "switch_chat";
const CREATE_GROUP = "create_group";
const INVITE_TO_GROUP = "invite_to_group";
const SYNC_STATE = "sync_state";
const MOVE_CHAT_TO_TOP = "move_chat_to_top";

// Action Creators
export const createUser = user => ({
  type: CREATE_USER,
  meta: { user }
});
export const sendMsg = (from, currentChat, msg, img) => ({
  type: SEND_MSG,
  meta: { from, currentChat, msg, img }
});
export const retractMsg = (from, currentChat, msgIdx) => ({
  type: RETRACT_MSG,
  meta: { from, currentChat, msgIdx }
});
export const switchChat = (user, chat) => ({
  type: SWITCH_CHAT,
  meta: { user, chat }
});
export const createGroup = (inviter, invitee) => ({
  type: CREATE_GROUP,
  meta: { inviter, invitee }
});
export const inviteToGroup = (inviter, invitees, group) => ({
  type: INVITE_TO_GROUP,
  meta: { inviter, invitees, group }
});
export const syncState = newState => ({
  type: SYNC_STATE,
  meta: { newState }
});
export const moveChatToTop = (user, currentChat) => ({
  type: MOVE_CHAT_TO_TOP,
  meta: { user, currentChat }
});

const initialState = {
  // count
  userNum: 2,
  groupNum: 1,
  // TODO we can use graph to store friendship
  user1: {
    friends: ["user2", "user3", "user4", "user5", "group1"],
    currentChat: "user1-user2"
  },
  user2: {
    friends: ["user1", "user3", "user4", "user5", "group1"],
    currentChat: "user1-user2"
  },
  user3: {
    friends: ["user1", "user2", "user4", "user5"],
    currentChat: ""
  },
  user4: {
    friends: ["user1", "user2", "user3", "user5"],
    currentChat: ""
  },
  user5: {
    friends: ["user1", "user2", "user3", "user4"],
    currentChat: ""
  },
  group1: ["user1", "user2"],
  chats: {
    "user1-user2": [
      { name: "user1", msg: "hello, i am user1" },
      { name: "user2", msg: "hello, i am user2" }
    ],
    group1: [
      { name: "user1", msg: "hello, i am user1" },
      { name: "user2", msg: "hello, i am user2" }
    ]
  },
  allPeople: ["user1", "user2", "user3", "user4", "user5"]
};

// Reducer
export default typeToReducer(
  {
    [SEND_MSG]: (state, action) => {
      const { from, currentChat, msg, img } = action.meta;
      const newState = state.updateIn(["chats", currentChat], (li = List()) =>
        li.push(Map({ name: from, msg, img }))
      );
      return newState;
    },
    [SWITCH_CHAT]: (state, action) => {
      const { user, chat } = action.meta;
      // 如果不是群聊，需要拼装两个用户的key
      const isGroup = chat.includes("group");
      let chatKey = chat;
      if (!isGroup) {
        chatKey =
          user.localeCompare(chat) < 0 ? `${user}-${chat}` : `${chat}-${user}`;
      }
      // 如果两人之前没有聊天记录，则需要初始化
      let newState = state;
      if (!state.getIn(["chats", chatKey]))
        newState = newState.setIn(["chats", chatKey], List());
      return newState.setIn([user, "currentChat"], chatKey);
    },
    [CREATE_GROUP]: (state, action) => {
      const { inviter, invitee } = action.meta;
      const newGroup = `group${state.get("groupNum") + 1}`;
      return state
        .updateIn(["groupNum"], num => {
          return num + 1;
        })
        .updateIn([inviter, "friends"], list => list.unshift(newGroup))
        .updateIn([invitee, "friends"], list => list.unshift(newGroup))
        .setIn(
          ["chats", newGroup],
          List([
            {
              name: "root",
              msg: `${inviter} invites ${invitee} into the group.`
            }
          ])
        )
        .set(newGroup, List([inviter, invitee]));
    },
    [INVITE_TO_GROUP]: (state, action) => {
      const { inviter, invitees, group } = action.meta;
      let newState = state;
      invitees.forEach(invitee => {
        newState = newState.updateIn([invitee, "friends"], (list = List()) =>
          list.unshift(group)
        );
      });
      return newState
        .update(group, list => list.concat(invitees))
        .updateIn(["chats", group], list =>
          list.push(
            Map({
              name: "root",
              msg: `${inviter} invites ${invitees} into the group.`
            })
          )
        );
    },
    [RETRACT_MSG]: (state, action) => {
      const { from, currentChat, msgIdx } = action.meta;
      return state.updateIn(["chats", currentChat], (li = List()) =>
        li.splice(
          msgIdx,
          1,
          Map({ name: "root", msg: `${from} retracts a message.` })
        )
      );
    },
    [SYNC_STATE]: (state, action) => {
      const { newState } = action.meta;
      return fromJS(newState);
    },
    [MOVE_CHAT_TO_TOP]: (state, action) => {
      const { user, currentChat } = action.meta;
      // 将当前对话置顶，如果是群聊，需要群体置顶
      let newState = state;
      let friend = null;
      const isGroup = currentChat.includes("group");
      if (!isGroup) {
        friend = currentChat.split("-").find(name => name !== user);
        newState = moveTohead(newState, friend, user);
      } else {
        // 群体置顶
        const group = currentChat;
        friend = group;
        state.get(group).forEach(member => {
          newState = moveTohead(newState, member, group);
        });
      }
      newState = moveTohead(newState, user, friend);
      return newState;
    }
  },
  fromJS(initialState)
);

// 辅助函数，将 user 的 friends 数组中 target 元素移动到数组头部
// 仅适用于数组不大的情况，如果数组较大，给原来位置打个标记不予显示即可，不必急着删除。
function moveTohead(state, user, target) {
  const idx = state.getIn([user, "friends"]).findIndex(f => f === target);
  return idx !== -1
    ? state.updateIn([user, "friends"], list =>
        list.delete(idx).unshift(target)
      )
    : state;
}
