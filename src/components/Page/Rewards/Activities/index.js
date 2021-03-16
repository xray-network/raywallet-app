import React, { useState } from 'react'
import { Button, Input, Form, Tooltip, Statistic } from 'antd'
import AmountFormatter from 'components/Layout/AmountFormatter'

const RewardsActivities = () => {
  const [date] = useState(new Date("2021-06-01"))

  return (
    <div>
      <div className="ray__heading">Live Activities</div>
      <div className="ray__item ray__item--success">
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Expected Payout</div>
              <div className="ray__form__amount">
                <AmountFormatter
                  amount={15158}
                  ticker="RAY"
                  large
                  prefix="~"
                  availablePrivate
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
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
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                Receive additional RAY rewards every epoch (5 days) for delegating your ADA coins to any RAY pool.
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Conditions</div>
              <div className="ray__form__amount">
                <ol className="pl-4">
                  <li>You should delegate at least 100 ADA to any RAY pool.</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
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
              <div className="ray__form__amount">Airdrop to early RAY token users.</div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Conditions</div>
              <div className="ray__form__amount">To be announced soon.</div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">**,***,*** RAY</span>
              </div>
            </div>
          </div>
        </div>
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
                hashtags below.
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
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Сonditions</div>
              <div className="ray__form__amount">
                <ol className="pl-4">
                  <li>You should delegate at least 1000 ADA to any RAY pool.</li>
                  <li>One tweet per day.</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">10 RAY</span>
              </div>
            </div>
          </div>
        </div>
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
