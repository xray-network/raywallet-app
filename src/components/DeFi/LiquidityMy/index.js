import React from 'react'
import Empty from 'components/Layout/Empty'
// import style from './style.module.scss'

const DeFiLiquidityMy = () => {
  return (
    <div>
      <div className="ray__heading">Your Liquidity</div>
      <Empty title="No Liquidity" />
      <div className="ray__heading">Add Liquidity</div>
      <Empty title="Currently Unavailable" />
    </div>
  )
}

export default DeFiLiquidityMy
