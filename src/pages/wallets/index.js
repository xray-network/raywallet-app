import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Empty from 'components/Empty'
import WalletsMenu from 'components/WalletsMenu'
import WalletsSubmenu from 'components/WalletsSubmenu'
import WalletsSend from 'components/WalletsSend'
import WalletsAddresses from 'components/WalletsAddresses'
import WalletsTransactions from 'components/WalletsTransactions'

const Wallets = () => {
  const { path } = useRouteMatch()
  const dispatch = useDispatch()
  const wallet = useSelector((state) => state.wallets.wallet)

  useEffect(() => {
    dispatch({
      type: 'wallets/FETCH_WALLET_DATA',
      payload: {
        walletId: wallet.selected,
      },
    })
  }, [wallet.selected, dispatch])

  return (
    <div>
      <Helmet title="Wallets" />
      <div className="ray__block">
        <div className="ray__page">
          <div className="ray__menu">
            <WalletsMenu />
          </div>
          <div className="ray__content">
            <div>
              {!wallet.selected && <Empty title="No Wallets Selected" />}
              {wallet.selected && (
                <div>
                  <WalletsSubmenu />
                  <div className="pt-4">
                    <Switch>
                      <Route exact path={path} render={() => <Redirect to={`${path}/send`} />} />
                      <Route exact path={`${path}/send`}>
                        <WalletsSend />
                      </Route>
                      <Route path={`${path}/addresses`}>
                        <WalletsAddresses />
                      </Route>
                      <Route path={`${path}/transactions`}>
                        <WalletsTransactions />
                      </Route>
                    </Switch>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallets
