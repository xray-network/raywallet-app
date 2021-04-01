import React from 'react'
import { withRouter } from 'react-router-dom'
import Footer from 'components/Layout/Footer'
import Menu from 'components/Layout/Menu'

const LayoutMain = ({ children }) => {
  return (
    <>
      <div className="ray__layout__container">
        <div className="ray__layout__content">
          <div className="ray__layout__menu">
            <Menu />
          </div>
          <div className="ray__layout__page">{children}</div>
        </div>
      </div>
      <div className="ray__layout__container mt-auto">
        <div className="ray__layout__footer">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default withRouter(LayoutMain)
