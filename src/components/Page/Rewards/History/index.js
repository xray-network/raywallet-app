import React from 'react'
import { useSelector } from 'react-redux'
import Empty from 'components/Layout/Empty'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'

const RewardsHistory = () => {
  const walletData = useSelector((state) => state.wallets.walletData)

  return (
    <div>
      <div className="ray__heading">Recently Rewards</div>
      {(walletData.transactions == null || (walletData.transactions && walletData.transactions.length < 1)) && (
        <Empty title="No transactions" />
      )}
      {walletData.transactions &&
        walletData.transactions.map((tx, txIndex) => {
          return (
            <div key={txIndex} className="d-flex mb-4">
              <div className="font-size-36 mr-3">
                {tx.type === 'send' && <i className="fe fe-arrow-up-circle text-danger" />}
                {tx.type === 'receive' && <i className="fe fe-arrow-down-circle text-success" />}
              </div>
              <div>
                {tx.assets &&
                  tx.assets.map((asset, assetIndex) => {
                    return (
                      <AmountFormatter
                        key={assetIndex}
                        amount={asset.amount}
                        ticker={asset.ticker}
                        hash={asset.hash}
                        prefix={tx.type === 'send' ? '-' : '+'}
                      />
                    )
                  })}
                <div className="ray__address mt-2">
                  <span className="mr-3">Fee: {tx.fee} ADA</span>
                  <span>Date: {tx.date}</span>
                </div>
                <div>
                  <Address address={tx.id} cut prefix="Tx:" />
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default RewardsHistory
