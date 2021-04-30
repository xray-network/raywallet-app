import React from 'react'
import { Modal } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import SendForm from './Forms/send'
import WaitingForm from './Forms/waiting'
// import style from './style.module.scss'

const TransactionModal = () => {
  const dispatch = useDispatch()
  const transactionType = useSelector((state) => state.transactions.transactionType)
  const transactionWaitingHash = useSelector((state) => state.transactions.transactionWaitingHash)
  const transactionSuccess = useSelector((state) => state.transactions.transactionSuccess)

  const handleCancel = () => {
    if (transactionSuccess) {
      dispatch({
        type: 'transactions/CLEAR_TX',
      })
    }
    dispatch({
      type: 'transactions/SET_STATE',
      payload: {
        transactionType: '',
        transactionWaitingHash: '',
        transactionSuccess: false,
      },
    })
  }

  return (
    <Modal
      title="Send Assets"
      footer={null}
      visible={transactionType}
      onCancel={handleCancel}
      width={420}
      closable={!(transactionWaitingHash && !transactionSuccess)}
      maskClosable={!(transactionWaitingHash && !transactionSuccess)}
    >
      {transactionWaitingHash && <WaitingForm />}
      {!transactionWaitingHash && (
        <div>
          <SendForm />
        </div>
      )}
    </Modal>
  )
}

export default TransactionModal
