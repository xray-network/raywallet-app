import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Empty from 'components/Layout/Empty'
import DeFiSubmenu from 'components/DeFi/Submenu'
import DeFiExchange from 'components/DeFi/Exchange'
import DeFiLiquidity from 'components/DeFi/Liquidity'

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
      <Helmet title="DeFi Center" />
      {!wallet.selected && <Empty title="Projects are not available at the moment" />}
      {wallet.selected && (
        <div>
          <DeFiSubmenu />
          <div className="pt-4">
            <Switch>
              <Route exact path={path} render={() => <Redirect to={`${path}/exchange`} />} />
              <Route exact path={`${path}/exchange`}>
                <DeFiExchange />
              </Route>
              <Route path={`${path}/liquidity`}>
                <DeFiLiquidity />
              </Route>
            </Switch>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeFi
