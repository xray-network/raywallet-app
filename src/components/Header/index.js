import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './style.module.scss'

const Header = () => {
  const lockWallet = (e) => {
    e.preventDefault()
    console.log('lock wallet')
  }

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
    <div className="ray__block">
      <div className={style.header}>
        <div className={style.menu}>
          <NavLink activeClassName={style.active} to="/wallets">
            <span>Wallets</span>
            <span>Wallets</span>
          </NavLink>
          <NavLink activeClassName={style.active} to="/staking-center">
            <span>Staking Center</span>
            <span>Staking Center</span>
          </NavLink>
          <NavLink activeClassName={style.active} to="/rewards">
            <span>Rewards</span>
            <span>Rewards</span>
          </NavLink>
          <NavLink activeClassName={style.active} to="/kick-starter">
            <span>Kick Starter</span>
            <span>Kick Starter</span>
          </NavLink>
        </div>
        <div className={style.icons}>
          <a href="/" onClick={(e) => lockWallet(e)}>
            <i className="fe fe-unlock" />
          </a>
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
    </div>
  )
}

export default Header
