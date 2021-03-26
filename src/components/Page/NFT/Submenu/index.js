import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'

const NFTSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className="ray__submenu">
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/marketplace`}>
          <span>Marketplace</span>
          <span>Marketplace</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/purchases`}>
          <span>My Purchases</span>
          <span>My Purchases</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/create`}>
          <span>Create Item</span>
          <span>Create Item</span>
        </NavLink>
      </div>
    </div>
  )
}

export default NFTSubmenu
