import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Statistic, Spin, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import Address from 'components/Layout/Address'
import Empty from 'components/Layout/Empty'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import style from './style.module.scss'

const StakeBalances = () => {
  const epochEndIns = useSelector((state) => state.wallets.epochEndIns)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)
  const poolsInfo = useSelector((state) => state.wallets.poolsInfo)

  const totalAmount = new BigNumber(walletAssetsSummary.value).plus(walletStake.rewardsAmount)
  const expectedPayout = new BigNumber(totalAmount)
    .multipliedBy(0.057)
    .integerValue()
    .dividedBy(73)
    .integerValue()
    .toFixed()

  const inRayPools = poolsInfo.some((item) => item.delegateId === walletStake.currentPoolId)
  const checkInRayPools = (delegateId) => poolsInfo.some((item) => item.delegateId === delegateId)

  const nextRewards = walletStake.nextRewardsHistory.length
    ? walletStake.nextRewardsHistory
    : [1, 2, 3, 4].map(() => {
        return { empty: true }
      })

  console.log(nextRewards)

  return (
    <div>
      <div className="ray__heading">Stake Balances</div>
      <div
        className={`ray__item mb-4 ${
          walletStake.hasStakingKey && inRayPools ? 'ray__item--success' : 'ray__item--gray'
        }`}
      >
        <div className="row">
          <div className="col-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Expected Payout</div>
              {!!poolsInfo.length && (
                <div className="ray__form__amount">
                  {!walletStake.hasStakingKey && (
                    <strong className="ray__color font-size-24">Not delegated</strong>
                  )}
                  {walletStake.hasStakingKey && !inRayPools && (
                    <strong className="ray__color font-size-24">Not in RAY pool</strong>
                  )}
                  {walletStake.hasStakingKey && (
                    <AmountFormatterAda amount={expectedPayout} prefix="~" availablePrivate />
                  )}
                </div>
              )}
              {!poolsInfo.length && (
                <div className="ray__form__amount">
                  <strong className="ray__color font-size-24">Loading...</strong>
                </div>
              )}
            </div>
          </div>
          <div className="col-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Next payout</div>
              <div className="ray__form__amount">
                <Statistic.Countdown
                  className="ray__count"
                  value={epochEndIns}
                  format="D[d] HH[h] mm[m] ss[s]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {nextRewards.map((item) => {
            return (
              <div className="col-3">
                {item.empty ? (
                  <div className={style.rewardsEmpty} />
                ) : (
                  <div className={style.rewardsDefault}>
                    <div>{item.forEpoch}</div>
                    <div>{item.rewardDate || '—'}</div>
                    {checkInRayPools(item.poolId) && <div>IN RAY</div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Rewards Balance</div>
              <div className="ray__form__amount">
                <AmountFormatterAda amount={walletStake.rewardsAmount} availablePrivate />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Controlled total stake</div>
              <div className="ray__form__amount">
                <AmountFormatterAda amount={totalAmount} availablePrivate />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Tooltip placement="right" title="Soon">
            <Button
              type="primary"
              // disabled={!walletStake.hasStakingKey || !walletStake.rewardsAmount}
              disabled
            >
              <i className="fe fe-arrow-down-circle mr-1" />
              <strong>Withdraw Rewards</strong>
            </Button>
          </Tooltip>
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
          const el = (
            <div className="ray__item position ray__item--success" key={index}>
              {pool.delegateId === walletStake.currentPoolId && (
                <Tooltip title="Delegated to this pool" placement="left">
                  <div className="ray__item__check">
                    <i className="fe fe-check" />
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
                <Address address={pool.delegateId} cut prefix="Pool ID:" />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="ray__form__item">
                    <div className="ray__form__label">Live Stake</div>
                    <div className="ray__form__amount">
                      <AmountFormatterAda amount={pool.total_stake} />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ray__form__item">
                    <div className="ray__form__label">Active Stake</div>
                    <div className="ray__form__amount">
                      <AmountFormatterAda amount={pool.active_stake} small />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ray__line" />
              <div className="row">
                <div className="col-3">
                  <div className="ray__form__item">
                    <div className="ray__form__label">Saturation</div>
                    <div className="ray__form__amount">{(pool.saturated * 100).toFixed(2)}%</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="ray__form__item">
                    <div className="ray__form__label">Fee Margin</div>
                    <div className="ray__form__amount">{(pool.tax_ratio * 100).toFixed(2)}%</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="ray__form__item">
                    <div className="ray__form__label">Blocks Lifetime</div>
                    <div className="ray__form__amount">{pool.blocks_lifetime}</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="ray__form__item">
                    <div className="ray__form__label">Blocks In Epoch</div>
                    <div className="ray__form__amount">{pool.blocks_epoch}</div>
                  </div>
                </div>
              </div>
            </div>
          )
          return pool.delegateId === walletStake.currentPoolId ? el : null
        })}
    </div>
  )
}

export default StakeBalances
