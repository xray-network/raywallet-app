import React from 'react'
import { Popover, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'
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

  const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

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
            <span className="font-size-12 badge badge-light">
              {fingerprint.slice(0, 9)}...{fingerprint.slice(-4)}
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
            <strong>{isPrivateMode ? privateSymbols : numberWithCommas(amount)}</strong>
          </span>
        </span>
      </div>
      {ticker && (
        <Popover content={content} title={null}>
          <span className={style.ticker}>{ticker}</span>
        </Popover>
      )}
    </div>
  )
}

export default AmountFormatterAsset
