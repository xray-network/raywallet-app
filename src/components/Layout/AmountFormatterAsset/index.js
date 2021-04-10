import React from 'react'
import { useSelector } from 'react-redux'
import style from './style.module.scss'

const AmountFormatterAsset = ({ amount, small, prefix, availablePrivate, ticker }) => {
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode) && availablePrivate
  const privateSymbols = '******'

  const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <div className={style.formatter}>
      <div className={`${style.total} ${small ? style.totalSmall : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <span>
            <strong>{isPrivateMode ? privateSymbols : numberWithCommas(amount)}</strong>
          </span>
        </span>
      </div>
      {ticker && <span className={style.ticker}>{ticker}</span>}
    </div>
  )
}

export default AmountFormatterAsset
