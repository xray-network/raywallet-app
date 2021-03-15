import React from 'react'
import { useSelector } from 'react-redux'
import Address from 'components/Layout/Address'
import Empty from 'components/Layout/Empty'

const WalletsAddresses = () => {
  const walletData = useSelector((state) => state.wallets.walletData)

  return (
    <div>
      <div className="ray__heading">Wallet Addresses</div>
      {!walletData.addresses && <Empty title="No addresses found" />}
      {walletData.addresses &&
        walletData.addresses.map((address, index) => {
          return (
            <div key={index} className="d-flex mb-4">
              <div className="ray__item__path mr-3">
                <sup>/</sup>
                {index}
              </div>
              <div>
                <Address address={address} />
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default WalletsAddresses
