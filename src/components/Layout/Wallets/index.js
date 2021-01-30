import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Select, Spin, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import AmountFormatter from 'components/Layout/AmountFormatter'
import style from './style.module.scss'

const Wallets = () => {
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

  return (
    <div>
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
            placeholder={
              <div className={style.selectWalletsItem}>
                <div>
                  <span>No Wallets</span>
                </div>
                <small>You need to add at least one wallet</small>
              </div>
            }
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
                      <span className="badge badge-light">
                        {item.tickers.length} {item.tickers.length === 1 ? 'token' : 'tokens'}
                      </span>
                    </div>
                    <small>{item.network}</small>
                  </div>
                </Select.Option>
              )
            })}
          </Select>
        </div>
      </div>
      <div>
        <div className="mt-4">
          <a
            href="#"
            className={style.btnRefresh}
            onClick={(e) => {
              e.preventDefault()
              refreshData(wallet.selected)
            }}
          >
            <Tooltip title={<div>Update wallet</div>}>
              <i className="fe fe-refresh-cw mr-3" />
            </Tooltip>
          </a>
          <a
            href="#"
            className={style.btnRefresh}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Tooltip
              title={
                <div>
                  Wallet is encrypted and
                  <br /> saved on this device
                </div>
              }
            >
              <i className="fe fe-lock" />
            </Tooltip>
          </a>
        </div>
        <div className="mt-2">
          {data.assets &&
            data.assets.map((asset, index) => {
              return (
                <AmountFormatter
                  key={index}
                  amount={asset.amount}
                  ticker={asset.ticker}
                  hash={asset.hash}
                  withRate
                  large
                />
              )
            })}
        </div>
        <div className="mt-3">
          <div className={style.walletInfo}>
            <div>RAY Rewards: Not registered</div>
            <div>Staking: Not delegated</div>
            <div>Transactions: {(data.transactions && data.transactions.length) || '—'}</div>
            <div>
              Created: {(data.created && new Date(data.created).toLocaleDateString('en-US')) || '—'}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className={style.walletMenu}>
          <Link to="/defi/swap">
            <i className="fe fe-repeat mr-2" />
            Tokens Exchange
          </Link>
          <Link to="/kickstart/token/create">
            <i className="fe fe-plus-circle mr-2" />
            Create Own Token
          </Link>
          <Link to="/rewards/activities">
            <i className="fe fe-activity mr-2" />
            RAY Rewards Program
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Wallets
