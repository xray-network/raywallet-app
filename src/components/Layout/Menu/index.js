import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Select, Spin, Tooltip, Empty } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import AmountFormatter from 'components/Layout/AmountFormatter'
import style from './style.module.scss'

const Menu = () => {
  const dispatch = useDispatch()
  const walletList = useSelector((state) => state.wallets.walletList)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const walletData = useSelector((state) => state.wallets.walletData)
  const walletStore = useSelector((state) => state.wallets.walletStore)
  const walletLoading = useSelector((state) => state.wallets.walletLoading)
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode)

  const selectRef = useRef()

  const selectWallet = (value) => {
    dispatch({
      type: 'wallets/CHANGE_WALLET',
      payload: {
        accountId: value,
      },
    })
    selectRef.current.blur()
  }

  const handleAddWalletModalOpen = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalAddWallet',
        value: true,
      },
    })
  }

  const togglePrivateMode = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isPrivateMode',
        value: !isPrivateMode,
      },
    })
  }

  const refreshData = () => {
    dispatch({
      type: 'wallets/FETCH_WALLET_DATA',
    })
  }

  return (
    <div>
      <div className={style.negativeSpace}>
        <div className={`${style.loader} ${walletLoading ? style.loaderActive : ''}`}>
          <div className={style.loaderIcon}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
          <Select
            ref={selectRef}
            disabled={walletLoading}
            onChange={(value) => selectWallet(value)}
            suffixIcon={<div className={style.selectWalletsArrow} />}
            value={walletParams.accountId || null}
            className={style.selectWallets}
            notFoundContent={
              <Empty
                description="No Wallets"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="mt-4 mb-2"
              />
            }
            placeholder={
              <div className={style.selectWalletsItem}>
                <div>
                  <strong>No Wallets</strong>
                </div>
                <div className={style.selectWalletsItemDescr}>Add at least one wallet</div>
              </div>
            }
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div className="px-2 pt-2 pb-1">
                  <Button
                    size="large"
                    className="ray__btn__send w-100"
                    onClick={handleAddWalletModalOpen}
                    onKeyPress={handleAddWalletModalOpen}
                    role="button"
                    tabIndex="-1"
                  >
                    <i className="fe fe-plus-circle" />
                    <strong>Add Wallet</strong>
                  </Button>
                </div>
              </div>
            )}
          >
            {walletList.map((item) => {
              const totalTickers = walletStore[item.accountId]
                ? walletStore[item.accountId].tickers.length
                : '?'
              return (
                <Select.Option key={item.accountId} value={item.accountId}>
                  <div className={style.selectWalletsItem}>
                    <div>
                      <strong className={style.selectWalletsItemName}>{item.name}</strong>
                      <span className="badge badge-light">
                        {totalTickers} {totalTickers === 1 ? 'asset' : 'assets'}
                      </span>
                    </div>
                    <div className={style.selectWalletsItemDescr}>
                      {item.accountId.slice(0, 8)}...{item.accountId.slice(-12)}
                    </div>
                  </div>
                </Select.Option>
              )
            })}
          </Select>
        </div>
      </div>
      <div className="pt-4">
        {walletParams.accountId && (
          <div className="mb-3">
            <a
              href="#"
              className={`${style.btnRefresh} mr-3`}
              onClick={(e) => {
                e.preventDefault()
                refreshData()
              }}
            >
              <Tooltip title={<div>Update wallet</div>}>
                <i className="fe fe-refresh-cw" />
              </Tooltip>
            </a>
            <a
              href="#"
              className={`${style.btnRefresh} mr-3`}
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              <Tooltip
                title={
                  <div>
                    Wallet is not saved on this device
                  </div>
                }
              >
                <i className="fe fe-unlock" />
              </Tooltip>
            </a>
            <a
              href="#"
              className={`${style.btnRefresh} mr-3`}
              onClick={(e) => {
                e.preventDefault()
                togglePrivateMode()
              }}
            >
              <Tooltip
                title={
                  <div>
                    Toggle private mode
                  </div>
                }
              >
                {!isPrivateMode && <i className="fe fe-eye-off" />}
                {isPrivateMode && <i className="fe fe-eye" />}
              </Tooltip>
            </a>
          </div>
        )}
        {walletData.assets && (
          <div className="mb-3">
            {walletData.assets.map((asset, index) => {
              return (
                <AmountFormatter
                  key={index}
                  amount={asset.amount}
                  ticker={asset.ticker}
                  hash={asset.hash}
                  withRate
                  large
                  availablePrivate
                />
              )
            })}
          </div>
        )}
        {walletParams.accountId && (
          <div className="mb-5">
            <div className={style.walletInfo}>
              <div>Staking: Not delegated</div>
              <div>RAY Rewards: Not delegated</div>
              <div>
                Transactions: {(walletData.transactions && walletData.transactions.length) || '0'}
              </div>
            </div>
          </div>
        )}
        <div>
          <div className={style.walletMenu}>
            <a
              className="ray__link"
              onClick={handleAddWalletModalOpen}
              onKeyPress={handleAddWalletModalOpen}
              role="button"
              tabIndex="-1"
            >
              <i className="fe fe-plus-circle mr-2" />
              Add Wallet
            </a>
            <Link to="/swap">
              <i className="fe fe-repeat mr-2" />
              Tokens Exchange
            </Link>
            <Link to="/kickstart/token/create">
              <i className="fe fe-plus-circle mr-2" />
              Create Token
            </Link>
            <Link to="/rewards/activities">
              <i className="fe fe-activity mr-2" />
              RAY Rewards Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
