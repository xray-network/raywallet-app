import React from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector } from 'react-redux'
import Empty from 'components/Empty'
import AmountFormatter from 'components/AmountFormatter'
import style from './style.module.scss'

const WalletsTransactions = () => {
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
        data.transactions.map((tx, index) => {
          return (
            <div key={index} className={style.item}>
              <div className={style.icon}>
                {tx.type === 'send' && <i className="fe fe-arrow-up-circle text-danger" />}
                {tx.type === 'receive' && <i className="fe fe-arrow-down-circle text-success" />}
              </div>
              <div className={style.wrapper}>
                <AmountFormatter
                  amount={tx.amount}
                  ticker={data.ticker}
                  fee={tx.fee}
                  prefix={tx.type === 'send' ? '-' : '+'}
                />
                <div>Fee: {tx.fee} ADA</div>
                <div className={style.date}>Date: {tx.date}</div>
                <div>
                  <Tooltip title="Visit on Cardanoscan">
                    <a
                      className={style.address}
                      href={`https://cardanoscan.io/transaction/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tx.id.slice(0, 10)}...{tx.id.slice(-10)}
                    </a>
                  </Tooltip>
                  <CopyToClipboard text={tx.id} onCopy={onCopy}>
                    <Tooltip title="Copy to clipboard">
                      <a className="ray__link ml-2">
                        <i className="fe fe-copy mr-1" />
                      </a>
                    </Tooltip>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default WalletsTransactions
