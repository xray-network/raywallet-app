import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Statistic } from 'antd'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'

const StakeBalances = () => {
  const walletData = useSelector((state) => state.wallets.walletData)
  const ada = (walletData.assets && walletData.assets[0]) || {}
  const reward = 7.815125
  const pool = '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a'
  const [date] = useState(new Date('2021-06-01'))

  return (
    <div>
      <div className="ray__heading">Stake Balances</div>
      <div className="ray__item ray__item--success mb-4">
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Expected Payout</div>
              <div className="ray__form__amount">
                <AmountFormatter
                  amount={((ada.amount + reward) * 0.055) / 73}
                  hash="lovelace"
                  availablePrivate
                  large
                  ticker="ada"
                  prefix="~"
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
            <div className="ray__form__item mb-0">
              <div className="ray__form__label">Information</div>
              <small>
                <p className="mb-0">
                  These funds will be automatically added to your wallet balance at the end of each
                  Epoch. The expected payout may be inaccurate and depends on the performance of the
                  pools in each individual Epoch (eg., active stake amount).
                </p>
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__heading">Delegation Pools</div>
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
          <Address address={pool} cut prefix="Pool ID:" />
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Live Stake</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={75645.125} ticker="ada" hash="lovelace" />
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
