import React from 'react'
import { withRouter } from 'react-router-dom'
import Footer from 'components/Footer'
import Header from 'components/Header'
import style from './style.module.scss'

const LayoutMain = ({ children }) => {
  return (
    <div className={style.container}>
      <div className={style.bg} />
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.content}>{children}</div>
      <div className={style.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default withRouter(LayoutMain)
