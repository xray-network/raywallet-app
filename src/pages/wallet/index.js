import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import WalletSubmenu from 'components/Page/Wallet/Submenu'
import WalletSend from 'components/Page/Wallet/Send'
import WalletAddresses from 'components/Page/Wallet/Addresses'
import WalletTransactions from 'components/Page/Wallet/Transactions'

const Wallet = () => {
  const { path } = useRouteMatch()

  return (
    <div className="ray__wrapper">
      <Helmet title="Wallet" />
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
    </div>
  )
}

export default Wallet
