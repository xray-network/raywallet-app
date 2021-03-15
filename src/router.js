import React, { Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Wallet from 'pages/wallet'
import Stake from 'pages/stake'
import Rewards from 'pages/rewards'
import Swap from 'pages/swap'
import KickStart from 'pages/kickstart'

import Layout from 'layouts'

const routes = [
  {
    path: '/wallet',
    Component: Wallet,
  },
  {
    path: '/stake',
    Component: Stake,
  },
  {
    path: '/rewards',
    Component: Rewards,
  },
  {
    path: '/swap',
    Component: Swap,
  },
  {
    path: '/kickstart',
    Component: KickStart,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={(state) => {
            const { location } = state
            const animationKey = location.pathname.slice(1).split('/')[0]
            return (
              <SwitchTransition>
                <CSSTransition
                  key={animationKey}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    <Route exact path="/" render={() => <Redirect to="/wallet/send" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
