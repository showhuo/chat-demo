// TODO use graph to describe friendship between users.
class ListNode {
  constructor(val = null) {
    this.val = val;
    this.next = null;
  }
}

class Graph {
  constructor(vertex, size) {
    this.vertex = vertex;
    this.size = size;
    this.adjacents = Array.from(Array(size), () => new ListNode());
  }
  addFriend(sNum, tNum) {}
}
