import React from 'react'
import { Tooltip } from 'antd'
import style from './style.module.scss'

const mapExchangeRateToAssetHash = {
  lovelace: {
    usd: 0.34,
    eur: 0.29,
  },
  '7a920d21f8b6a7edbd8db5d30c36f009fa8ae9028698359697b8a34647ab7b17.ray': {
    usd: 0.34 / 100,
    eur: 0.29 / 100,
  },
}

const AmountFormatter = ({ amount, ticker, hash, withRate, large, prefix }) => {
  const integer = (amount && amount.toString().split('.')[0]) || '0'
  const decimal = (amount && amount.toString().split('.')[1]) || '000000'

  const exchangeRates = mapExchangeRateToAssetHash[hash]

  return (
    <div>
      <div className={`${style.total} ${large ? style.totalLarge : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <strong>{integer}</strong>
        </span>
        <small className="mr-2">.{decimal}</small>
        <small>
          {ticker}
          {withRate && exchangeRates && (
            <a className="ray__link ml-2">
              <Tooltip
                title={
                  <div className={style.exchange}>
                    <span>$ {(amount * exchangeRates.usd).toFixed(2)}</span>
                    <br />
                    <span>€ {(amount * exchangeRates.eur).toFixed(2)}</span>
                  </div>
                }
              >
                <i className="fe fe-info ray__link" />
              </Tooltip>
            </a>
          )}
        </small>
      </div>
    </div>
  )
}

export default AmountFormatter
