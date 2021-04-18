import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useRouteMatch } from 'react-router-dom'

const RewardsSubmenu = () => {
  const { url } = useRouteMatch()
  const walletRayRewardsHistory = useSelector((state) => state.wallets.walletRayRewardsHistory)

  return (
    <div>
      <div className="ray__submenu">
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/activities`}>
          <span>Activities</span>
          <span>Activities</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/history`}>
          <span>Rewards History ({walletRayRewardsHistory.length})</span>
          <span>Rewards History ({walletRayRewardsHistory.length})</span>
        </NavLink>
      </div>
    </div>
  )
}

export default RewardsSubmenu
