import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useRouteMatch } from 'react-router-dom'

const StakeSubmenu = () => {
  const { url } = useRouteMatch()
  const walletStakeRewardsHistory = useSelector((state) => state.wallets.walletStakeRewardsHistory)

  return (
    <div>
      <div className="ray__submenu">
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/delegation`}>
          <span>Delegation</span>
          <span>Delegation</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/pools`}>
          <span>Pools</span>
          <span>Pools</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/history`}>
          <span>Rewards History ({walletStakeRewardsHistory.length})</span>
          <span>Rewards History ({walletStakeRewardsHistory.length})</span>
        </NavLink>
      </div>
    </div>
  )
}

export default StakeSubmenu
