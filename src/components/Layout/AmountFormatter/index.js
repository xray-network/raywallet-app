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
        {hash === 'lovelace' && (
          <span>
            <span>
              <strong>{isPrivateMode ? privateSymbols : integer(amount / 1000000)}</strong>
            </span>
            {!isPrivateMode && !noDecimals && <small>.{decimal(amount / 1000000)}</small>}
          </span>
        )}
        {hash !== 'lovelace' && (
          <span>
            <strong>
              {isPrivateMode
                ? privateSymbols
                : amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </strong>
          </span>
        )}
        <small>
          <sup className="text-uppercase ml-2">{ticker}</sup>
          {mappedHash && exchangeRates[mappedHash] && (
            <a className="ray__link ml-2">
              <Tooltip
                title={
                  <div className={style.exchange}>
                    <span>
                      ${' '}
                      {isPrivateMode
                        ? privateSymbols
                        : fixed(1 * exchangeRates[mappedHash].usd) || 0}
                    </span>
                    <br />
                    <span>
                      €{' '}
                      {isPrivateMode
                        ? privateSymbols
                        : fixed(1 * exchangeRates[mappedHash].eur) || 0}
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
