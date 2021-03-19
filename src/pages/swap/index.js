import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import SwapSubmenu from 'components/Page/Swap/Submenu'
import Swap from 'components/Page/Swap/Swap'
import SwapLiquidityPools from 'components/Page/Swap/LiquidityPools'
import SwapLiquidityMy from 'components/Page/Swap/LiquidityMy'

const DeFi = () => {
  const { path } = useRouteMatch()

  return (
    <div className="ray__wrapper">
      <Helmet title="Swap DeFi" />
      <SwapSubmenu />
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
  )
}

export default DeFi