import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'

import LayoutMain from './Main'
// import PublicLayout from './Public'
// import LayoutStaking from './Staking'
// import LayoutRewards from './Rewards'
// import LayoutKickStarter from './KickStarter'
// import LayoutWallets from './Wallets'

// const Layouts = {
//   public: PublicLayout,
//   staking: LayoutStaking,
//   rewards: LayoutRewards,
//   kickstarter: LayoutKickStarter,
//   wallets: LayoutWallets,
// }

const mapStateToProps = ({ settings }) => ({ title: settings.title })
let previousPath = ''

const Layout = ({ children, title, location: { pathname, search } }) => {
  // NProgress & ScrollTop Management
  const currentPath = pathname + search
  if (currentPath !== previousPath) {
    window.scrollTo(0, 0)
    NProgress.start()
  }
  setTimeout(() => {
    NProgress.done()
    previousPath = currentPath
  }, 300)

  // Layout Rendering
  // const getLayout = () => {
  //   if (pathname === '/') {
  //     return 'public'
  //   }
  //   if (/^\/staking-center(?=\/|$)/i.test(pathname)) {
  //     return 'staking'
  //   }
  //   if (/^\/rewards(?=\/|$)/i.test(pathname)) {
  //     return 'rewards'
  //   }
  //   if (/^\/kickstarter(?=\/|$)/i.test(pathname)) {
  //     return 'kickstarter'
  //   }
  //   if (/^\/wallets(?=\/|$)/i.test(pathname)) {
  //     return 'wallets'
  //   }
  //   return 'main'
  // }

  // const Container = Layouts[getLayout()]

  return (
    <Fragment>
      <Helmet titleTemplate={`${title} | %s`} title={title} />
      <LayoutMain>{children}</LayoutMain>
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))
