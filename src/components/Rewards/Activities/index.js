import React from 'react'
import { Button, Input, Form, Tooltip } from 'antd'
// import style from './style.module.scss'

const RewardsActivities = () => {
  return (
    <div>
      <div className="ray__item ray__item--primary">
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                Get a RAY rewards every 24h for delegating your ADA coins to any RAY pool.
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Your Rewards</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">182122.125125 RAY</span>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Reward Rate</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">1 ADA = 0.1 RAY</span>
              </div>
            </div>
          </div>
        </div>
        <Button type="primary">
          <i className="fe fe-arrow-down-circle mr-1" />
          Withdraw Reward
        </Button>
      </div>
      <div className="ray__item">
        <div className="row">
          <div className="col-lg-12">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">Airdrop for early RAY Network users.</div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Conditions</div>
              <div className="ray__form__amount">To be announced soon.</div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">**,***,***.00 $</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Form>
              <Form.Item className="mb-0">
                <Tooltip title="Activity will be available soon">
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
          <div className="col-lg-7">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Сonditions</div>
              <div className="ray__form__amount">
                <ol className="pl-4">
                  <li>You should delegate at least 100 ADA to any RAY pool.</li>
                  <li>One tweet per day.</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">50 RAY</span>
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
                <Tooltip title="Activity will be available soon">
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
