import React from 'react'
import { useSelector } from 'react-redux'
// import style from './style.module.scss'

const WalletsAddresses = () => {
  const wallet = useSelector((state) => state.wallets.wallet)

  return (
    <div>
      addresses for:
      <br />
      {wallet.selected}
    </div>
  )
}

export default WalletsAddresses
