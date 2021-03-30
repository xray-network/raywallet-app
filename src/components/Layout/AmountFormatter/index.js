import React from 'react'
import { Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import style from './style.module.scss'

const hashMap = {
  lovelace: 'cardano',
}

const AmountFormatter = ({
  amount,
  ticker,
  hash,
  large,
  prefix,
  availablePrivate = false,
  noDecimals,
}) => {
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode) && availablePrivate
  const exchangeRates = useSelector((state) => state.wallets.exchangeRates)
  const privateSymbols = '****** '
  const computedAmount = hash === 'lovelace' ? amount / 1000000 : amount
  const mappedHash = hashMap[hash]

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

  return (
    <div>
      <div className={`${style.total} ${large ? style.totalLarge : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <strong>{isPrivateMode ? privateSymbols : integer(computedAmount)}</strong>
        </span>
        {!isPrivateMode && !noDecimals && <small>.{decimal(computedAmount)}</small>}
        <small>
          <span className="text-uppercase ml-2">{ticker}</span>
          {mappedHash && exchangeRates[mappedHash] && (
            <a className="ray__link ml-2">
              <Tooltip
                title={
                  <div className={style.exchange}>
                    <span>
                      ${' '}
                      {isPrivateMode
                        ? privateSymbols
                        : fixed(computedAmount * exchangeRates[mappedHash].usd) || 0}
                    </span>
                    <br />
                    <span>
                      €{' '}
                      {isPrivateMode
                        ? privateSymbols
                        : fixed(computedAmount * exchangeRates[mappedHash].eur) || 0}
                    </span>
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
