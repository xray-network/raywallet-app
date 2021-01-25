import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'

import LayoutMain from './Main'

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

  return (
    <Fragment>
      <Helmet titleTemplate={`${title} | %s`} title={title} />
      <LayoutMain>{children}</LayoutMain>
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))
