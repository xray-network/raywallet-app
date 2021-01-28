import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import style from './style.module.scss'

const RewardsSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className={style.menu}>
        <NavLink exact activeClassName={style.active} to={`${url}/activities`}>
          <span>Activities</span>
          <span>Activities</span>
        </NavLink>
        <NavLink exact activeClassName={style.active} to={`${url}/top-list`}>
          <span>Top List</span>
          <span>Top List</span>
        </NavLink>
        <NavLink exact activeClassName={style.active} to={`${url}/history`}>
          <span>Rewards History</span>
          <span>Rewards History</span>
        </NavLink>
      </div>
    </div>
  )
}

export default RewardsSubmenu
