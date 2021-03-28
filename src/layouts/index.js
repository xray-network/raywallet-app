import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import Header from 'components/Layout/Header'
import AddWalletModal from 'components/Modal/AddWallet'
import QRModal from 'components/Modal/QR'
import SettingsModal from 'components/Modal/Settings'
import EncryptModal from 'components/Modal/Encrypt'
import LayoutMain from './Main'
import LayoutNFT from './NFT'

const Layouts = {
  main: LayoutMain,
  nft: LayoutNFT,
}

const mapStateToProps = ({ settings }) => ({ title: settings.title })

const LayoutIndex = ({ children, title, location: { pathname } }) => {
  const isNftSection = /^\/nft(?=\/|$)/i.test(pathname)
  const getLayoutName = () => {
    if (isNftSection) {
      return 'nft'
    }
    return 'main'
  }
  const Layout = Layouts[getLayoutName()]

  return (
    <Fragment>
      <Helmet titleTemplate={`${title} | %s`} />
      <AddWalletModal />
      <QRModal />
      <SettingsModal />
      <EncryptModal />
      <div className={`ray__layout ${isNftSection ? 'ray__layout__full' : ''}`}>
        <div className="ray__layout__container">
          <div className="ray__layout__header">
            <Header />
          </div>
        </div>
        <Layout>{children}</Layout>
      </div>
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(LayoutIndex))
