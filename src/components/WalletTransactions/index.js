import React from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'
import Empty from 'components/Empty'
import AmountFormatter from 'components/AmountFormatter'
import style from './style.module.scss'

const WalletTransactions = () => {
  const wallet = useSelector((state) => state.wallets.wallet)
  const { data } = wallet

  const onCopy = () => {
    message.success('Transaction ID copied to clipboard')
  }

  return (
    <div>
      {(data.transactions == null || (data.transactions && data.transactions.length < 1)) && (
        <Empty title="No transactions" />
      )}
      {data.transactions &&
        data.transactions.map((tx, txIndex) => {
          return (
            <div key={txIndex} className={style.item}>
              <div className={style.icon}>
                {tx.type === 'send' && <i className="fe fe-arrow-up-circle text-danger" />}
                {tx.type === 'receive' && <i className="fe fe-arrow-down-circle text-success" />}
              </div>
              <div className={style.wrapper}>
                {tx.assets &&
                  tx.assets.map((asset, assetIndex) => {
                    return (
                      <AmountFormatter
                        key={assetIndex}
                        amount={asset.amount}
                        ticker={asset.ticker}
                        hash={asset.hash}
                        prefix={tx.type === 'send' ? '-' : '+'}
                      />
                    )
                  })}
                <div>Fee: {tx.fee} ADA</div>
                <div className={style.info}>
                  <div>{tx.date}</div>
                  <div>
                    <CopyToClipboard text={tx.id} onCopy={onCopy}>
                      <a className={style.address}>
                        <Tooltip title="Copy to clipboard">
                          {tx.id.slice(0, 10)}...{tx.id.slice(-10)}
                        </Tooltip>
                      </a>
                    </CopyToClipboard>
                    <a
                      className="ray__link ml-2"
                      href={`https://cardanoscan.io/transaction/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Tooltip title="View on Cardanoscan">
                        <i className="fe fe-info" />
                      </Tooltip>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default WalletTransactions
