import React from 'react'
import { withRouter } from 'react-router-dom'
import Footer from 'components/Layout/Footer'
import Header from 'components/Layout/Header'
import Wallets from 'components/Layout/Wallets'
import style from './style.module.scss'

const LayoutMain = ({ children }) => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.content}>
        <div className={style.menu}>
          <Wallets />
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
