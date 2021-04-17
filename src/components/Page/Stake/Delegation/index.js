import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Statistic, Spin, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Address from 'components/Layout/Address'
import Empty from 'components/Layout/Empty'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'

const StakeBalances = () => {
  const networkInfo = useSelector((state) => state.wallets.networkInfo)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const poolsInfo = useSelector((state) => state.wallets.poolsInfo)
  const startedAt = networkInfo.currentEpoch?.startedAt
  const date = startedAt ? new Date(startedAt).getTime() + 5 * 24 * 60 * 60 * 1000 : 0

  const inRayPools = poolsInfo.some((item) => item.id === walletStake.currentPoolId)
  const expectedPayout = (walletStake.activeStakeAmount * 0.057) / 73

  return (
    <div>
      <div className="ray__heading">Stake Balances</div>
      <div
        className={`ray__item mb-4 ${
          walletStake.hasStakingKey && inRayPools ? 'ray__item--success' : 'ray__item--gray'
        }`}
      >
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Expected Payout</div>
              {!!poolsInfo.length && (
                <div className="ray__form__amount">
                  {!walletStake.hasStakingKey && (
                    <strong className="font-size-24">Not delegated</strong>
                  )}
                  {walletStake.hasStakingKey && !inRayPools && (
                    <strong className="font-size-24">Not in RAY pool</strong>
                  )}
                  {walletStake.hasStakingKey && (
                    <AmountFormatterAda amount={expectedPayout} prefix="~" availablePrivate />
                  )}
                </div>
              )}
              {!poolsInfo.length && (
                <div className="ray__form__amount">
                  <strong className="font-size-24">Loading...</strong>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Next payout</div>
              <div className="ray__form__amount">
                <Statistic.Countdown
                  className="ray__count"
                  value={date}
                  format="D[d] HH[h] mm[m] ss[s]"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12 pt-2">
            <small>
              <p className="mb-0">
                The expected payout may be inaccurate and depends on the performance of the pools in
                each individual Epoch (such as pool active stake amount or pool saturation)
              </p>
            </small>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Rewards Balance</div>
              <div className="ray__form__amount">
                <AmountFormatterAda amount={walletStake.rewardsAmount} availablePrivate />
              </div>
            </div>
            <div className="mb-3 mb-lg-2">
              <Button
                type="primary"
                disabled={!walletStake.hasStakingKey || !walletStake.rewardsAmount}
              >
                <i className="fe fe-arrow-down-circle mr-1" />
                <strong>Withdraw Rewards</strong>
              </Button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Controlled total stake</div>
              <div className="ray__form__amount">
                <AmountFormatterAda amount={walletStake.activeStakeAmount} availablePrivate />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__heading">Current Delegation</div>
      {!poolsInfo.length && (
        <div className="ray__item py-5 text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      )}
      {!walletStake.currentPoolId && !!poolsInfo.length && <Empty title="No delegation" />}
      {!inRayPools && walletStake.currentPoolId && (
        <div className="ray__item">
          <Address address={walletStake.currentPoolId || ''} cut prefix="Pool ID: " />
        </div>
      )}
      {inRayPools &&
        walletStake.currentPoolId &&
        poolsInfo.map((pool, index) => {
          const amount = pool.activeStake_aggregate?.aggregate?.sum?.amount || '?'
          const el = (
            <div className="ray__item position ray__item--success" key={index}>
              {pool.id === walletStake.currentPoolId && (
                <Tooltip title="Delegated to this pool" placement="left">
                  <div className="ray__item__check">
                    <i className="fe fe-check-square" />
                  </div>
                </Tooltip>
              )}
              <div className="mb-1 d-flex">
                <div>
                  <span className="badge badge-success mr-2">{pool.ticker}</span>
                </div>
                <div>
                  <strong>{pool.name}</strong>
                </div>
              </div>
              <div className="mb-3">
                <Address address={pool.id} cut prefix="Pool ID:" />
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="ray__form__item mb-3 mb-lg-0">
                    <div className="ray__form__label">Active Stake</div>
                    <div className="ray__form__amount">
                      <AmountFormatterAda amount={amount} />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="ray__form__item mb-3 mb-lg-0">
                    <div className="ray__form__label">Saturation</div>
                    <div className="ray__form__amount">
                      {((amount / 64000000 / 1000000) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="ray__form__item mb-3 mb-lg-0">
                    <div className="ray__form__label">Fee Margin</div>
                    <div className="ray__form__amount">{(pool.margin * 100).toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>
          )
          return pool.id === walletStake.currentPoolId ? el : null
        })}
    </div>
  )
}

export default StakeBalances
