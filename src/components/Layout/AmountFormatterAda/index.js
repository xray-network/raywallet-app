import React from 'react'
import { Popover } from 'antd'
import { useSelector } from 'react-redux'
import { CheckCircleFilled } from '@ant-design/icons'
import style from './style.module.scss'

const AmountFormatterAda = ({ amount, small, inline, noDecimals, prefix, availablePrivate }) => {
  const exchangeRates = useSelector((state) => state.wallets.exchangeRates)
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode) && !!availablePrivate
  const privateSymbols = '******'

  const computedAmount = amount / 1000000
  const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const integer = (x) => numberWithCommas(parseInt(x, 10))
  const decimal = (x) => x.toFixed(6).toString().split('.')[1] || '000000'
  const price = (x) => numberWithCommas(x.toFixed(2))

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
            $
            {isPrivateMode
              ? privateSymbols
              : price(computedAmount * exchangeRates.cardano?.usd || 0)}
          </strong>
        </div>
      </div>
      <div className={style.infoItem}>
        <div>
          <strong>
            ${price(1 * exchangeRates.cardano?.usd || 0)} / €
            {price(1 * exchangeRates.cardano?.eur || 0)}
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
