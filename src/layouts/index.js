import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'

import LayoutMain from './Main'
import LayoutKickStart from './KickStart'

const Layouts = {
  main: LayoutMain,
  kickStart: LayoutKickStart,
}

const mapStateToProps = ({ settings }) => ({ title: settings.title })
let previousPath = ''
let preventRun = false

const Layout = ({ children, title, location: { pathname, search } }) => {
  const currentPath = pathname + search
  if (!preventRun) {
    if (currentPath !== previousPath) {
      window.scrollTo(0, 0)
      NProgress.start()
      preventRun = true
    }
  }
  setTimeout(() => {
    NProgress.done()
    previousPath = currentPath
    preventRun = false
  }, 500)

  // Layout Rendering
  const getLayout = () => {
    if (/^\/defi(?=\/|$)/i.test(pathname)) {
      return 'kickStart'
    }
    return 'main'
  }

  const LayoutWrapper = Layouts[getLayout()]

  return (
    <Fragment>
      <Helmet titleTemplate={`${title} | %s`} title={title} />
      <LayoutWrapper>{children}</LayoutWrapper>
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))
