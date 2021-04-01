import React, { useState } from 'react'
import { Button, Input, Form, Tooltip, Statistic } from 'antd'
import AmountFormatter from 'components/Layout/AmountFormatter'

const RewardsActivities = () => {
  const [date] = useState(new Date('2021-06-01'))

  return (
    <div>
      <div className="ray__heading">Live Activities</div>
      <div className="ray__item ray__item--success">
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Expected Payout</div>
              <div className="ray__form__amount">
                <AmountFormatter
                  amount={15158}
                  ticker="ray"
                  hash="__RAYHASH__"
                  large
                  prefix="~"
                  availablePrivate
                />
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
                <AmountFormatter
                  amount={1725491.8542}
                  hash="ray"
                  ticker="ray"
                  large
                  availablePrivate
                />
              </div>
            </div>
            <div className="mb-3 mb-lg-2">
              <Button type="primary">
                <i className="fe fe-arrow-down-circle mr-1" />
                Withdraw Rewards
              </Button>
            </div>
          </div>
          <div className="col-lg-6">
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
                <span className="badge badge-light">100 ADA = 1 RAY</span>
              </div>
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
