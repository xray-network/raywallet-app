import { useEffect } from 'react'
import { connect } from 'react-redux'

// antd core & themes styles
import 'antd/lib/style/index.less'
import './css/vendors/antd/themes/default.less'
import './css/vendors/antd/themes/dark.less'

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

const mapStateToProps = ({ settings: { theme } }) => ({
  theme,
})

const StylesLoader = ({ children, theme }) => {
  useEffect(() => {
    document.querySelector('html').setAttribute('data-vb-theme', theme)
  }, [theme])

  return children
}

export default connect(mapStateToProps)(StylesLoader)
