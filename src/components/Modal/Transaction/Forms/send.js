import React, { useState } from 'react'
import { Button, Input, message } from 'antd'
import { AES, enc as EncodeTo } from 'crypto-js'
import { useSelector, useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import Address from 'components/Layout/Address'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'

const SendForm = () => {
  const dispatch = useDispatch()
  const transaction = useSelector((state) => state.transactions.transaction)
  const transactionWaiting = useSelector((state) => state.transactions.transactionWaiting)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const [password, setPassword] = useState()

  const sendTx = () => {
    if (password === '') {
      message.error('Enter your wallet password')
      return
    }
    if (walletParams.encrypted) {
      try {
        const pass = AES.decrypt(walletParams.password, password).toString(EncodeTo.Utf8)
        if (pass !== password) {
          message.error('Wrong password')
        }
      } catch {
        message.error('Wrong password')
        return
      }
      if (AES.decrypt(walletParams.password, password).toString(EncodeTo.Utf8) !== password) {
        return
      }
      dispatch({
        type: 'transactions/SEND_TX',
        payload: {
          transaction,
          privateKey: AES.decrypt(walletParams.privateKey, password).toString(EncodeTo.Utf8),
        },
      })
    } else {
      dispatch({
        type: 'transactions/SEND_TX',
        payload: {
          transaction,
          privateKey: walletParams.privateKey,
        },
      })
    }
  }

  const amount = new BigNumber(transaction.value)
  const fee = new BigNumber(transaction.fee)
  const total = amount.plus(fee)

  return (
    <div>
      <div className="ray__form__item mb-4">
        <div className="ray__form__label">To Address</div>
        <div className="ray__form__amount">
          <Address address={transaction.toAddress} />
        </div>
      </div>
      <div className="ray__form__item">
        <div className="ray__form__label">Send Amount</div>
        <div className="ray__item ray__item--tinted text-center mb-4">
          <div className="ray__form__amount d-inline-block ml-auto mr-auto">
            <AmountFormatterAda amount={amount} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="ray__form__item">
            <div className="ray__form__label">Total</div>
            <div className="ray__form__amount">
              <AmountFormatterAda amount={total} small />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="ray__form__item">
            <div className="ray__form__label">Fee</div>
            <div className="ray__form__amount">
              <AmountFormatterAda amount={fee} small />
            </div>
          </div>
        </div>
      </div>
      <div className="ray__line" />
      {walletParams.encrypted && (
        <div className="ray__form__item mb-4">
          <div className="ray__form__label">Wallet Password</div>
          <div className="text-center">
            <div className="ray__form__amount">
              <Input.Password
                size="large"
                placeholder="Wallet Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="text-center">
        <Button
          onClick={sendTx}
          size="large"
          type="primary"
          className="ray__btn__send w-100"
          disabled={transactionWaiting}
        >
          <i className="fe fe-send" />
          <strong>Send</strong>
        </Button>
      </div>
    </div>
  )
}

export default SendForm
