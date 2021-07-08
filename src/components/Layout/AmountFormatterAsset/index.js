import React from 'react'
import { Popover, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { CheckCircleFilled } from '@ant-design/icons'
import style from './style.module.scss'

const AmountFormatterAsset = ({
  amount,
  small,
  inline,
  prefix,
  availablePrivate,
  ticker,
  fingerprint,
}) => {
  const isPrivateMode = useSelector((state) => state.settings.isPrivateMode) && availablePrivate
  const verifiedTokensList = useSelector((state) => state.wallets.verifiedTokensList)
  const isVerified = verifiedTokensList.some((item) => item.fingerprint === fingerprint)
  const privateSymbols = '******'
  const computedAmount = new BigNumber(amount)

  const numberWithCommas = (x) => new BigNumber(x).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const onCopy = () => {
    message.success('Copied to clipboard')
  }

  const content = (
    <div className={style.info}>
      <div className={style.infoItem}>
        <div className={style.infoTicker}>{ticker}</div>
        {isVerified && (
          <span className={style.infoVerified}>
            <CheckCircleFilled /> Verified by RAY
          </span>
        )}
      </div>
      {fingerprint && (
        <div className={style.infoItem}>
          <CopyToClipboard text={fingerprint} onCopy={onCopy}>
            <span className="ray__badge ray__pointer">
              <small>
                {fingerprint.slice(0, 9)}...{fingerprint.slice(-4)}
              </small>
            </span>
          </CopyToClipboard>
        </div>
      )}
    </div>
  )

  return (
    <div className={`${style.formatter} ${inline ? style.formatterInline : ''}`}>
      <div className={`${style.total} ${small ? style.totalSmall : ''}`}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span>
          <span>
            <strong>
              {isPrivateMode ? privateSymbols : numberWithCommas(new BigNumber(computedAmount))}
            </strong>
          </span>
        </span>
      </div>
      {ticker && (
        <Popover content={content} title={null}>
          <span className={style.ticker}>
            {ticker.length > 12 ? `${ticker.slice(0, 4)}...${ticker.slice(-6)}` : ticker}
          </span>
        </Popover>
      )}
    </div>
  )
}

export default AmountFormatterAsset
