import React from 'react'
import { Helmet } from 'react-helmet'
import Empty from 'components/Empty'

const Stake = () => {
  return (
    <div>
      <Helmet title="Staking Center" />
      <div className="ray__block">
        <div className="ray__page">
          <div className="ray__menu">[staking]</div>
          <div className="ray__content">
            <Empty title="Wallet is not currently selected" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stake
