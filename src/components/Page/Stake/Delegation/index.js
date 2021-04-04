import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Statistic, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'

const StakeBalances = () => {
  const networkInfo = useSelector((state) => state.wallets.networkInfo)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletPools = useSelector((state) => state.wallets.walletPools)
  const startedAt = networkInfo.currentEpoch?.startedAt
  const date = startedAt ? new Date(startedAt).getTime() + 5 * 24 * 60 * 60 * 1000 : 0

  const maxSaturation = 64000000000000
  const inRayPools = !(
    !walletPools.some((item) => item.hash === walletStake.stakePoolHash) && !!walletPools.length
  )

  return (
    <div>
      <div className="ray__heading">Stake Balances</div>
      <div className="ray__item ray__item--success mb-4">
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
              <div className="ray__form__label">Expected Payout</div>
              <div className="ray__form__amount">
                {!walletStake.hasStakingKey && (
                  <strong className="font-size-24">Not delegated</strong>
                )}
                {walletStake.hasStakingKey && (
                  <AmountFormatter
                    amount={(walletStake.activeStakeAmount * 0.05) / 365 / 5 || 0}
                    hash="lovelace"
                    availablePrivate
                    large
                    ticker="ada"
                    prefix="~"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3 mb-lg-0">
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
          <div className="col-lg-12 pt-2">
            <small>
              <p className="mb-0">
                The expected payout may be inaccurate and depends on the performance of the pools in
                each individual Epoch (such as pool active stake amount or pool saturation)
              </p>
            </small>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Rewards Balance</div>
              <div className="ray__form__amount">
                <AmountFormatter
                  amount={walletStake.rewardsAmount || 0}
                  hash="lovelace"
                  ticker="ada"
                  large
                  availablePrivate
                />
              </div>
            </div>
            <div className="mb-3 mb-lg-2">
              <Button type="primary" disabled={!walletStake.hasStakingKey}>
                <i className="fe fe-arrow-down-circle mr-1" />
                Withdraw Rewards
              </Button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item mb-3">
              <div className="ray__form__label">Controlled total stake</div>
              <div className="ray__form__amount">
                <AmountFormatter
                  amount={walletStake.activeStakeAmount || 0}
                  hash="lovelace"
                  ticker="ada"
                  large
                  availablePrivate
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__heading">RAY Pools</div>
      {!walletPools.length && (
        <div className="ray__item py-5 text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      )}
      {walletPools.map((pool, index) => {
        const amount = pool.activeStake_aggregate?.aggregate?.sum?.amount
        return (
          <div className="ray__item" key={index}>
            <div className="mb-1 d-flex">
              <div>
                <span className="badge badge-success mr-2">RAY</span>
              </div>
              <div>
                <strong>RAY Network</strong>
              </div>
            </div>
            <div className="mb-3">
              <Address address={pool.hash} cut prefix="Pool ID:" />
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Active Stake</div>
                  <div className="ray__form__amount">
                    <AmountFormatter amount={amount} ticker="ada" hash="lovelace" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Saturation</div>
                  <div className="ray__form__amount">{(amount / maxSaturation).toFixed(4)}%</div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Tax</div>
                  <div className="ray__form__amount">{pool.margin * 100}%</div>
                </div>
              </div>
            </div>
            {pool.hash === walletStake.stakePoolHash && (
              <Button type="primary" disabled>
                <i className="fe fe-arrow-up-circle mr-1" />
                Delagated
              </Button>
            )}
            {pool.hash !== walletStake.stakePoolHash && (
              <Button type="primary">
                <i className="fe fe-arrow-up-circle mr-1" />
                Delegate
              </Button>
            )}
          </div>
        )
      })}
      <div className="ray__item">
        {!inRayPools && (
          <div>
            <div className="row">
              <div className="col-lg-12">
                <div className="ray__form__label">Delegated to</div>
                <div className="ray__form__amount">
                  <Address address={walletStake.stakePoolHash || ''} cut prefix="Pool ID: " />
                </div>
              </div>
            </div>
            <div className="ray__line" />
          </div>
        )}
        <Form layout="vertical" requiredMark={false}>
          <Form.Item name="toAddress" rules={[{ required: true, message: 'Please enter pool id' }]}>
            <Input size="large" placeholder="Delegate by pool ID" allowClear />
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
