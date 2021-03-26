import React from 'react'
import { Helmet } from 'react-helmet'
import { Alert } from 'antd'
import NFTList from 'components/Page/NFT/List'

const Wallet = () => {
  return (
    <>
      <div className="mb-4">
        <Alert
          message="RAY NFT Marketplace will be available in the Goguen Era"
          description="Since this feature is directly related to smart contracts, it will be released as soon as Cardano brings it to life - in the Goguen Era."
          type="warning"
          showIcon
        />
      </div>
      <div className="ray__wrapper__full">
        <Helmet title="NFT Marketplace" />
        <NFTList />
      </div>
    </>
  )
}

export default Wallet
