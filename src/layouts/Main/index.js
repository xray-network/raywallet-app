import React from 'react'
import { withRouter } from 'react-router-dom'
import Footer from 'components/Layout/Footer'
import Header from 'components/Layout/Header'
import Menu from 'components/Layout/Menu'
import AddWallet from 'components/Modal/AddWallet'
import style from './style.module.scss'

const LayoutMain = ({ children }) => {
  return (
    <div className={style.container}>
      <AddWallet />
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.content}>
        <div className={style.menu}>
          <Menu />
        </div>
        <div className={style.page}>{children}</div>
      </div>
      <div className={style.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default withRouter(LayoutMain)
