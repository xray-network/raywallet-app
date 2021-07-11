import React, { useState, useEffect } from 'react'
import { Button, Input, message, Alert } from 'antd'
import { AES, enc as EncodeTo } from 'crypto-js'
import { useSelector, useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
// import Address from 'components/Layout/Address'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'

const DeregistrateForm = () => {
  const dispatch = useDispatch()
  const transactionData = useSelector((state) => state.transactions.transactionData)
  const transactionWaiting = useSelector((state) => state.transactions.transactionWaiting)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const transactionType = useSelector((state) => state.transactions.transactionType)
  const [password, setPassword] = useState()

  useEffect(() => {
    setPassword()
    // eslint-disable-next-line
  }, [transactionType])

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
          transaction: transactionData.data,
          privateKey: AES.decrypt(walletParams.privateKey, password).toString(EncodeTo.Utf8),
        },
      })
    } else {
      dispatch({
        type: 'transactions/SEND_TX',
        payload: {
          transaction: transactionData.data,
          privateKey: walletParams.privateKey,
        },
      })
      setPassword()
    }
  }

  const isError = transactionData.error
  const fee = new BigNumber(transactionData.data?.fee)

  return (
    <div>
      {!isError && (
        <div>
          <div className="row">
            <div className="col-12">
              <div className="ray__form__item">
                <div className="ray__form__label">Deregistration Info</div>
                <p>Deregistraton will return 2 ADA from the retired registration certificate.</p>
                <p>
                  You do NOT need to deregister to delegate to a different stake pool. You can
                  change your delegation preference at any time just by delegating to another stake
                  pool.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="ray__form__item">
                <div className="ray__form__label">Deregistration Fee</div>
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
          <Alert
            message="Not ehough ADA"
            description="Should cover transaction fee"
            type="info"
            showIcon
            className=""
          />
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

export default DeregistrateForm
