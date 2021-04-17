import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import Empty from 'components/Layout/Empty'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'

const StakeHistory = () => {
  const walletStakeRewardsHistory = useSelector((state) => state.wallets.walletStakeRewardsHistory)

  return (
    <div>
      <div className="ray__heading">Recently Rewards</div>
      {!walletStakeRewardsHistory.length && <Empty title="No history" />}
      {walletStakeRewardsHistory.map((reward, index) => {
        return (
          <div key={index} className="ray__tx">
            <div className="font-size-36 mr-3">
              <i className="fe fe-plus-circle text-success" />
            </div>
            <div>
              <AmountFormatterAda amount={reward.amount} small />
              <div className="ray__address mt-2">
                <span className="mr-3">Epoch: {reward.earnedIn.number}</span>
                <span>
                  Date: {format(new Date(reward.earnedIn.lastBlockTime), 'dd/MM/Y HH:mm:ss')}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StakeHistory
