import React, { useState } from 'react'
import { Modal, Tabs, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import MnemonicForm from './mnemonicPhrase'
import HardwareWallet from './hardwareWallet'
import KeyFile from './keyFile'

const AddWalletModal = () => {
  const dispatch = useDispatch()
  const isModalVisible = useSelector((state) => state.settings.modalAddWallet)
  const [currentTab, setCurrentTab] = useState('1')

  const handleCancel = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalAddWallet',
        value: false,
      },
    })
  }

  const handleTabs = (value) => {
    setCurrentTab(value)
  }

  return (
    <Modal
      title={(
        <Tabs defaultActiveKey={currentTab} className="ray__tabs__card ray__tabs__head" type="card" onChange={handleTabs}>
          <Tabs.TabPane tab="Mnemonic" key="1" />
          <Tabs.TabPane
            disabled
            tab={(
              <Tooltip title="Soon">
                Hardware Wallet
              </Tooltip>
            )}
            key="2"
          />
          <Tabs.TabPane
            disabled
            tab={(
              <Tooltip title="Soon">
                Key File
              </Tooltip>
            )}
            key="3"
          />
        </Tabs>
      )}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={760}
    >
      {currentTab === '1' && <MnemonicForm />}
      {currentTab === '2' && <HardwareWallet />}
      {currentTab === '3' && <KeyFile />}
    </Modal>
  )
}

export default AddWalletModal
