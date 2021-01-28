import React from 'react'
import { Button, Input, Form, Tooltip } from 'antd'
// import style from './style.module.scss'

const RewardsActivities = () => {
  return (
    <div>
      <div className="ray__heading">Activities list</div>
      <div className="ray__item">
        <div className="row">
          <div className="col-lg-8">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                Get a RAY reward with a K factor every 24 hours for delegating ADA coins to any RAY
                pool.
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Reward</div>
              <div className="ray__form__amount">
                <span className="badge badge-light">1 ADA = 0.1 RAY</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Button type="primary">
              <i className="fe fe-activity mr-1" />
              Register Wallet
            </Button>
          </div>
        </div>
      </div>
      <div className="ray__item">
        <div className="row">
          <div className="col-lg-8">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Description</div>
              <div className="ray__form__amount">
                Tweet about your experience with the RAY Network or any positive feedback with the
                hashtag above. One tweet per day.
                <div className="pt-2">
                  <code>
                    #giveaway #crypto #coinbase #ray #btc #eth #ada #dot #usdt #xrp #link #eos #ltc
                    #sushi #uni
                  </code>
                </div>
              </div>
            </div>
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Сonditions</div>
              <div className="ray__form__amount">
                You should delegate at least 100 ADA to any RAY pool.
              </div>
            </div>
          </div>
          <div className="col-lg-4">
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
                    <i className="fe fe-activity mr-1" />
                    Check Tweet
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
