import React from 'react'
import { useSelector } from 'react-redux'
import style from './style.module.scss'

const AmountFormatterAda = ({ amount, small, noDecimals, prefix, availablePrivate }) => {
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode) && availablePrivate
  const privateSymbols = '******'

  const computedAmount = amount / 1000000
  const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const integer = (x) => numberWithCommas(parseInt(x, 10))
  const decimal = (x) => x.toFixed(6).toString().split('.')[1] || '000000'

  return (
    <div className={style.formatter}>
      <div className={`${style.total} ${small ? style.totalSmall : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <span>
            <strong>{isPrivateMode ? privateSymbols : integer(computedAmount)}</strong>
          </span>
          {!isPrivateMode && !noDecimals && <small>.{decimal(computedAmount)}</small>}
        </span>
      </div>
      <span className={style.ticker}>ADA</span>
    </div>
  )
}

export default AmountFormatterAda
