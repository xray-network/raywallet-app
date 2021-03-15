import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './style.module.scss'

const Header = () => {
  const toggleTheme = (e) => {
    e.preventDefault()
    console.log('lock wallet')
  }

  const openSettings = (e) => {
    e.preventDefault()
    console.log('lock wallet')
  }

  const logoutWallet = (e) => {
    e.preventDefault()
    console.log('lock wallet')
  }

  return (
    <div className={style.header}>
      <div className={style.menu}>
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
        <NavLink activeClassName={style.active} to="/nft">
          <span>NFT</span>
          <span>NFT</span>
        </NavLink>
        <NavLink activeClassName={style.active} to="/kickstart">
          <span>KickStart</span>
          <span>KickStart</span>
        </NavLink>
      </div>
      <div className={style.icons}>
        <a href="/" onClick={(e) => toggleTheme(e)}>
          <i className="fe fe-sun" />
        </a>
        <a href="/" onClick={(e) => openSettings(e)}>
          <i className="fe fe-settings" />
        </a>
        <a href="/" onClick={(e) => logoutWallet(e)}>
          <i className="fe fe-log-out" />
        </a>
      </div>
    </div>
  )
}

export default Header
