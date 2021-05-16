import React, { useState } from 'react'
import { Button, Input, message, Alert } from 'antd'
import { AES, enc as EncodeTo } from 'crypto-js'
import { useSelector, useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
// import Address from 'components/Layout/Address'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'

const DelegateForm = () => {
  const dispatch = useDispatch()
  const transaction = useSelector((state) => state.transactions.transaction)
  const transactionWaiting = useSelector((state) => state.transactions.transactionWaiting)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const hasStakingKey = useSelector((state) => state.wallets.walletStake.hasStakingKey)
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

  const fee = hasStakingKey
    ? new BigNumber(transaction.fee)
    : new BigNumber(transaction.fee).plus(2000000)
  const isError = transaction instanceof Error

  return (
    <div>
      {!isError && (
        <div>
          <div className="row">
            <div className="col-12">
              <div className="ray__form__item">
                <div className="ray__form__label">
                  Delegation Fee
                  {!hasStakingKey && ' + Key Deposit'}
                </div>
                <div className="ray__item ray__item--tinted text-center mb-4">
                  <div className="ray__form__amount d-inline-block ml-auto mr-auto">
                    <AmountFormatterAda amount={fee} />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        </div>
      )}
      {isError && (
        <div className="mb-4">
          {hasStakingKey && (
            <Alert
              message="Not ehough ADA"
              description="Should cover transaction fee"
              type="info"
              showIcon
              className=""
            />
          )}
          {!hasStakingKey && (
            <Alert
              message="Not ehough ADA"
              description="Should cover transaction fee fee plus 2 ADA for staking key deposit"
              type="info"
              showIcon
            />
          )}
        </div>
      )}
      <div className="text-center">
        <Button
          onClick={sendTx}
          size="large"
          type="primary"
          className="ray__btn__send w-100"
          disabled={transactionWaiting || isError}
        >
          <i className="fe fe-send" />
          <strong>Send</strong>
        </Button>
      </div>
    </div>
  )
}

export default DelegateForm
