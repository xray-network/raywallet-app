import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Statistic, Spin, Tooltip } from 'antd'
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'
import Address from 'components/Layout/Address'
import Empty from 'components/Layout/Empty'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import style from './style.module.scss'

const StakeBalances = () => {
  const dispatch = useDispatch()
  const epochEndIns = useSelector((state) => state.wallets.epochEndIns)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)
  const poolsInfo = useSelector((state) => state.wallets.poolsInfo)

  const totalAmount = new BigNumber(walletAssetsSummary.value).plus(walletStake.rewardsAmount)
  const expectedPayout = new BigNumber(totalAmount)
    .multipliedBy(0.057)
    .integerValue(BigNumber.ROUND_DOWN)
    .dividedBy(73)
    .integerValue(BigNumber.ROUND_DOWN)
    .toFixed()

  const inRayPools =
    poolsInfo.some((item) => item.delegateId === walletStake.currentPoolId) &&
    walletStake.hasStakingKey
  const checkInRayPools = (delegateId) => poolsInfo.some((item) => item.delegateId === delegateId)
  const nextRewards = walletStake.nextRewardsHistory

  const withdraw = () => {
    dispatch({
      type: 'transactions/BUILD_TX',
      payload: {
        type: 'withdraw',
      },
    })
  }

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
              <div className="ray__form__label">Next Expected Payout</div>
              {!!poolsInfo.length && (
                <div className="ray__form__amount">
                  {!walletStake.hasStakingKey && (
                    <strong className="ray__color font-size-24">Not delegated</strong>
                  )}
                  {/* {walletStake.hasStakingKey && !inRayPools && (
                    <strong className="ray__color font-size-24">Not in RAY Pool</strong>
                  )} */}
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
              <div className="ray__form__label">Next payout date</div>
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
        {walletStake.hasStakingKey && (
          <div className="row pt-3">
            {nextRewards.map((item, index) => {
              const correctDate = item.rewardDate || false
              const date = format(new Date(correctDate), 'dd/MM/Y HH:mm')
              const current = nextRewards.length === index + 2
              const inRay = checkInRayPools(item.poolId)
              return (
                <div className="col-3" key={index}>
                  {item.empty ? (
                    <div className={style.rewardsEmpty} />
                  ) : (
                    <div className={style.rewardsItem}>
                      {inRay && (
                        <Tooltip title="RAY pool" placement="top">
                          <div className={`${style.rewardsIcon} ${style.rewardsIconSuccess}`}>
                            <CheckCircleFilled />
                          </div>
                        </Tooltip>
                      )}
                      {!inRay && (
                        <Tooltip title="Not a RAY pool" placement="top">
                          <div className={`${style.rewardsIcon}`}>
                            <CloseCircleFilled />
                          </div>
                        </Tooltip>
                      )}
                      <div className="ray__form__label mb-0">
                        {current && 'Current'}
                        {!current && 'Payout Date'}
                      </div>
                      <div className={style.rewardsEpoch}>
                        <div className={style.rewardsEpochCount}>{item.forEpoch}</div>
                        <div className={style.rewardsEpochInfo}>
                          <div>for</div>
                          <div>epoch</div>
                        </div>
                      </div>
                      <div className={style.rewardsDate}>
                        {correctDate && date}
                        {!correctDate && '—'}
                      </div>
                      {/* {checkInRayPools(item.poolId) && <div>IN RAY</div>} */}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
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
          <Button
            type="primary"
            disabled={
              !walletStake.hasStakingKey || new BigNumber(walletStake.rewardsAmount).isZero()
            }
            onClick={withdraw}
          >
            <i className="fe fe-arrow-down-circle mr-1" />
            <strong>Withdraw Rewards</strong>
          </Button>
        </div>
      </div>
      <div className="ray__heading">Current Delegation</div>
      {!poolsInfo.length && (
        <div className="ray__item py-5 text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      )}
      {!walletStake.hasStakingKey && !!poolsInfo.length && <Empty title="No delegation" />}
      {!inRayPools && walletStake.currentPoolId && walletStake.hasStakingKey && (
        <div className="ray__item position-relative">
          <Tooltip title="Not a RAY pool" placement="left">
            <div className="ray__item__icon">
              <CloseCircleFilled />
            </div>
          </Tooltip>
          <Address address={walletStake.currentPoolId || ''} cut prefix="Pool ID: " />
        </div>
      )}
      {inRayPools &&
        walletStake.currentPoolId &&
        poolsInfo.map((pool, index) => {
          const el = (
            <div className="ray__item position-relative ray__item--success" key={index}>
              {pool.delegateId === walletStake.currentPoolId && (
                <Tooltip title="Current delegation" placement="left">
                  <div className="ray__item__icon text-success">
                    <CheckCircleFilled />
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
