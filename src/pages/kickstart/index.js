import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Empty from 'components/Layout/Empty'
import KickStartSubmenu from 'components/KickStart/Submenu'
import KickStartList from 'components/KickStart/List'
import KickStartCreateProject from 'components/KickStart/CreateProject'
import KickStartCreateToken from 'components/KickStart/CreateToken'

const KickStart = () => {
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
          <KickStartSubmenu />
          <div className="pt-4">
            <Switch>
              <Route exact path={path} render={() => <Redirect to={`${path}/list`} />} />
              <Route exact path={`${path}/list`}>
                <KickStartList />
              </Route>
              <Route path={`${path}/create/project`}>
                <KickStartCreateProject />
              </Route>
              <Route path={`${path}/create/token`}>
                <KickStartCreateToken />
              </Route>
            </Switch>
          </div>
        </div>
      )}
    </div>
  )
}

export default KickStart
