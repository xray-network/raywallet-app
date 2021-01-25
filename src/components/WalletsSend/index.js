import React from 'react'
import { useSelector } from 'react-redux'
// import style from './style.module.scss'

const WalletsSend = () => {
  const wallet = useSelector((state) => state.wallets.wallet)

  return (
    <div>
      send from:
      <br />
      {wallet.selected}
    </div>
  )
}

export default WalletsSend
