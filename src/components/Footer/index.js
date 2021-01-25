import React from 'react'
import style from './style.module.scss'
import { version } from '../../../package.json'
import { ReactComponent as Logo } from './logo.svg'

const Footer = () => {
  return (
    <div className="ray__block">
      <div className={style.footer}>
        <div className={style.logo}>
          <Logo />
          <span className={style.logoName}>WALLET</span>
          <span className={style.version}>v{version}</span>
        </div>
      </div>
    </div>
  )
}

export default Footer
