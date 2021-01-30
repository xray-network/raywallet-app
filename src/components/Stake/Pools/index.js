import React from 'react'
import { Button, Form, Input } from 'antd'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'

const StakeDelegation = () => {
  const pool = '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a'

  return (
    <div>
      <div className="ray__heading">RAY Pools List</div>
      <div className="ray__item">
        <div className="mb-1 d-flex">
          <div>
            <span className="badge badge-success mr-2">RAY</span>
          </div>
          <div>
            <strong>RAY Network</strong>
          </div>
        </div>
        <div className="mb-3">
          <Address address={pool} />
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Live Stake</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={60876045.125} ticker="ADA" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Saturation</div>
              <div className="ray__form__amount">87.13%</div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">TAx</div>
              <div className="ray__form__amount">3%</div>
            </div>
          </div>
        </div>
        <Button type="primary">
          <i className="fe fe-arrow-up-circle mr-1" />
          Delegate
        </Button>
      </div>
      <div className="ray__item">
        <div className="mb-1 d-flex">
          <div>
            <span className="badge badge-success mr-2">RAY2</span>
          </div>
          <div>
            <strong>RAY Network</strong>
          </div>
        </div>
        <div className="mb-3">
          <Address address={pool} />
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Live Stake</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={62311998.874} ticker="ADA" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Saturation</div>
              <div className="ray__form__amount">92.87%</div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">TAx</div>
              <div className="ray__form__amount">3%</div>
            </div>
          </div>
        </div>
        <Button type="primary">
          <i className="fe fe-arrow-up-circle mr-1" />
          Delegate
        </Button>
      </div>
      <div className="ray__item ray__item--primary">
        <div className="mb-1 d-flex">
          <div>
            <span className="badge badge-success mr-2">RAY3</span>
          </div>
          <div>
            <strong>RAY Network</strong>
          </div>
        </div>
        <div className="mb-3">
          <Address address={pool} />
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Live Stake</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={75645.125} ticker="ADA" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Saturation</div>
              <div className="ray__form__amount">0.13%</div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">TAx</div>
              <div className="ray__form__amount">3%</div>
            </div>
          </div>
        </div>
        <Button type="primary" disabled>
          <i className="fe fe-arrow-up-circle mr-1" />
          Current Pool
        </Button>
      </div>
      <div className="ray__heading">Delegate by Pool ID</div>
      <Form layout="vertical" requiredMark={false}>
        <Form.Item name="toAddress" rules={[{ required: true, message: 'Please enter pool id' }]}>
          <Input size="large" placeholder="Pool ID" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">
            <i className="fe fe-arrow-up-circle mr-1" />
            <strong>Delegate</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default StakeDelegation
