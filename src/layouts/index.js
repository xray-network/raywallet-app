import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import LayoutMain from './Main'

const mapStateToProps = ({ settings }) => ({ title: settings.title })

const Layout = ({ children, title }) => {
  return (
    <Fragment>
      <Helmet titleTemplate={`${title} | %s`} />
      <LayoutMain>{children}</LayoutMain>
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))
