import React from 'react'
import style from './style.module.scss'

const AmountFormatter = ({ amount, ticker, withRate, large, prefix }) => {
  const integer = (amount && amount.toString().split('.')[0]) || '0'
  const decimal = (amount && amount.toString().split('.')[1]) || '000000'

  return (
    <div>
      <div className={`${style.total} ${large ? style.totalLarge : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <strong>{integer}</strong>
        </span>
        <small className="mr-2">.{decimal}</small>
        <small>{ticker}</small>
      </div>
      {withRate && (
        <div className={style.exchange}>
          <span>$ 0.00</span>
          <span>€ 0.00</span>
        </div>
      )}
    </div>
  )
}

export default AmountFormatter
