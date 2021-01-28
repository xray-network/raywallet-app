import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Empty from 'components/Empty'
import RewardsSubmenu from 'components/RewardsSubmenu'
import RewardsActivities from 'components/RewardsActivities'
import RewardsHistory from 'components/RewardsHistory'
import RewardsTopList from 'components/RewardsTopList'

const Rewards = () => {
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
      <Helmet title="RAY Rewards" />
      {!wallet.selected && <Empty title="Pools are not available at the moment" />}
      {wallet.selected && (
        <div>
          <RewardsSubmenu />
          <div className="pt-4">
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
        </div>
      )}
    </div>
  )
}

export default Rewards
