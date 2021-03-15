import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Empty from 'components/Layout/Empty'
import KickStartSubmenu from 'components/Page/KickStart/Submenu'
import KickStartList from 'components/Page/KickStart/List'
import KickStartCreateProject from 'components/Page/KickStart/CreateProject'
import KickStartCreateToken from 'components/Page/KickStart/CreateToken'

const KickStart = () => {
  const { path } = useRouteMatch()
  const wallet = useSelector((state) => state.wallets.wallet)

  return (
    <div className="ray__wrapper">
      <Helmet title="KickStart" />
      {!wallet.selected && <Empty title="Projects are not available at the moment" />}
      {wallet.selected && (
        <div>
          <KickStartSubmenu />
          <Switch>
            <Route exact path={path} render={() => <Redirect to={`${path}/list`} />} />
            <Route exact path={`${path}/list`}>
              <KickStartList />
            </Route>
            <Route path={`${path}/create`}>
              <KickStartCreateProject />
            </Route>
            <Route path={`${path}/token/create`}>
              <KickStartCreateToken />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  )
}

export default KickStart
