import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'antd'
import { format } from 'date-fns'
import Empty from 'components/Layout/Empty'
import Address from 'components/Layout/Address'
import AmountFormatterAsset from 'components/Layout/AmountFormatterAsset'

const RewardsHistory = () => {
  const [count, setCount] = useState(5)
  const walletRayRewardsHistory = useSelector((state) => state.wallets.walletRayRewardsHistory)

  return (
    <div>
      <div className="ray__heading">Recently Rewards</div>
      {!walletRayRewardsHistory.length && <Empty title="No history" />}
      {walletRayRewardsHistory.slice(0, count).map((reward, index) => {
        return (
          <div key={index} className="ray__tx">
            <div className="font-size-36 mr-3">
              <i className="fe fe-plus-circle text-success" />
            </div>
            <div>
              <AmountFormatterAsset
                amount={reward.amount}
                ticker="XRAY"
                fingerprint="asset14y0dxsz9s9nd2lefkqvuu7edqlsg5p70r3wyxa"
                small
              />
              <div className="ray__address mt-2">
                <span className="mr-3">Epoch: {reward.epochNo}</span>
                <span className="mr-3">For Epoch: {reward.epochNo - 2}</span>
                <span>Date: {format(new Date(reward.timeStart), 'dd/MM/Y HH:mm:ss')}</span>
                <div>
                  <Address address={reward.poolId} prefix="Pool ID:" cut />
                </div>
              </div>
            </div>
          </div>
        )
      })}
      {count < walletRayRewardsHistory.length && (
        <div className="mb-4">
          <Button onClick={() => setCount(count + 5)} className="w-100">
            <strong>Show next 5 transactions</strong>
          </Button>
        </div>
      )}
    </div>
  )
}

export default RewardsHistory
