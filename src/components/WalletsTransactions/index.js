import React from 'react'
import { useSelector } from 'react-redux'
// import style from './style.module.scss'

const WalletsTransactions = () => {
  const wallet = useSelector((state) => state.wallets.wallet)

  return (
    <div>
      transactions:
      <br />
      {wallet.selected}
    </div>
  )
}

export default WalletsTransactions
