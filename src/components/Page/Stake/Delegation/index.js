import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Statistic, Tooltip, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { addHours } from 'date-fns'
import Confetti from 'react-confetti'
import BigNumber from 'bignumber.js'
import { format } from 'utils/utils'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AmountFormatterAsset from 'components/Layout/AmountFormatterAsset'
import ChartTrackXray from './ChartTrackXray'
import ChartTrackAda from './ChartTrackAda'
import * as style from './style.module.scss'

const StakeBalances = () => {
  const networkInfo = useSelector((state) => state.wallets.networkInfo)
  const epochEndIns = useSelector((state) => state.wallets.epochEndIns)
  const walletStake = useSelector((state) => state.wallets.walletStake)
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)
  const walletIspoBalance = useSelector((state) => state.wallets.walletIspoBalance)
  const walletAdaRewards = useSelector((state) => state.wallets.walletAdaRewards)
  const loading = useSelector((state) => state.wallets.walletStakeLoading)

  const walletIspoHistory = useSelector((state) => state.wallets.walletIspoHistory)
  const hasPayouts = true
  const totalAdaRewards =
    walletAdaRewards?.rewards
      ?.filter((r) => r.earnedIn.number !== networkInfo?.currentEpoch?.number - 1)
      .reduce((acc, r) => acc + parseInt(r.amount, 10), 0) || 0

  return (
    <div>
      {walletIspoHistory.syncingNextEpoch && (
        <Alert
          className="mb-4"
          message={
            <div>
              <span>
                Epoch {networkInfo?.currentEpoch?.number || 0} is syncing. Rewards accruals will
                finish in about
              </span>{' '}
              <Statistic.Countdown
                className="ray__count__inline"
                value={addHours(new Date(networkInfo?.currentEpoch?.startedAt || null), 6)}
                format="D[d] HH[h] mm[m] ss[s]"
              />
            </div>
          }
          type="warning"
          showIcon
        />
      )}
      {!loading && !walletIspoHistory.found && (
        <Alert
          className="mb-4"
          message="Your stake is not yet matured. You must wait 2 epochs after delegation to start accruing XRAY rewards."
          type="warning"
          showIcon
        />
      )}
      <div className="ray__heading">Stake Balances</div>
      <div className={`ray__item mb-4 ${style.diamond}`}>
        <Confetti width={600} height={150} />
        <div className="d-flex">
          <img src="/resources/XDIAMOND.png" alt="XDIAMOND" />
          <div>
            <div className="ray__card__title">Early Delegator Bonus (End in Epoch 275)</div>
            <div className="ray__card__amount">
              <AmountFormatterAsset
                amount={walletIspoHistory?.bonus || 0}
                fingerprint="asset1y7lphaaxkvjw5hl2kpq37nvlvg09qfqsh4qyme"
                ticker="XDIAMOND"
                availablePrivate
              />
            </div>
            <div className="d-flex">
              <div>
                {!loading && hasPayouts && !!walletIspoHistory?.bonus && (
                  <span className={style.diamondStatus}>
                    <span className="icn icn-success icn-fix me-1">
                      <i className="fe fe-check-circle text-success mr-2" />
                    </span>
                    Paid
                  </span>
                )}
                {!loading && !hasPayouts && !!walletIspoHistory?.bonus && (
                  <span className={style.diamondStatus}>
                    <span className="icn icn-success icn-fix me-1">
                      <i className="fe fe-check-circle text-success mr-2" />
                    </span>
                    Ready
                  </span>
                )}
                {!loading && !walletIspoHistory?.bonus && (
                  <span className={style.diamondStatus}>
                    <span className="icn icn-success icn-fix me-1">
                      <i className="fe fe-x-circle text-danger mr-2" />
                    </span>
                    Not registered
                  </span>
                )}
              </div>
              <div className={style.diamondBuy}>
                <a href="https://xdiamond.rraayy.com" target="_blank" rel="noopener noreferrer">
                  <strong>Buy XDIAMOND &rarr;</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__item mb-4">
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Controlled Total Stake</div>
              <div className="ray__form__amount">
                <AmountFormatterAda
                  amount={new BigNumber(walletAssetsSummary.value || 0).plus(
                    walletStake.rewardsBalance || 0,
                  )}
                  availablePrivate
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Next Payout</div>
              <div className="ray__form__amount">
                <Statistic.Countdown
                  className="ray__count"
                  value={epochEndIns}
                  format="D[d] HH[h] mm[m] ss[s]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="ray__line" />
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item">
              <div className="ray__form__label">XRAY Rewards</div>
              <div className="ray__form__amount">
                <div className="mb-2">
                  <AmountFormatterAsset
                    amount={walletIspoBalance.balance || 0}
                    fingerprint="asset14y0dxsz9s9nd2lefkqvuu7edqlsg5p70r3wyxa"
                    ticker="XRAY"
                    availablePrivate
                  />
                </div>
                <Tooltip title="Will be available in RayWallet V2">
                  <Button
                    type="primary"
                    // disabled={!walletStake.hasStakingKey || new BigNumber(walletStake.rewardsAmount).isZero()}
                    disabled
                  >
                    <i className="fe fe-arrow-down-circle mr-1" />
                    <strong>Withdraw XRAY</strong>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item">
              <div className="ray__form__label">ADA Rewards</div>
              <div className="ray__form__amount">
                <div className="mb-2">
                  <AmountFormatterAda amount={walletStake.rewardsBalance || 0} availablePrivate />
                </div>
                <Tooltip title="Will be available in RayWallet V2">
                  <Button
                    type="primary"
                    // disabled={!walletStake.hasStakingKey || new BigNumber(walletStake.rewardsAmount).isZero()}
                    disabled
                  >
                    <i className="fe fe-arrow-down-circle mr-1" />
                    <strong>Withdraw ADA</strong>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ray__heading">Rewards History</div>
      {loading && (
        <div className="ray__item py-5 text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      )}
      {!loading && (
        <div>
          <div className="ray__item mb-4">
            <div className="ray__form__item">
              <div className="ray__form__label">
                Total {format(walletIspoHistory?.totalAccrued || 0)} XRAY
              </div>
              <ChartTrackXray history={walletIspoHistory?.distributionHistory || []} />
            </div>
          </div>
          <div className="ray__item mb-4">
            <div className="ray__form__item">
              <div className="ray__form__label">
                Total {format(totalAdaRewards / 1000000 || 0, 6)} ADA
              </div>
              <ChartTrackAda
                history={walletAdaRewards?.rewards || []}
                epochCut={networkInfo?.currentEpoch?.number - 1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StakeBalances
