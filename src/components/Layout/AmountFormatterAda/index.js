import React from 'react'
import { Popover } from 'antd'
import { useSelector } from 'react-redux'
import { CheckCircleFilled } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import style from './style.module.scss'

const AmountFormatterAda = ({ amount, small, inline, noDecimals, prefix, availablePrivate }) => {
  const exchangeRates = useSelector((state) => state.wallets.exchangeRates)
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode) && !!availablePrivate
  const privateSymbols = '******'

  const computedAmount = new BigNumber(amount).dividedBy(1000000)

  const numberWithCommas = (x, y = undefined) =>
    new BigNumber(x).toFixed(y).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const integer = (x) => numberWithCommas(new BigNumber(x).toFixed().split('.')[0])
  const decimal = (x) => new BigNumber(x).toFixed(6).split('.')[1] || '000000'
  const price = (x) => numberWithCommas(new BigNumber(x).toFixed(2), 2)

  const content = (
    <div className={style.info}>
      <div className={style.infoItem}>
        <strong className={style.infoTicker}>ADA</strong>
        <span className={style.infoVerified}>
          <CheckCircleFilled /> Cardano Official
        </span>
      </div>
      <div className={style.infoItem}>
        <div>
          <strong>
            <span className={style.infoLabel}>Price:</span> $
            {price(1 * exchangeRates.cardano?.usd || '0.00')} / €
            {price(1 * exchangeRates.cardano?.eur || '0.00')}
          </strong>
        </div>
      </div>
      <div className={style.infoItem}>
        <div>
          <strong>
            <span className={style.infoLabel}>Total:</span> $
            {isPrivateMode
              ? privateSymbols
              : price(computedAmount.multipliedBy(exchangeRates.cardano?.usd))}
          </strong>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`${style.formatter} ${inline ? style.formatterInline : ''}`}>
      <div className={`${style.total} ${small ? style.totalSmall : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <span>
            <strong>{isPrivateMode ? privateSymbols : integer(computedAmount)}</strong>
          </span>
          {!isPrivateMode && !noDecimals && <small>.{decimal(computedAmount)}</small>}
        </span>
      </div>
      <Popover content={content} title={null}>
        <span className={style.ticker}>ADA</span>
      </Popover>
    </div>
  )
}

export default AmountFormatterAda
