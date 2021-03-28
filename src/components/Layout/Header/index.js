import React from 'react'
import { NavLink } from 'react-router-dom'
import Switcher from './Switcher'
import style from './style.module.scss'

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.menu}>
        <NavLink to="/wallet">
          <img className={style.letter} src="/logo_letter.svg" alt="" />
        </NavLink>
        <NavLink activeClassName={style.active} to="/wallet">
          <span>Wallet</span>
          <span>Wallet</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/stake">
          <span>Stake</span>
          <span>Stake</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/rewards">
          <span>Rewards</span>
          <span>Rewards</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/swap">
          <span>Swap</span>
          <span>Swap</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/kickstart">
          <span>KickStart</span>
          <span>KickStart</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/nft">
          <span>NFT</span>
          <span>NFT</span>
        </NavLink>
      </div>
      <div className="ml-auto">
        <Switcher />
      </div>
    </div>
  )
}

export default Header
