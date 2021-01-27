import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import style from './style.module.scss'

const StakeSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className={style.menu}>
        <NavLink exact activeClassName={style.active} to={`${url}/delegation`}>
          <span>Pool Delegation</span>
          <span>Pool Delegation</span>
        </NavLink>
        <NavLink exact activeClassName={style.active} to={`${url}/history`}>
          <span>Rewards History</span>
          <span>Rewards History</span>
        </NavLink>
      </div>
    </div>
  )
}

export default StakeSubmenu
