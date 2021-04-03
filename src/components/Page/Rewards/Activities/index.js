import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Input, Form, Tooltip, Statistic, Alert } from 'antd'
import AmountFormatter from 'components/Layout/AmountFormatter'

const RewardsActivities = () => {
  const networkInfo = useSelector((state) => state.wallets.networkInfo)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletPools = useSelector((state) => state.wallets.walletPools)
  const startedAt = networkInfo.currentEpoch?.startedAt
  const date = startedAt ? new Date(startedAt).getTime() + 5 * 24 * 60 * 60 * 1000 : 0
  const rewardsAmount = parseInt((walletStake.activeStakeAmount || 0) / 100000000, 10) * 10

  const inRayPools = !(
    !walletPools.some((item) => item.hash === walletStake.stakePoolHash) && !!walletPools.length
  )

  return (
    <div>
      <div className="ray__heading">Live Activities</div>
      <div className="ray__item ray__item--success">
        <Alert
          message="All rewards from November 1, 2020 will be recalculated and added to your account after the withdrawal feature is launched. Your rewards are safe."
          className="mb-4"
        />
        {!inRayPools && (
          <Alert
            message="Your funds are delegated to non-RAY pools. RAY rewards are not calculated."
            className="mb-4"
          />
        )}
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Expected Payout</div>
              <div className="ray__form__amount">
                {(!walletStake.hasStakingKey || !inRayPools) && (
                  <strong className="font-size-24">Not delegated</strong>
                )}
                {walletStake.hasStakingKey && inRayPools && (
                  <AmountFormatter
                    amount={rewardsAmount}
                    ticker="ray"
                    hash="__RAYHASH__"
                    large
                    availablePrivate
                  />
                )}
              </div>
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
                <AmountFormatter amount={0} hash="ray" ticker="ray" large availablePrivate />
              </div>
            </div>
            <div className="mb-3 mb-lg-2">
              <Tooltip title="Soon">
                <Button type="primary" disabled>
                  <i className="fe fe-arrow-down-circle mr-1" />
                  Withdraw Rewards
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Controlled total stake</div>
              <div className="ray__form__amount">
                <AmountFormatter
                  amount={walletStake.activeStakeAmount || 0}
                  hash="lovelace"
                  ticker="ada"
                  large
                  availablePrivate
                />
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
                Receive additional RAY rewards every epoch (5 days) for delegating your ADA coins to
                any RAY pool
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Conditions</div>
              <div className="ray__form__amount">
                <small>
                  <p>You should delegate at least 100 ADA to any RAY pool</p>
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-0 mb-lg-0">
              <div className="ray__form__label">Reward Rate</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">10 ADA = 1 RAY</span>
              </div>
            </div>
          </div>
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
      <div className="ray__heading">Upcoming Activities</div>
      <div className="ray__item">
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">Airdrop to early RAY token users</div>
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
                <span className="badge badge-light">**,***,*** RAY</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-12">
            <Form>
              <Form.Item className="mb-0">
                <Tooltip title="Soon">
                  <Button type="primary" disabled>
                    <i className="fe fe-arrow-down-circle mr-1" />
                    Redeem Reward
                  </Button>
                </Tooltip>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <div className="ray__item">
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                Tweet about your experience with the RAY Network or any positive feedback with the
                hashtags below
                <div className="pt-2">
                  <code>
                    #giveaway #crypto #coinbase #binance $ray $btc $eth $ada $dot $usdt $xrp $link
                    $eos $ltc $sushi $uni
                  </code>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Сonditions</div>
              <div className="ray__form__amount">
                <small>
                  <ol className="pl-4 mb-0">
                    <li>You should delegate at least 1000 ADA to any RAY pool</li>
                    <li>One tweet per day / account</li>
                  </ol>
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-0 mb-lg-0">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">10 RAY</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-12">
            <Form>
              <Form.Item>
                <Input
                  disabled
                  placeholder="Tweet url"
                  allowClear
                  rules={[
                    { required: true, message: 'Please enter url' },
                    { required: true, type: 'url', message: 'This field must be a valid url' },
                  ]}
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Tooltip title="Soon">
                  <Button type="primary" disabled>
                    <i className="fe fe-arrow-down-circle mr-1" />
                    Redeem Reward
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
