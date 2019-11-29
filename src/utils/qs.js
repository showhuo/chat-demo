// 获取 url query 参数对象
import qs from "qs";
export default function getUrlParamObj() {
  return qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  });
}
