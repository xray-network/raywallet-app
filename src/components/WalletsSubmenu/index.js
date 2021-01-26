import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import style from './style.module.scss'

const WalletsSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className={style.menu}>
        <NavLink exact activeClassName={style.active} to={`${url}/send`}>
          <span>Send</span>
          <span>Send</span>
        </NavLink>
        <NavLink exact activeClassName={style.active} to={`${url}/addresses`}>
          <span>Receive</span>
          <span>Receive</span>
        </NavLink>
        <NavLink exact activeClassName={style.active} to={`${url}/transactions`}>
          <span>Transactions (3)</span>
          <span>Transactions (3)</span>
        </NavLink>
      </div>
    </div>
  )
}

export default WalletsSubmenu
