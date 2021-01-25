import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Select } from 'antd'
import style from './style.module.scss'

const wallets = [
  {
    id: '1f2d47627ae826e6b7d442dcf45d5a08efa8ad13040a3af0bc148612',
    name: 'My RAYs',
    ticker: 'RAY',
    network: 'cardano mainnet',
  },
  {
    id: 'efa8ad13040a3af0b1f2d47627ae826e6b7d442dcf45d5a08c148612',
    name: 'Cardano Stake',
    ticker: 'ADA',
    network: 'cardano mainnet',
  },
  {
    id: 'cf45d5a08c14861247627ae8efa8ad130b1f2d26e6b7d442d040a3af',
    name: 'Main',
    ticker: 'ADA',
    network: 'cardano mainnet',
  },
]

const WalletsMenu = () => {
  return (
    <div>
      <Button hidden size="large" type="primary" className={style.btnAdd}>
        <i className="fe fe-plus-circle mr-2" />
        <strong>Add Wallet</strong>
      </Button>
      <div className={style.negativeSpace}>
        <Select
          suffixIcon={<div className={style.selectWalletsArrow} />}
          defaultValue={wallets[0].id}
          className={style.selectWallets}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <div className="px-2 pt-2 pb-1">
                <Button size="large" className={style.btnAdd}>
                  <i className="fe fe-plus-circle" />
                  <strong>Add Wallet</strong>
                </Button>
              </div>
            </div>
          )}
        >
          {wallets.map((item) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                <div className={style.selectWalletsItem}>
                  <div>
                    <strong className="mr-1">{item.name}</strong>
                    <span className="badge badge-light">{item.ticker}</span>
                  </div>
                  <small>{item.network}</small>
                </div>
              </Select.Option>
            )
          })}
        </Select>
      </div>
      <div className="mt-4">
        <div className={style.walletTotal}>
          <span>
            <strong>1,215,829</strong>
          </span>
          <small className="mr-1">.820000</small>
          <sup>RAY</sup>
        </div>
      </div>
      <div>
        <div className={style.fiatExchange}>
          <span className="mr-2">$284,251.15</span>
          <span>€243,900.11</span>
        </div>
      </div>
      <div className="mt-3">
        <a href="#" onClick={(e) => e.preventDefault()} className={style.btnRefresh}>
          <i className="fe fe-refresh-cw" />
        </a>
      </div>
      <div className="mt-3">
        <div className={style.walletInfo}>
          <div>Transactions: 15</div>
          <div>Registered: 22/01/2021</div>
        </div>
      </div>
      <div className="mt-5">
        <div className={style.walletMenu}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <i className="fe fe-plus-circle mr-2" />
            Add Wallet
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <i className="fe fe-plus-circle mr-2" />
            Create Own Token
          </a>
          <Link to="/rewards">
            <i className="fe fe-activity mr-2" />
            RAY Reward Program
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WalletsMenu
