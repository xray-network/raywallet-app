import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Input } from 'antd'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'

const StakeBalances = () => {
  const wallet = useSelector((state) => state.wallets.wallet)
  const { data } = wallet
  const ada = (data.assets && data.assets[0]) || {}
  const reward = 7.815125
  const pool = '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a'

  return (
    <div>
      <div className="ray__heading">Stake Balances</div>
      <div className="ray__item ray__item--success ray__item--tinted mb-4">
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Rewards Balance</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={reward} ticker="ADA" withRate large />
              </div>
            </div>
            <Button type="primary">
              <i className="fe fe-arrow-down-circle mr-1" />
              Withdraw Reward
            </Button>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Wallet Balance</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={ada.amount} ticker="ADA" />
              </div>
            </div>
            <div className="ray__form__item">
              <div className="ray__form__label">Total Balance</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={ada.amount + reward} ticker="ADA" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__heading">Delegation Pools</div>
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
              <div className="ray__form__amount">0%</div>
            </div>
          </div>
        </div>
        <Button type="primary" disabled>
          <i className="fe fe-arrow-up-circle mr-1" />
          Delagated
        </Button>
      </div>
      <div className="ray__item">
        <Form layout="vertical" requiredMark={false}>
          <Form.Item name="toAddress" rules={[{ required: true, message: 'Please enter pool id' }]}>
            <Input size="large" placeholder="Delegate by pool ID" />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button htmlType="submit">
              <i className="fe fe-arrow-up-circle mr-1" />
              <strong>Delegate</strong>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default StakeBalances
