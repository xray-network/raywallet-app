import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AmountFormatter from 'components/AmountFormatter'
// import style from './style.module.scss'

const StakeBalances = () => {
  const wallet = useSelector((state) => state.wallets.wallet)
  const { data } = wallet
  const ada = (data.assets && data.assets[0]) || {}
  const reward = 7.815125
  const pool = '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a'

  const onCopy = () => {
    message.success('Pool ID copied to clipboard')
  }

  return (
    <div>
      <div className="ray__heading">Stake balances</div>
      <div className="ray__totals mb-4">
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
              Withdraw
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
      <div className="ray__heading">Current delegation</div>
      <div className="ray__item">
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
          <div className="col-lg-4">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Live Stake</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={75645.125} ticker="ADA" />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Saturation</div>
              <div className="ray__form__amount">0.13%</div>
            </div>
          </div>
          <div className="col-lg-4">
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
    </div>
  )
}

export default StakeBalances
