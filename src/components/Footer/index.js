import React from 'react'
import style from './style.module.scss'
import { version } from '../../../package.json'
import { ReactComponent as Logo } from './logo.svg'

const Footer = () => {
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
    <div className={style.footer}>
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
      <div className={style.logo}>
        <Logo />
        <span className={style.logoName}>WALLET</span>
        <span className={style.version}>v{version}</span>
      </div>
    </div>
  )
}

export default Footer
