import React from 'react'
import { Helmet } from 'react-helmet'
import Empty from 'components/Empty'
import WalletsMenu from 'components/WalletsMenu'

const Wallets = () => {
  return (
    <div>
      <Helmet title="Wallets" />
      <div className="ray__block">
        <div className="ray__page">
          <div className="ray__menu">
            <WalletsMenu />
          </div>
          <div className="ray__content">
            <Empty title="No Wallets Selected" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallets
