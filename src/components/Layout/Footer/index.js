import React from 'react'
import style from './style.module.scss'
import { version } from '../../../../package.json'

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.cardano}>
        <span>Powered with </span>
        <img src="/cardano.png" alt="" />
      </div>
      <div className={style.logo}>
        <img src="/logo.svg" alt="" />
        <span className={style.logoName}>Ray Wallet</span>
        <span className={style.version}>v{version}</span>
      </div>
    </div>
  )
}

export default Footer
