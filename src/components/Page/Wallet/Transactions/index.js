import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import Empty from 'components/Layout/Empty'
import Address from 'components/Layout/Address'
import AmountFormatter from 'components/Layout/AmountFormatter'

const WalletTransactions = () => {
  const transactions = useSelector((state) => state.wallets.walletTransactions)

  return (
    <div>
      <div className="ray__heading">Recently Transactions</div>
      {!transactions.length && <Empty title="No transactions found" />}
      {!!transactions.length > 0 &&
        transactions.map((tx, txIndex) => {
          const date = format(new Date(tx.includedAt), 'dd/MM/Y HH:mm:ss')
          return (
            <div key={txIndex} className="ray__tx">
              <div className="font-size-36 mr-3">
                {tx.type === 'send' && <i className="fe fe-arrow-up-circle text-danger" />}
                {tx.type === 'receive' && <i className="fe fe-arrow-down-circle text-success" />}
              </div>
              <div>
                <AmountFormatter
                  amount={Math.abs(tx.value)}
                  ticker="ada"
                  hash="lovelace"
                  prefix={tx.type === 'send' ? '-' : '+'}
                  availablePrivate
                />
                {tx.tokens.map((token, tokenIndex) => {
                  return (
                    <AmountFormatter
                      key={tokenIndex}
                      amount={Math.abs(token.quantity)}
                      ticker={token.ticker}
                      hash={token.assetId}
                      prefix={tx.type === 'send' ? '-' : '+'}
                      availablePrivate
                    />
                  )
                })}
                <div className="ray__address mt-2">
                  <span className="mr-3">Fee: {tx.fee / 1000000} ADA</span>
                  <span>Date: {date}</span>
                </div>
                <div>
                  <Address address={tx.hash} prefix="Tx:" cut />
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default WalletTransactions
