import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Select, Spin, Tooltip, Empty, Statistic } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AmountFormatterAsset from 'components/Layout/AmountFormatterAsset'
import style from './style.module.scss'

const Menu = () => {
  const dispatch = useDispatch()
  const walletList = useSelector((state) => state.wallets.walletList)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const networkInfo = useSelector((state) => state.wallets.networkInfo)
  const epochEndIns = useSelector((state) => state.wallets.epochEndIns)
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletTransactions = useSelector((state) => state.wallets.walletTransactions)
  const walletStore = useSelector((state) => state.wallets.walletStore)
  const walletLoading = useSelector((state) => state.wallets.walletLoading)
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode)
  const sections = useSelector((state) => state.settings.sections)
  const isWalletInfo = useSelector((state) => state.settings.isWalletInfo)
  const isNetworkInfo = useSelector((state) => state.settings.isNetworkInfo)
  const isAssetsInfo = useSelector((state) => state.settings.isAssetsInfo)

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
      type: 'wallets/FETCH_NETWORK_STATE',
    })
    dispatch({
      type: 'wallets/FETCH_WALLET_DATA',
    })
    dispatch({
      type: 'wallets/FETCH_SIDE_DATA',
    })
  }

  const openSettings = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalSettings',
        value: true,
      },
    })
  }

  const openEncrypt = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalEncrypt',
        value: true,
      },
    })
  }

  const deleteWallet = () => {
    dispatch({
      type: 'wallets/DELETE_WALLET',
    })
  }

  const toggleWalletAssets = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isAssetsInfo',
        value: !isAssetsInfo,
      },
    })
  }

  const toggleWalletInfo = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isWalletInfo',
        value: !isWalletInfo,
      },
    })
  }

  const toggleNetworkInfo = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isNetworkInfo',
        value: !isNetworkInfo,
      },
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
                ? Number(walletStore[item.accountId].tokens)
                : '?'
              return (
                <Select.Option key={item.accountId} value={item.accountId}>
                  <div className={style.selectWalletsItem}>
                    {item.encrypted && (
                      <i className={`fe fe-lock ${style.selectWalletsItemLock}`} />
                    )}
                    <div className={style.selectWalletsItemLine}>
                      <strong className={style.selectWalletsItemName}>{item.name}</strong>
                      {!!totalTickers && (
                        <span className="ray__badge">
                          <small>
                            {totalTickers} {totalTickers === 1 ? 'asset' : 'assets'}
                          </small>
                        </span>
                      )}
                    </div>
                    <div className={style.selectWalletsItemDescr}>
                      ID: {item.accountId.slice(0, 8)}...{item.accountId.slice(-12)}
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
                togglePrivateMode()
              }}
            >
              <Tooltip title={<div>Toggle private mode</div>}>
                {!isPrivateMode && <i className="fe fe-eye-off" />}
                {isPrivateMode && <i className="fe fe-eye" />}
              </Tooltip>
            </a>
            <a
              href="#"
              className={`${style.btnRefresh} mr-3`}
              onClick={(e) => {
                e.preventDefault()
                openSettings()
              }}
            >
              <Tooltip title={<div>Wallet settings</div>}>
                <i className="fe fe-settings" />
              </Tooltip>
            </a>
            <a
              href="#"
              className={`${style.btnRefresh} mr-3`}
              onClick={(e) => {
                e.preventDefault()
                openEncrypt()
              }}
            >
              {!walletParams.encrypted && (
                <span className={style.statusUnlocked}>
                  <Tooltip title={<div>Wallet is not saved on this device</div>}>
                    <i className="fe fe-unlock" />
                    <i className="fe fe-unlock" />
                  </Tooltip>
                </span>
              )}
              {walletParams.encrypted && (
                <span className={style.statusLocked}>
                  <Tooltip title={<div>Wallet is encrypted</div>}>
                    <i className="fe fe-lock" />
                  </Tooltip>
                </span>
              )}
            </a>
            <a
              href="#"
              className={`${style.btnRefresh} mr-3`}
              onClick={(e) => {
                e.preventDefault()
                deleteWallet()
              }}
            >
              <Tooltip title={<div>Logout</div>}>
                <i className="fe fe-log-out" />
              </Tooltip>
            </a>
          </div>
        )}
        <div className={style.walletAssets}>
          {walletParams.accountId && (
            <AmountFormatterAda amount={walletAssetsSummary.value} availablePrivate />
          )}
        </div>
        {walletParams.accountId && (
          <div>
            <div>
              <span
                className={style.walletToggle}
                onClick={toggleWalletAssets}
                onKeyPress={toggleWalletAssets}
                role="button"
                tabIndex="0"
              >
                Wallet Assets ({walletAssetsSummary.tokens.length})
                <i className={style.walletToggleArrow} />
              </span>
              {isAssetsInfo && (
                <div className={`${style.walletInfo} ${style.walletScroll}`}>
                  {walletAssetsSummary.tokens.map((token, tokenIndex) => {
                    return (
                      <AmountFormatterAsset
                        key={tokenIndex}
                        amount={token.quantity}
                        ticker={token.ticker}
                        fingerprint={token.fingerprint}
                        small
                        availablePrivate
                      />
                    )
                  })}
                  {!walletAssetsSummary.tokens.length && <small>No Assets</small>}
                </div>
              )}
            </div>
            <div>
              <span
                className={style.walletToggle}
                onClick={toggleWalletInfo}
                onKeyPress={toggleWalletInfo}
                role="button"
                tabIndex="0"
              >
                Wallet Info
                <i className={style.walletToggleArrow} />
              </span>
              {isWalletInfo && (
                <div className={style.walletInfo}>
                  {sections.includes('stake') && (
                    <div>
                      <small>Stake Rewards:</small>{' '}
                      {!walletStake.hasStakingKey && <strong>—</strong>}
                      {walletStake.hasStakingKey && (
                        <span>
                          <AmountFormatterAda
                            amount={walletStake.rewardsAmount}
                            small
                            inline
                            availablePrivate
                          />
                        </span>
                      )}
                    </div>
                  )}
                  {sections.includes('rewards') && (
                    <div>
                      <small>RAY Rewards:</small> {!walletStake.hasStakingKey && <strong>—</strong>}
                      {walletStake.hasStakingKey && (
                        <span>
                          <AmountFormatterAsset
                            amount="0"
                            fingerprint="asset1ray"
                            ticker="RAY"
                            small
                            inline
                            availablePrivate
                          />
                        </span>
                      )}
                    </div>
                  )}
                  <div className="mb-2">
                    <small>Transactions:</small> {!walletTransactions.length && <strong>—</strong>}
                    {!!walletTransactions.length && (
                      <AmountFormatterAsset amount={walletTransactions.length} small inline />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mb-5">
          <span
            className={style.walletToggle}
            onClick={toggleNetworkInfo}
            onKeyPress={toggleNetworkInfo}
            role="button"
            tabIndex="0"
          >
            Network Info
            <i className={style.walletToggleArrow} />
          </span>
          {isNetworkInfo && (
            <div className={style.walletInfo}>
              <div>
                <small>Network Block:</small>{' '}
                <strong>
                  {networkInfo.tip?.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '—'}
                </strong>
              </div>
              <div>
                <small>Network Slot:</small>{' '}
                <strong>
                  {networkInfo.tip?.slotNo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '—'}
                </strong>
              </div>
              <div>
                <small>Current Epoch:</small>{' '}
                <strong>{networkInfo.currentEpoch?.number || '—'}</strong>
              </div>
              <div>
                <small>Ends In:</small>{' '}
                <strong>
                  <Statistic.Countdown
                    className="ray__count__inline"
                    value={epochEndIns}
                    format="D[d] HH[h] mm[m] ss[s]"
                  />
                </strong>
              </div>
            </div>
          )}
        </div>
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
            {sections.includes('rewards') && (
              <Link to="/rewards/activities">
                <i className="fe fe-activity mr-2" />
                RAY Rewards Program
              </Link>
            )}
            {sections.includes('swap') && (
              <Link to="/swap/swap">
                <i className="fe fe-repeat mr-2" />
                Tokens Exchange
              </Link>
            )}
            <Link to="/wallet/mint">
              <i className="fe fe-upload mr-2" />
              Mint Token
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
