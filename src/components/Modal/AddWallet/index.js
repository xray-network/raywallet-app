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
      title={
        <Tabs
          defaultActiveKey={currentTab}
          className="ray__tabs__card ray__tabs__head"
          type="card"
          onChange={handleTabs}
        >
          <Tabs.TabPane
            tab={
              <span>
                <i className="fe fe-align-center mr-2" />
                Mnemonic
              </span>
            }
            key="1"
          />
          <Tabs.TabPane
            tab={
              <span>
                <i className="fe fe-file-text mr-2" />
                Key File
              </span>
            }
            key="3"
          />
          <Tabs.TabPane
            disabled
            tab={
              <Tooltip title="Soon">
                <span>
                  <i className="fe fe-hard-drive mr-2" />
                  Hardware Wallet
                </span>
              </Tooltip>
            }
            key="2"
          />
        </Tabs>
      }
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={760}
      forceRender
    >
      <div className="px-3 pb-2">
        <div className={currentTab === '1' ? '' : 'd-none'}>
          <MnemonicForm />
        </div>
        <div className={currentTab === '2' ? '' : 'd-none'}>
          <HardwareWallet />
        </div>
        <div className={currentTab === '3' ? '' : 'd-none'}>
          <KeyFile />
        </div>
      </div>
    </Modal>
  )
}

export default AddWalletModal
