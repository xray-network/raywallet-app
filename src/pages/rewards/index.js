import React from 'react'
import { Helmet } from 'react-helmet'
import Empty from 'components/Empty'

const Rewards = () => {
  return (
    <div>
      <Helmet title="Rewards" />
      <div className="ray__block">
        <div className="ray__page">
          <div className="ray__menu">[rewards]</div>
          <div className="ray__content">
            <Empty title="RAY Pools Are Empty" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rewards
