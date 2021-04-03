import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import KickStartSubmenu from 'components/Page/KickStart/Submenu'
import KickStartList from 'components/Page/KickStart/List'
import KickStartCreateProject from 'components/Page/KickStart/CreateProject'
import KickStartCreateToken from 'components/Page/KickStart/CreateToken'

const KickStart = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <div className="ray__wrapper">
        <Helmet title="KickStart" />
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
    </>
  )
}

export default KickStart
