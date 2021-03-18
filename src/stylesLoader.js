import { useEffect } from 'react'
import { connect } from 'react-redux'

// antd core & themes styles
import 'antd/lib/style/index.less'
import './css/vendors/antd/themes/default.less'
// import './css/vendors/antd/themes/dark.less'

// third-party plugins styles
import 'bootstrap/dist/css/bootstrap.min.css'

// vendors styles
import './css/vendors/antd/style.scss'
import './css/vendors/bootstrap/style.scss'
import './css/vendors/nprogress/style.scss'

// styles
import './css/core.scss'
import './css/layout.scss'
import './css/measurements.scss'
import './css/colors.scss'
import './css/utils.scss'
import './css/router.scss'
import './css/antd-overrides.scss'

const mapStateToProps = ({ settings: { theme, primaryColor } }) => ({
  theme,
  primaryColor,
})

let isLoaded = false

const StylesLoader = ({ dispatch, children, theme, primaryColor }) => {
  // listen & set vb-theme (dark, default, ...)
  useEffect(() => {
    document.querySelector('html').setAttribute('data-vb-theme', theme)
    dispatch({
      type: 'settings/SET_THEME',
      payload: {
        theme,
      },
    })
    if (isLoaded) {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'menuColor',
          value: theme === 'dark' ? 'dark' : 'white',
        },
      })
    }
    isLoaded = true
  }, [theme, dispatch])

  // listen & set primaryColor
  useEffect(() => {
    const styleElement = document.querySelector('#primaryColor')
    if (styleElement) {
      styleElement.remove()
    }
    const body = document.querySelector('body')
    const styleEl = document.createElement('style')
    const css = document.createTextNode(`:root { --vb-color-primary: ${primaryColor};}`)
    styleEl.setAttribute('id', 'primaryColor')
    styleEl.appendChild(css)
    body.appendChild(styleEl)
  }, [primaryColor])

  return children
}

export default connect(mapStateToProps)(StylesLoader)
