import React from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import { Alert } from 'antd'
import KickStartSubmenu from 'components/Page/KickStart/Submenu'
import KickStartList from 'components/Page/KickStart/List'
import KickStartCreateProject from 'components/Page/KickStart/CreateProject'

const KickStart = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <div className="ray__wrapper">
        <Helmet title="KickStart" />
        <KickStartSubmenu />
        <div className="mb-4">
          <Alert
            message="RAY KickStart will be available in the Goguen Era"
            description="Since this feature is directly related to smart contracts, it will be released as soon as Cardano brings it to life - in the Goguen Era."
            type="warning"
            showIcon
          />
        </div>
        <Switch>
          <Route exact path={path} render={() => <Redirect to={`${path}/list`} />} />
          <Route exact path={`${path}/list`}>
            <KickStartList />
          </Route>
          <Route path={`${path}/create`}>
            <KickStartCreateProject />
          </Route>
        </Switch>
      </div>
    </>
  )
}

export default KickStart
