import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Select, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import style from './style.module.scss'

const WalletsMenu = () => {
  const dispatch = useDispatch()
  const walletsList = useSelector((state) => state.wallets.walletsList)
  const wallet = useSelector((state) => state.wallets.wallet)
  const { data } = wallet

  const selectWallet = (value) => {
    dispatch({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'wallet',
        value: {
          ...wallet,
          selected: value,
        },
      },
    })
  }

  const refreshData = (walletId) => {
    dispatch({
      type: 'wallets/FETCH_WALLET_DATA',
      payload: {
        walletId,
      },
    })
  }

  const amount = (data.amount && data.amount.toString().split('.')[0]) || '0'
  const decimal = (data.amount && data.amount.toString().split('.')[1]) || '000000'

  return (
    <div>
      <Button hidden size="large" type="primary" className={style.btnAdd}>
        <i className="fe fe-plus-circle mr-2" />
        <strong>Add Wallet</strong>
      </Button>
      <div className={style.negativeSpace}>
        <div className={`${style.loader} ${wallet.loading ? style.loaderActive : ''}`}>
          <div className={style.loaderIcon}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
          <Select
            disabled={wallet.loading}
            onChange={(value) => selectWallet(value)}
            suffixIcon={<div className={style.selectWalletsArrow} />}
            defaultValue={wallet.selected || null}
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
            {walletsList.map((item) => {
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
      </div>
      <div className="mt-4">
        <div className={style.walletTotal}>
          <span>
            <strong>{amount}</strong>
          </span>
          <small className="mr-1">.{decimal}</small>
          <sup>{data.ticker}</sup>
        </div>
      </div>
      <div>
        <div className={style.fiatExchange}>
          <span>$ 0.00</span>
          <span>€ 0.00</span>
        </div>
      </div>
      <div className="mt-3">
        <a
          href="#"
          className={style.btnRefresh}
          onClick={(e) => {
            e.preventDefault()
            refreshData(wallet.selected)
          }}
        >
          <i className="fe fe-refresh-cw" />
        </a>
      </div>
      <div className="mt-3">
        <div className={style.walletInfo}>
          <div>Transactions: {(data.transactions && data.transactions.length) || '—'}</div>
          <div>
            Registered:{' '}
            {(data.registered && new Date(data.registered).toLocaleDateString('en-US')) || '—'}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className={style.walletMenu}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <i className="fe fe-plus-circle mr-2" />
            Add Wallet
          </a>
          <Link to="/defi">
            <i className="fe fe-plus-circle mr-2" />
            Create Own Token
          </Link>
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
