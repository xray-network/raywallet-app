import React from 'react'
import { Button, Tooltip, message, Form, Input } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AmountFormatter from 'components/Layout/AmountFormatter'
// import style from './style.module.scss'

const StakeDelegation = () => {
  const pool = '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a'

  const onCopy = () => {
    message.success('Pool ID copied to clipboard')
  }

  return (
    <div>
      <div className="ray__heading">Pools list</div>
      <div className="ray__item">
        <div className="mb-1">
          <span className="badge badge-success mr-2">RAY</span>
          <span className="mr-2">RAY Network</span>
          <a href={`https://cardanoscan.io/pool/${pool}`}>
            <Tooltip title="View on Cardanoscan">
              <i className="fe fe-external-link" />
            </Tooltip>
          </a>
        </div>
        <div className="ray__item__id mb-3">
          <CopyToClipboard text={pool} onCopy={onCopy}>
            <a>
              <Tooltip title="Copy to clipboard">
                {pool.slice(0, 20)}...{pool.slice(-20)}
              </Tooltip>
            </a>
          </CopyToClipboard>
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
              <div className="ray__form__amount">0%</div>
            </div>
          </div>
        </div>
        <Button type="primary">
          <i className="fe fe-arrow-up-circle mr-1" />
          Delegate
        </Button>
      </div>
      <div className="ray__item ray__item--primary">
        <div className="mb-1">
          <span className="badge badge-success mr-2">RAY2</span>
          <span className="mr-2">RAY Network</span>
          <a href={`https://cardanoscan.io/pool/${pool}`}>
            <Tooltip title="View on Cardanoscan">
              <i className="fe fe-external-link" />
            </Tooltip>
          </a>
        </div>
        <div className="ray__item__id mb-3">
          <CopyToClipboard text={pool} onCopy={onCopy}>
            <a>
              <Tooltip title="Copy to clipboard">
                {pool.slice(0, 20)}...{pool.slice(-20)}
              </Tooltip>
            </a>
          </CopyToClipboard>
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
