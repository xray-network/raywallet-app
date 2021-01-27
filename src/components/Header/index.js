import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './style.module.scss'

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.menu}>
        <NavLink activeClassName={style.active} to="/wallet">
          <span>Wallet</span>
          <span>Wallet</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/stake">
          <span>Staking Center</span>
          <span>Staking Center</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/rewards">
          <span>Rewards</span>
          <span>Rewards</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/defi">
          <span>
            KickStart <sup>DeFi</sup>
          </span>
          <span>
            KickStart <sup>DeFi</sup>
          </span>
        </NavLink>
      </div>
    </div>
  )
}

export default Header
