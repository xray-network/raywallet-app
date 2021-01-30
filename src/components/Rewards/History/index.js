import React from 'react'
import { useSelector } from 'react-redux'
import Empty from 'components/Layout/Empty'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'

const RewardsHistory = () => {
  const wallet = useSelector((state) => state.wallets.wallet)
  const { data } = wallet

  return (
    <div>
      <div className="ray__heading">Recently Rewards</div>
      {(data.transactions == null || (data.transactions && data.transactions.length < 1)) && (
        <Empty title="No transactions" />
      )}
      {data.transactions &&
        data.transactions.map((tx, txIndex) => {
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
                  <Address address={tx.id} />
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default RewardsHistory
