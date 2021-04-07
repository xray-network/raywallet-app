import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Button } from 'antd'
import Empty from 'components/Layout/Empty'
import Address from 'components/Layout/Address'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AmountFormatterAsset from 'components/Layout/AmountFormatterAsset'
import { BigIntAbs } from 'utils/utils'

const WalletTransactions = () => {
  const [count, setCount] = useState(5)
  const transactions = useSelector((state) => state.wallets.walletTransactions)

  return (
    <div>
      <div className="ray__heading">Recently Transactions</div>
      {!transactions.length && <Empty title="No transactions found" />}
      {!!transactions.length > 0 && (
        <div>
          {transactions.slice(0, count).map((tx, txIndex) => {
            const date = format(new Date(tx.includedAt), 'dd/MM/Y HH:mm:ss')
            return (
              <div key={txIndex} className="ray__tx">
                <div className="font-size-36 mr-3">
                  {tx.type === 'send' && <i className="fe fe-arrow-up-circle text-danger" />}
                  {tx.type === 'receive' && <i className="fe fe-arrow-down-circle text-success" />}
                </div>
                <div>
                  <AmountFormatterAda amount={tx.value} />
                  {tx.tokens.map((token, tokenIndex) => {
                    return (
                      <AmountFormatterAsset key={tokenIndex} amount={BigIntAbs(token.quantity)} />
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
          {count < transactions.length && (
            <div className="mb-3">
              <Button onClick={() => setCount(count + 5)} className="w-100">
                <strong>Show next 5 transactions</strong>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WalletTransactions
