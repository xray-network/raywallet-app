import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import StakeSubmenu from 'components/Page/Stake/Submenu'
import StakeDelegation from 'components/Page/Stake/Delegation'
import StakeHistory from 'components/Page/Stake/History'
import StakePools from 'components/Page/Stake/Pools'

const Stake = () => {
  const { path } = useRouteMatch()

  return (
    <div className="ray__wrapper">
      <Helmet title="Stake" />
      <StakeSubmenu />
      <Switch>
        <Route exact path={path} render={() => <Redirect to={`${path}/delegation`} />} />
        <Route exact path={`${path}/delegation`}>
          <StakeDelegation />
        </Route>
        <Route exact path={`${path}/pools`}>
          <StakePools />
        </Route>
        <Route path={`${path}/history`}>
          <StakeHistory />
        </Route>
      </Switch>
    </div>
  )
}

export default Stake
