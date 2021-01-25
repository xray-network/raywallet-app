import React from 'react'
import { Helmet } from 'react-helmet'
import Empty from 'components/Empty'

const DeFi = () => {
  return (
    <div>
      <Helmet title="Kick Starter" />
      <div className="ray__block">
        <div className="ray__page">
          <div className="ray__menu">[kickstarter]</div>
          <div className="ray__content">
            <Empty title="No Projects Available" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeFi
