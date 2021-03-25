import React from 'react'
import { useSelector } from 'react-redux'
import AddressQR from 'components/Layout/AddressQR'
import Empty from 'components/Layout/Empty'

const WalletsAddresses = () => {
  const walletAddresses = useSelector((state) => state.wallets.walletAddresses)

  return (
    <div>
      <div className="ray__heading">Wallet Addresses</div>
      {!walletAddresses.length && <Empty title="No addresses found" />}
      {!!walletAddresses.length &&
        walletAddresses.map((address, index) => (
          <AddressQR key={index} index={index} address={address} />
        ))}
    </div>
  )
}

export default WalletsAddresses
