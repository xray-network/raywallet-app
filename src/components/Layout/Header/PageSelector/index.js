import React from 'react'
import { Dropdown, Checkbox } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import style from './style.module.scss'

export default () => {
  const dispatch = useDispatch()
  const sections = useSelector((state) => state.settings.sections)

  const updateList = (values) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'sections',
        value: values,
      },
    })
  }

  const menu = (
    <React.Fragment>
      <div className="card ray__shadow mb-0 px-3 py-3">
        <Checkbox.Group value={sections} onChange={updateList}>
          <div className="mb-1">
            <Checkbox value="wallet" disabled>
              Wallet
            </Checkbox>
          </div>
          <div className="mb-1">
            <Checkbox value="stake" disabled>
              Stake
            </Checkbox>
          </div>
          <div className="mb-1">
            <Checkbox value="rewards">Rewards</Checkbox>
          </div>
          <div className="mb-1">
            <Checkbox value="swap">Swap</Checkbox>
          </div>
          <div className="mb-1">
            <Checkbox value="kickstart">KickStart</Checkbox>
          </div>
          <div>
            <Checkbox value="nft">NFT</Checkbox>
          </div>
        </Checkbox.Group>
      </div>
    </React.Fragment>
  )

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
      <span className={style.button}>
        <i className="fe fe-plus" />
      </span>
    </Dropdown>
  )
}
