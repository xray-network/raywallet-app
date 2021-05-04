import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Tooltip, Statistic } from 'antd'
import BigNumber from 'bignumber.js'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AmountFormatterAsset from 'components/Layout/AmountFormatterAsset'

const RewardsActivities = () => {
  const networkInfo = useSelector((state) => state.wallets.networkInfo)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)
  const poolsInfo = useSelector((state) => state.wallets.poolsInfo)
  const startedAt = networkInfo.currentEpoch?.startedAt
  const date = startedAt ? new Date(startedAt).getTime() + 5 * 24 * 60 * 60 * 1000 : 0

  const totalAmount = new BigNumber(walletAssetsSummary.value).plus(walletStake.rewardsAmount)
  const expectedPayout = new BigNumber(totalAmount).dividedBy(1000000).dividedBy(50).integerValue()
  const inRayPools = poolsInfo.some((item) => item.delegateId === walletStake.currentPoolId)

  return (
    <div>
      <div className="ray__heading">Delegation to RAY pools</div>
      <div
        className={`ray__item ${
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
                    <strong className="ray__color font-size-24">Not delegated</strong>
                  )}
                  {walletStake.hasStakingKey && !inRayPools && (
                    <strong className="ray__color font-size-24">Not in RAY pool</strong>
                  )}
                  {walletStake.hasStakingKey && inRayPools && (
                    <AmountFormatterAsset
                      amount={expectedPayout}
                      fingerprint="asset1ray"
                      ticker="RAY"
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
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Rewards Balance</div>
              <div className="ray__form__amount">
                <AmountFormatterAsset
                  amount={0}
                  fingerprint="asset1ray"
                  ticker="RAY"
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
              <div className="ray__form__label text-danger">Launch Information</div>
              <small>
                <p className="mb-0">
                  All rewards from November 1, 2020 will be recalculated and added to your account
                  after the withdrawal feature is launched. Your rewards are safe.
                </p>
              </small>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                <small>
                  <p className="mb-0">
                    Receive additional RAY rewards every epoch (5 days) for delegating your ADA
                    coins to any RAY pool
                  </p>
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Conditions</div>
              <div className="ray__form__amount">
                <small>
                  <p>You should delegate at least 50 ADA to any RAY pool</p>
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-0">
              <div className="ray__form__label">Reward Rate</div>
              <div className="ray__form__amount">
                <span className="ray__badge">50 ADA = 1 RAY</span>
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
                  To receive withdrawal bonuses, you must send 2 ADA to cover txs commissions. These
                  funds, excluding Cardano txs commissions (~0.4 ADA), will be returned to you along
                  with RAY tokens
                </p>
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__heading">Airdrop for Early Users</div>
      <div className="ray__item ray__item--gray">
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                <small>
                  <div>Airdrop to early RAY token users</div>
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Conditions</div>
              <div className="ray__form__amount">
                <small>To be announced soon</small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-0 mb-lg-0">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="ray__badge">**,***,*** RAY</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-12">
            <Form>
              <Form.Item className="mb-0">
                <Tooltip title="Soon" placement="right">
                  <Button type="primary" disabled>
                    <i className="fe fe-arrow-down-circle mr-1" />
                    <strong>Redeem Reward</strong>
                  </Button>
                </Tooltip>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardsActivities
