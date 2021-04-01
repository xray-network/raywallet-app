import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { Alert } from 'antd'
import NFTSubmenu from 'components/Page/NFT/Submenu'
import NFTMarketplace from 'components/Page/NFT/Marketplace'
import NFTPurchases from 'components/Page/NFT/Purchases'
import NFTCreate from 'components/Page/NFT/Create'

const Wallet = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <div className="mb-4">
        <Alert
          message="RAY NFT Marketplace will be available in the Goguen Era"
          description="Since this feature is directly related to smart contracts, it will be released as soon as Cardano brings it to life - in the Goguen Era."
          type="info"
          showIcon
        />
      </div>
      <div className="ray__wrapper__full">
        <Helmet title="NFT Marketplace" />
        <NFTSubmenu />
        <Switch>
          <Route exact path={path} render={() => <Redirect to={`${path}/marketplace`} />} />
          <Route exact path={`${path}/marketplace`}>
            <NFTMarketplace />
          </Route>
          <Route exact path={`${path}/purchases`}>
            <NFTPurchases />
          </Route>
          <Route exact path={`${path}/create`}>
            <NFTCreate />
          </Route>
        </Switch>
      </div>
    </>
  )
}

export default Wallet
