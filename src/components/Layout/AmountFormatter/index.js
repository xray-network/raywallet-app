import React from 'react'
import { Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import style from './style.module.scss'

const mapExchangeRateToAssetHash = {
  lovelace: {
    usd: 1.2,
    eur: 1.51,
  },
  // '7a920d21f8b6a7edbd8db5d30c36f009fa8ae9028698359697b8a34647ab7b17.ray': {
  //   usd: 0.34 / 100,
  //   eur: 0.29 / 100,
  // },
}

const AmountFormatter = ({ amount, ticker, hash, withRate, large, prefix, availablePrivate = false }) => {
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode) && availablePrivate
  const privateSymbols = '****** '

  const numberWithCommas = (x) => {
    return Number(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const fixed = (value, count = 2) => numberWithCommas(value.toFixed(count))
  const integer = (value) => (value && numberWithCommas(value.toString().split('.')[0])) || '0'
  const decimal = (value, count = 6) => {
    return (value && value.toFixed(count).toString().split('.')[1]) || '000000'
  }

  const exchangeRates = mapExchangeRateToAssetHash[hash]

  return (
    <div>
      <div className={`${style.total} ${large ? style.totalLarge : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <strong>{isPrivateMode ? privateSymbols : integer(amount)}</strong>
        </span>
        {!isPrivateMode && <small className="mr-2">.{decimal(amount)}</small>}
        <small>
          {ticker}
          {withRate && exchangeRates && (
            <a className="ray__link ml-2">
              <Tooltip
                title={
                  <div className={style.exchange}>
                    <span>$ {isPrivateMode ? privateSymbols : fixed(amount * exchangeRates.usd)}</span>
                    <br />
                    <span>€ {isPrivateMode ? privateSymbols : fixed(amount * exchangeRates.eur)}</span>
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
