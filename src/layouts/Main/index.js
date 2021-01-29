import React from 'react'
import { withRouter } from 'react-router-dom'
import Footer from 'components/Layout/Footer'
import Header from 'components/Layout/Header'
import Wallet from 'components/Layout/Wallet'
import style from './style.module.scss'

const LayoutMain = ({ children }) => {
  return (
    <div className={style.container}>
      <div className={style.bg} />
      <div className={style.header}>
        <div className="ray__block">
          <Header />
        </div>
      </div>
      <div className={style.content}>
        <div className="ray__block">
          <div className="ray__page">
            <div className="ray__menu">
              <Wallet />
            </div>
            <div className="ray__content">{children}</div>
          </div>
        </div>
      </div>
      <div className={style.footer}>
        <div className="ray__block">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default withRouter(LayoutMain)
