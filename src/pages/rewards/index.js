import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Empty from 'components/Layout/Empty'
import RewardsSubmenu from 'components/Page/Rewards/Submenu'
import RewardsActivities from 'components/Page/Rewards/Activities'
import RewardsHistory from 'components/Page/Rewards/History'
import RewardsTopList from 'components/Page/Rewards/TopList'

const Rewards = () => {
  const { path } = useRouteMatch()
  const wallet = useSelector((state) => state.wallets.wallet)

  return (
    <div className="ray__wrapper">
      <Helmet title="Rewards" />
      {!wallet.selected && <Empty title="Pools are not available at the moment" />}
      {wallet.selected && (
        <div>
          <RewardsSubmenu />
          <Switch>
            <Route exact path={path} render={() => <Redirect to={`${path}/activities`} />} />
            <Route exact path={`${path}/activities`}>
              <RewardsActivities />
            </Route>
            <Route path={`${path}/history`}>
              <RewardsHistory />
            </Route>
            <Route path={`${path}/top-list`}>
              <RewardsTopList />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  )
}

export default Rewards
