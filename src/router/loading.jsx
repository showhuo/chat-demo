import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import { Icon } from 'antd-mobile'

const Loading = ({ error }) => {
  if (error) {
    NProgress.done()
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Icon type="loading" />
        <div style={{ color: '#434e59', fontWeight: 700 }}>
          页面加载失败，请过段时间再来:(
        </div>
      </div>
    )
  }
  return null
}
Loading.propTypes = {
  error: PropTypes.object
}
Loading.defaultProps = {
  error: null
}
export default Loading
