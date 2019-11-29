import "babel-polyfill";
import "./bluebird";
import "normalize.css";
import { throttle } from "lodash";

// rem 自动转换
// web 建议用 1920 设计稿，1rem === 100px
// h5 建议用 375 设计稿，1rem === 10px
window.onload = function() {
  getRem(1920, 100);
};

window.onresize = throttle(function() {
  getRem(1920, 100);
}, 100);

function getRem(pwidth, prem) {
  var html = document.getElementsByTagName("html")[0];
  var oWidth =
    document.body.clientWidth || document.documentElement.clientWidth;
  html.style.fontSize = (oWidth / pwidth) * prem + "px";
}
