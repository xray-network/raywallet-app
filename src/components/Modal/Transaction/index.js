import React from 'react'
import { Modal } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import SendForm from './Forms/send'
import DelegateForm from './Forms/delegate'
import WaitingForm from './Forms/waiting'
import WithdrawForm from './Forms/withdraw'
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

  const getFormName = (type) => {
    const names = {
      send: 'Send Assets',
      delegate: 'Pool Delegation',
    }

    return names[type]
  }

  return (
    <Modal
      title={getFormName(transactionType)}
      footer={null}
      visible={transactionType !== 'calculate' && transactionType !== ''}
      onCancel={handleCancel}
      width={420}
      closable={!(transactionWaitingHash && !transactionSuccess)}
      maskClosable={!(transactionWaitingHash && !transactionSuccess)}
      keyboard={!(transactionWaitingHash && !transactionSuccess)}
    >
      {transactionWaitingHash && <WaitingForm handleCancel={handleCancel} />}
      {!transactionWaitingHash && transactionType === 'send' && <SendForm />}
      {!transactionWaitingHash && transactionType === 'delegate' && <DelegateForm />}
      {!transactionWaitingHash && transactionType === 'withdraw' && <WithdrawForm />}
    </Modal>
  )
}

export default TransactionModal
