import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useRouteMatch } from 'react-router-dom'

const WalletSubmenu = () => {
  const { url } = useRouteMatch()
  const walletTransactions = useSelector((state) => state.wallets.walletTransactions)

  return (
    <div>
      <div className="ray__submenu">
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/send`}>
          <span>Send</span>
          <span>Send</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/addresses`}>
          <span>Receive</span>
          <span>Receive</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/mint`}>
          <span>Mint</span>
          <span>Mint</span>
        </NavLink>
        <NavLink exact activeClassName="ray__submenu__item--active" to={`${url}/transactions`}>
          <span>Transactions ({walletTransactions.length})</span>
          <span>Transactions ({walletTransactions.length})</span>
        </NavLink>
      </div>
    </div>
  )
}

export default WalletSubmenu
