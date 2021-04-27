import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message } from 'antd'
import { AES, enc as EncodeTo } from 'crypto-js'
import { useSelector, useDispatch } from 'react-redux'
// import style from './style.module.scss'

const TransactionModal = () => {
  const dispatch = useDispatch()
  const type = useSelector((state) => state.transactions.type)
  const transaction = useSelector((state) => state.transactions.transaction)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const [password, setPassword] = useState()

  useEffect(() => {
    setPassword('123123123')
  }, [type])

  const handleCancel = () => {
    dispatch({
      type: 'transactions/CHANGE_SETTING',
      payload: {
        setting: 'type',
        value: '',
      },
    })
  }

  const sendTx = () => {
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

  return (
    <Modal
      title="Send Funds"
      footer={null}
      visible={type}
      onCancel={handleCancel}
      width={620}
    >
      {transaction.toAddress}
      <br />
      {transaction.value / 1000000} ADA
      {walletParams.encrypted && (
        <div className="mb-3">
          <Input.Password
            size="large"
            placeholder="Wallet Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}
      <div className="text-center">
        <Button
          onClick={sendTx}
          size="large"
          type="primary"
          className="ray__btn__send w-100"
        >
          <i className="fe fe-send" />
          <strong>Send</strong>
        </Button>
      </div>
    </Modal>
  )
}

export default TransactionModal
