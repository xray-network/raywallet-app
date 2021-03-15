import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Alert } from 'antd'
import Empty from 'components/Layout/Empty'
import SwapSubmenu from 'components/Page/Swap/Submenu'
import Swap from 'components/Page/Swap/Swap'
import SwapLiquidityPools from 'components/Page/Swap/LiquidityPools'
import SwapLiquidityMy from 'components/Page/Swap/LiquidityMy'

const DeFi = () => {
  const { path } = useRouteMatch()
  const wallet = useSelector((state) => state.wallets.wallet)

  return (
    <div className="ray__wrapper">
      <Helmet title="Swap DeFi" />
      {!wallet.selected && <Empty title="Projects are not available at the moment" />}
      {wallet.selected && (
        <div>
          <SwapSubmenu />
          <div className="mb-4">
            <Alert
              message="Swap will be available in the Goguen Era"
              description="Since this feature is directly related to smart contracts, it will be released as soon as Cardano brings it to life - in the Goguen era."
              type="warning"
              showIcon
            />
          </div>
          <Switch>
            <Route exact path={path} render={() => <Redirect to={`${path}/swap`} />} />
            <Route exact path={`${path}/swap`}>
              <Swap />
            </Route>
            <Route path={`${path}/liquidity/pools`}>
              <SwapLiquidityPools />
            </Route>
            <Route path={`${path}/liquidity/my`}>
              <SwapLiquidityMy />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  )
}

export default DeFi
