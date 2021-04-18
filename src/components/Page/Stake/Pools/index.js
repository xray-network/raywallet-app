import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Spin, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Address from 'components/Layout/Address'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'

const StakePools = () => {
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const poolsInfo = useSelector((state) => state.wallets.poolsInfo)

  return (
    <div>
      <div className="ray__heading">Stake Pools</div>
      {!poolsInfo.length && (
        <div className="ray__item py-5 text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      )}
      {poolsInfo.map((pool, index) => {
        const amount = pool.activeStake_aggregate?.aggregate?.sum?.amount || '?'
        return (
          <div
            className={`ray__item position ${
              pool.id === walletStake.currentPoolId ? 'ray__item--success' : 'ray__item--gray'
            }`}
            key={index}
          >
            {pool.id === walletStake.currentPoolId && (
              <Tooltip title="Delegated to this pool" placement="left">
                <div className="ray__item__check">
                  <i className="fe fe-check" />
                </div>
              </Tooltip>
            )}
            <div className="mb-1 d-flex">
              <div>
                <span className="badge badge-success mr-2">{pool.ticker}</span>
              </div>
              <div>
                <strong>{pool.name}</strong>
              </div>
            </div>
            <div className="mb-3">
              <Address address={pool.id} cut prefix="Pool ID:" />
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Active Stake</div>
                  <div className="ray__form__amount">
                    <AmountFormatterAda amount={amount} />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Saturation</div>
                  <div className="ray__form__amount">
                    {((amount / 64000000 / 1000000) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Fee Margin</div>
                  <div className="ray__form__amount">{(pool.margin * 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>
            {pool.id === walletStake.currentPoolId && (
              <Button type="primary" disabled>
                <i className="fe fe-arrow-up-circle mr-1" />
                <strong>Delagated</strong>
              </Button>
            )}
            {pool.id !== walletStake.currentPoolId && (
              <Button type="primary" disabled={!walletParams.accountId}>
                <i className="fe fe-arrow-up-circle mr-1" />
                <strong>Delegate</strong>
              </Button>
            )}
          </div>
        )
      })}
      <div className="ray__item">
        <Form layout="vertical" requiredMark={false}>
          <Form.Item name="toAddress" rules={[{ required: true, message: 'Please enter pool id' }]}>
            <Input size="large" placeholder="Delegate by Pool ID" allowClear autoComplete="off" />
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

export default StakePools
