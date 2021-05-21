import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Tooltip, Statistic } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AmountFormatterAsset from 'components/Layout/AmountFormatterAsset'
import style from './style.module.scss'

const RewardsActivities = () => {
  const epochEndIns = useSelector((state) => state.wallets.epochEndIns)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)
  const poolsInfo = useSelector((state) => state.wallets.poolsInfo)
  const walletRayRewards = useSelector((state) => state.wallets.walletRayRewards)
  const walletRayRewardsBonus = useSelector((state) => state.wallets.walletRayRewardsBonus)

  console.log(walletRayRewardsBonus)

  const totalAmount = new BigNumber(walletAssetsSummary.value).plus(walletStake.rewardsAmount)
  const expectedPayout = new BigNumber(totalAmount)
    .dividedBy(1000000)
    .dividedBy(50)
    .integerValue(BigNumber.ROUND_DOWN)
    .toFixed()
  const inRayPools = poolsInfo.some((item) => item.delegateId === walletStake.currentPoolId)
  const checkInRayPools = (delegateId) => poolsInfo.some((item) => item.delegateId === delegateId)
  const nextRewards = walletStake.nextRewardsHistory

  return (
    <div>
      <div className="ray__heading">Stake Delegators Distribution</div>
      <div
        className={`ray__item ${
          walletStake.hasStakingKey && inRayPools ? 'ray__item--success' : 'ray__item--gray'
        }`}
      >
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Next Expected Payout</div>
              {!!poolsInfo.length && (
                <div className="ray__form__amount">
                  {!walletStake.hasStakingKey && (
                    <strong className="ray__color font-size-24">Not delegated</strong>
                  )}
                  {walletStake.hasStakingKey && !inRayPools && (
                    <strong className="ray__color font-size-24">Not in Ray pool</strong>
                  )}
                  {walletStake.hasStakingKey && inRayPools && (
                    <AmountFormatterAsset
                      amount={expectedPayout}
                      fingerprint="asset1ray"
                      ticker="XRAY"
                      availablePrivate
                    />
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
          <div className="col-lg-6">
            <div className="ray__form__item mb-0 mb-lg-0">
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
                      <div className={style.rewardsEpoch}>
                        <div className={style.rewardsEpochCount}>{item.forEpoch}</div>
                        <div className={style.rewardsEpochInfo}>
                          <div>for</div>
                          <div>epoch</div>
                        </div>
                      </div>
                      <div className={style.rewardsLabel}>
                        {current && <strong>Current</strong>}
                        {!current && 'Payout Date'}
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
        {/* <div className="ray__line" /> */}
        {walletRayRewardsBonus.amount && (
          <div className="ray__bonus mt-4">
            <div className="text-center">
              <h4>
                <strong>
                  Congratulations!{' '}
                  <span role="img" aria-label="">
                    🎉
                  </span>
                </strong>
              </h4>
              <p>
                <small>The Early Delegators Program has been achieved by you</small>
              </p>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="ray__form__label">Bonus Balance</div>
                <AmountFormatterAsset
                  amount={walletRayRewardsBonus.amount}
                  fingerprint="asset1ray"
                  ticker="XRAY"
                  availablePrivate
                />
              </div>
              <div className="col-6">
                <div className="ray__form__label">Your Bonus Share</div>
                <strong className="font-size-24">
                  {(walletRayRewardsBonus.share * 100 || 0).toFixed(2)}%
                </strong>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Rewards Balance</div>
              <div className="ray__form__amount">
                <AmountFormatterAsset
                  amount={walletRayRewards}
                  fingerprint="asset1ray"
                  ticker="XRAY"
                  availablePrivate
                />
              </div>
            </div>
            <div className="mb-3 mb-lg-2">
              <Tooltip placement="right" title="Soon">
                <Button type="primary" disabled>
                  <i className="fe fe-arrow-down-circle mr-1" />
                  <strong>Withdraw Rewards</strong>
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Controlled total stake</div>
              <div className="ray__form__amount">
                <AmountFormatterAda amount={totalAmount} availablePrivate />
              </div>
            </div>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                <small>
                  <p className="mb-0">
                    Receive additional XRAY rewards (total 100,000,000 XRAY) every epoch (5 days)
                    for delegating your ADA coins to any RAY pool. Additional distribution of Early
                    Delegators Program (total 1,538,200 XRAY) for early delegators ({'<275'} epoch).
                  </p>
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Condition</div>
              <div className="ray__form__amount">
                <small>
                  <p>You should delegate at least 50 ADA to any Ray pool</p>
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-0">
              <div className="ray__form__label">Reward Rate</div>
              <div className="ray__form__amount">
                <span className="ray__badge">min 50 ADA = 1 XRAY</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Processing Fees</div>
              <small>
                <p className="mb-0">
                  To receive your rewards, you must send 2 ADA to cover txs commissions. These
                  funds, excluding Cardano txs commissions (~0.4 ADA), will be returned to you along
                  with RAY tokens
                </p>
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__heading">Liquidity Providers Distribution</div>
      <div className="ray__item ray__item--gray">
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Rewards Balance</div>
              <div className="ray__form__amount">
                <div className="font-size-24 font-weight-700">
                  <strong>Coming Soon</strong>
                </div>
                {/* <AmountFormatterAsset
                  amount={0}
                  fingerprint="asset1ray"
                  ticker="XRAY"
                  availablePrivate
                /> */}
              </div>
            </div>
            <div className="mb-3 mb-lg-2">
              <Tooltip placement="right" title="Soon">
                <Button type="primary" disabled>
                  <i className="fe fe-arrow-down-circle mr-1" />
                  <strong>Withdraw Rewards</strong>
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Provided Liquidity in ADA</div>
              <div className="ray__form__amount">
                <AmountFormatterAda amount={0} availablePrivate />
              </div>
            </div>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                <small>
                  <div>Airdrop to early Ray Swap liquidity providers</div>
                </small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Condition</div>
              <div className="ray__form__amount">
                <small>
                  Providing (creating a pool or adding funds) the liquidity of swap pools
                </small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="ray__badge">**,***,*** XRAY</span>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="ray__form__item">
              <div className="ray__form__label">Processing Fees</div>
              <small>
                <p className="mb-0">
                  To receive your rewards, you must send 2 ADA to cover txs commissions. These
                  funds, excluding Cardano txs commissions (~0.4 ADA), will be returned to you along
                  with XRAY tokens
                </p>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardsActivities
