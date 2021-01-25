import React from 'react'
import { Helmet } from 'react-helmet'
import Empty from 'components/Empty'

const Staking = () => {
  return (
    <div>
      <Helmet title="Staking Center" />
      <div className="ray__block">
        <div className="ray__page">
          <div className="ray__menu">[staking]</div>
          <div className="ray__content">
            <Empty title="No Wallets Delegated" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Staking
