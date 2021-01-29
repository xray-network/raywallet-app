import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Empty from 'components/Layout/Empty'
import WalletSubmenu from 'components/Wallet/Submenu'
import WalletSend from 'components/Wallet/Send'
import WalletAddresses from 'components/Wallet/Addresses'
import WalletTransactions from 'components/Wallet/Transactions'

const Wallet = () => {
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
      <Helmet title="Wallet" />
      {!wallet.selected && <Empty title="Wallet is not currently selected" />}
      {wallet.selected && (
        <div>
          <WalletSubmenu />
          <Switch>
            <Route exact path={path} render={() => <Redirect to={`${path}/send`} />} />
            <Route exact path={`${path}/send`}>
              <WalletSend />
            </Route>
            <Route path={`${path}/addresses`}>
              <WalletAddresses />
            </Route>
            <Route path={`${path}/transactions`}>
              <WalletTransactions />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  )
}

export default Wallet
