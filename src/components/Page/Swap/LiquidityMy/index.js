import React from 'react'
import { Alert } from 'antd'
import Empty from 'components/Layout/Empty'
// import style from './style.module.scss'

const SwapLiquidityMy = () => {
  return (
    <div>
      <div className="mb-4">
        <Alert
          message="Liquidity providing will be available in the Goguen Era"
          description="Since this feature is directly related to smart contracts, it will be released as soon as Cardano brings it to life - in the Goguen era."
          type="warning"
          showIcon
        />
      </div>
      <div className="ray__heading">Your Liquidity</div>
      <Empty title="No Liquidity" />
      <div className="ray__heading">Add Liquidity</div>
      <Empty title="Currently Unavailable" />
    </div>
  )
}

export default SwapLiquidityMy
