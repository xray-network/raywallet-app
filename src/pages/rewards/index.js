import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import RewardsSubmenu from 'components/Page/Rewards/Submenu'
import RewardsActivities from 'components/Page/Rewards/Activities'
import RewardsHistory from 'components/Page/Rewards/History'

const Rewards = () => {
  const { path } = useRouteMatch()

  return (
    <div className="ray__wrapper">
      <Helmet title="Rewards" />
      <RewardsSubmenu />
      <Switch>
        <Route exact path={path} render={() => <Redirect to={`${path}/activities`} />} />
        <Route exact path={`${path}/activities`}>
          <RewardsActivities />
        </Route>
        <Route path={`${path}/history`}>
          <RewardsHistory />
        </Route>
      </Switch>
    </div>
  )
}

export default Rewards
