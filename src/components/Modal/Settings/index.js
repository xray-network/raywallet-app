import React from 'react'
import { Modal } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
// import style from './style.module.scss'

const SettingsModal = () => {
  const dispatch = useDispatch()
  const modalSettings = useSelector((state) => state.settings.modalSettings)
  const walletParams = useSelector((state) => state.wallets.walletParams)

  const handleCancel = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalSettings',
        value: false,
      },
    })
  }

  return (
    <Modal
      title={
        <div>
          <div>Wallet Settings</div>
          <small className="text-muted">{walletParams.accountId}</small>
        </div>
      }
      footer={null}
      visible={modalSettings}
      onCancel={handleCancel}
      width={620}
    >
      [wallet_settings]
    </Modal>
  )
}

export default SettingsModal
