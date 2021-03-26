import React from 'react'
import style from './style.module.scss'
import { version } from '../../../../package.json'

const Footer = () => {
  return (
    <div>
      <div className={style.logo}>
        <img src="/logo.svg" alt="" />
        <span className={style.logoName}>WALLET</span>
        <span className={style.version}>v{version}</span>
      </div>
    </div>
  )
}

export default Footer
