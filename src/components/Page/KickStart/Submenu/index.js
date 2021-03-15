import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'

const KickStartSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className="ray__submenu">
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/list`}>
          <span>Funding List</span>
          <span>Funding List</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/create`}>
          <span>Start Funding</span>
          <span>Start Funding</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/token/create`}>
          <span>Create Token</span>
          <span>Create Token</span>
        </NavLink>
      </div>
    </div>
  )
}

export default KickStartSubmenu
