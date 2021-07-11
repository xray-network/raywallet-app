import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'antd'
import AddressQR from 'components/Layout/AddressQR'
import Empty from 'components/Layout/Empty'

const WalletsAddresses = () => {
  const [show, setShow] = useState(false)
  const walletAddresses = useSelector((state) => state.wallets.walletAddresses)

  const shift = 1
  const mainAddresses = walletAddresses.slice(0, shift)
  const additionalAddresses = walletAddresses.slice(shift)
  const addressesFound = walletAddresses.length > 0

  return (
    <div>
      <div className="ray__heading">Receiving Address</div>
      {!addressesFound && <Empty title="No addresses found" />}
      {addressesFound &&
        mainAddresses.map((address, index) => (
          <div key={index}>
            <AddressQR key={index} index={index} address={address} />
            <div className="ray__line" />
          </div>
        ))}
      {addressesFound &&
        show &&
        additionalAddresses.map((address, index) => (
          <div key={index}>
            <AddressQR key={index} index={index + shift} address={address} />
            <div className="ray__line" />
          </div>
        ))}
      {addressesFound && !show && (
        <div className="mb-4">
          <Button onClick={() => setShow(true)} className="w-100">
            <strong>Show all addresses</strong>
          </Button>
        </div>
      )}
    </div>
  )
}

export default WalletsAddresses
