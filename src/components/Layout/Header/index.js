import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Switcher from './Switcher'
import PageSelector from './PageSelector'
import style from './style.module.scss'

const Header = () => {
  const sections = useSelector((state) => state.settings.sections)

  return (
    <div className={style.header}>
      <div className={style.menu}>
        <NavLink to="/wallet">
          <img className={style.letter} src="/ray-logo.svg" alt="" />
        </NavLink>
        <NavLink activeClassName={style.active} to="/wallet">
          <span>Wallet</span>
          <span>Wallet</span>
        </NavLink>
        {sections.includes('stake') && (
          <NavLink activeClassName={style.active} to="/stake">
            <span>Stake</span>
            <span>Stake</span>
          </NavLink>
        )}
        {sections.includes('rewards') && (
          <NavLink activeClassName={style.active} to="/rewards">
            <span>Rewards</span>
            <span>Rewards</span>
          </NavLink>
        )}
        {sections.includes('swap') && (
          <NavLink activeClassName={style.active} to="/swap">
            <span>Swap</span>
            <span>Swap</span>
          </NavLink>
        )}
        {sections.includes('kickstart') && (
          <NavLink activeClassName={style.active} to="/kickstart">
            <span>KickStart</span>
            <span>KickStart</span>
          </NavLink>
        )}
        {sections.includes('nft') && (
          <NavLink activeClassName={style.active} to="/nft">
            <span>NFT</span>
            <span>NFT</span>
          </NavLink>
        )}
        <PageSelector />
      </div>
      <div className="ml-auto">
        <Switcher />
      </div>
    </div>
  )
}

export default Header
