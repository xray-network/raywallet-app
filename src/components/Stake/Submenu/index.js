import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'

const StakeSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className="ray__submenu">
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/balances`}>
          <span>Balances</span>
          <span>Balances</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/pools`}>
          <span>Pools Delegation</span>
          <span>Pools Delegation</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/history`}>
          <span>Rewards History</span>
          <span>Rewards History</span>
        </NavLink>
      </div>
    </div>
  )
}

export default StakeSubmenu
