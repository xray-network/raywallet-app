import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Empty from 'components/Layout/Empty'
import DeFiSubmenu from 'components/DeFi/Submenu'
import DeFiSwap from 'components/DeFi/Swap'
import DeFiLiquidityPools from 'components/DeFi/LiquidityPools'
import DeFiLiquidityMy from 'components/DeFi/LiquidityMy'

const DeFi = () => {
  const { path } = useRouteMatch()
  const dispatch = useDispatch()
  const wallet = useSelector((state) => state.wallets.wallet)

  useEffect(() => {
    if (wallet.selected) {
      dispatch({
        type: 'wallets/FETCH_WALLET_DATA',
        payload: {
          walletId: wallet.selected,
        },
      })
    }
  }, [wallet.selected, dispatch])

  return (
    <div>
      <Helmet title="DeFi" />
      {!wallet.selected && <Empty title="Projects are not available at the moment" />}
      {wallet.selected && (
        <div>
          <DeFiSubmenu />
          <div className="pt-4">
            <Switch>
              <Route exact path={path} render={() => <Redirect to={`${path}/swap`} />} />
              <Route exact path={`${path}/swap`}>
                <DeFiSwap />
              </Route>
              <Route path={`${path}/liquidity/pools`}>
                <DeFiLiquidityPools />
              </Route>
              <Route path={`${path}/liquidity/my`}>
                <DeFiLiquidityMy />
              </Route>
            </Switch>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeFi
