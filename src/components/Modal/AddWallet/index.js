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
          <Tabs.TabPane
            tab={(
              <div>
                <i className="fe fe-align-center mr-2" />
                Mnemonic
              </div>
            )}
            key="1"
          />
          <Tabs.TabPane
            disabled
            tab={(
              <Tooltip title="Soon">
                <div>
                  <i className="fe fe-hard-drive mr-2" />
                  Hardware Wallet
                </div>
              </Tooltip>
            )}
            key="2"
          />
          <Tabs.TabPane
            disabled
            tab={(
              <Tooltip title="Soon">
                <div>
                  <i className="fe fe-file-text mr-2" />
                  Key File
                </div>
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
      <div className="px-3 pt-1 pb-2">
        {currentTab === '1' && <MnemonicForm />}
        {currentTab === '2' && <HardwareWallet />}
        {currentTab === '3' && <KeyFile />}
      </div>
    </Modal>
  )
}

export default AddWalletModal
