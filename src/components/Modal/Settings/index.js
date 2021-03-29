import React from 'react'
import { Modal, Input, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import style from './style.module.scss'

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

  const setWalletName = (e) => {
    dispatch({
      type: 'wallets/CHANGE_WALLET_NAME',
      payload: {
        name: e.target.value,
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
      <div className="ray__form__label">Wallet Name</div>
      <div className="mb-4">
        <Input value={walletParams.name} onChange={setWalletName} />
      </div>
      <div className="ray__form__label">Danger Zone</div>
      <div className={style.danger}>
        <div className={style.dangerItem}>
          <div>
            <div>
              <strong>Export .key file</strong>
            </div>
            {!walletParams.encrypted && <div>Your wallet should be encrypted for export</div>}
            {walletParams.encrypted && <div>Your wallet is encrypted and ready to be exported</div>}
          </div>
          <div className="ml-auto pl-3">
            <Button disabled={!walletParams.encrypted}>
              <i className="fe fe-download mr-2" />
              Export .key
            </Button>
          </div>
        </div>
        <div className={style.dangerItem}>
          <div>
            <div>
              <strong>Delete wallet</strong>
            </div>
            <div>Delete all wallet data from this device</div>
          </div>
          <div className="ml-auto pl-3">
            <Button>
              <i className="fe fe-trash-2 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SettingsModal
