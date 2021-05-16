import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin, Tooltip } from 'antd'
import { LoadingOutlined, CheckCircleFilled } from '@ant-design/icons'
import Address from 'components/Layout/Address'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'

const StakePools = () => {
  const dispatch = useDispatch()
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const poolsInfo = useSelector((state) => state.wallets.poolsInfo)

  const delegate = (id) => {
    dispatch({
      type: 'transactions/BUILD_TX',
      payload: {
        hasStakingKey: walletStake.hasStakingKey,
        poolId: id,
        type: 'delegate',
      },
    })
  }

  return (
    <div>
      <div className="ray__heading">Stake Pools</div>
      {!poolsInfo.length && (
        <div className="ray__item py-5 text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      )}
      {poolsInfo.map((pool, index) => {
        const inRayPools =
          pool.delegateId === walletStake.currentPoolId && walletStake.hasStakingKey
        return (
          <div
            className={`ray__item position ${
              inRayPools ? 'ray__item--success' : 'ray__item--gray'
            }`}
            key={index}
          >
            {inRayPools && (
              <Tooltip title="Current delegation" placement="left">
                <div className="ray__item__icon text-success">
                  <CheckCircleFilled />
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
              <Address address={pool.delegateId} cut prefix="Pool ID:" />
            </div>
            <div className="row">
              <div className="col-6">
                <div className="ray__form__item">
                  <div className="ray__form__label">Live Stake</div>
                  <div className="ray__form__amount">
                    <AmountFormatterAda amount={pool.total_stake} />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="ray__form__item">
                  <div className="ray__form__label">Active Stake</div>
                  <div className="ray__form__amount">
                    <AmountFormatterAda amount={pool.active_stake} small />
                  </div>
                </div>
              </div>
            </div>
            <div className="ray__line" />
            <div className="row">
              <div className="col-3">
                <div className="ray__form__item">
                  <div className="ray__form__label">Saturation</div>
                  <div className="ray__form__amount">{(pool.saturated * 100).toFixed(3)}%</div>
                </div>
              </div>
              <div className="col-3">
                <div className="ray__form__item">
                  <div className="ray__form__label">Fee Margin</div>
                  <div className="ray__form__amount">{(pool.tax_ratio * 100).toFixed(2)}%</div>
                </div>
              </div>
              <div className="col-3">
                <div className="ray__form__item">
                  <div className="ray__form__label">Blocks Lifetime</div>
                  <div className="ray__form__amount">{pool.blocks_lifetime}</div>
                </div>
              </div>
              <div className="col-3">
                <div className="ray__form__item">
                  <div className="ray__form__label">Blocks In Epoch</div>
                  <div className="ray__form__amount">{pool.blocks_epoch}</div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              {inRayPools && (
                <Button type="primary" disabled>
                  <i className="fe fe-arrow-up-circle mr-1" />
                  <strong>Delagated</strong>
                </Button>
              )}
              {(pool.delegateId !== walletStake.currentPoolId || !walletStake.hasStakingKey) && (
                <Button
                  type="primary"
                  onClick={() => delegate(pool.delegateId)}
                  disabled={!walletParams.accountId}
                >
                  <i className="fe fe-arrow-up-circle mr-1" />
                  <strong>Delegate</strong>
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StakePools
