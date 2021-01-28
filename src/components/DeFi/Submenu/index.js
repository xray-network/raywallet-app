import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import style from './style.module.scss'

const DeFiSubmenu = () => {
  const { url } = useRouteMatch()

  return (
    <div>
      <div className={style.menu}>
        <NavLink exact activeClassName={style.active} to={`${url}/exchange`}>
          <span>Exchange</span>
          <span>Exchange</span>
        </NavLink>
        <NavLink exact activeClassName={style.active} to={`${url}/liquidity`}>
          <span>Liquidity Pools</span>
          <span>Liquidity Pools</span>
        </NavLink>
      </div>
    </div>
  )
}

export default DeFiSubmenu
