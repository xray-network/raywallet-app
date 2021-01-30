import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'

const DeFiSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className="ray__submenu">
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/swap`}>
          <span>Swap</span>
          <span>Swap</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/liquidity/pools`}>
          <span>Liquidity Pools</span>
          <span>Liquidity Pools</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/liquidity/my`}>
          <span>My Liquidity</span>
          <span>My Liquidity</span>
        </NavLink>
        <a href="/" className="ml-auto ray__btn" onClick={(e) => e.preventDefault()}>
          <i className="fe fe-settings" />
        </a>
      </div>
    </div>
  )
}

export default DeFiSubmenu
