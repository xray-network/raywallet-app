import React from 'react'
import { Menu, Dropdown, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import style from './style.module.scss'

import FlagEn from './flags/en.svg'
import FlagRu from './flags/ru.svg'
import FlagZh from './flags/zh.svg'
import FlagJp from './flags/jp.svg'
import FlagKr from './flags/kr.svg'

export default () => {
  const theme = useSelector((state) => state.settings.theme)
  const isLight = theme === 'default'

  // const locale = 'en-US'
  // const language = locale.substr(0, 2)

  const mapFlags = {
    en: FlagEn,
    jp: FlagJp,
    zh: FlagZh,
    ru: FlagRu,
    kr: FlagKr,
  }

  const menu = (
    <Menu>
      <Menu.Item key="en-US">
        <span className={style.menuIcon}>
          <img src={mapFlags.en} alt="English" />
        </span>
        English
      </Menu.Item>
      <Menu.Item key="jp-JP" disabled>
        <span className={style.menuIcon}>
          <img src={mapFlags.jp} alt="French" />
        </span>
        日本語
      </Menu.Item>
      <Menu.Item key="zh-CN" disabled>
        <span className={style.menuIcon}>
          <img src={mapFlags.zh} alt="简体中文" />
        </span>
        简体中文
      </Menu.Item>
      <Menu.Item key="kr-KR" disabled>
        <span className={style.menuIcon}>
          <img src={mapFlags.kr} alt="한국어" />
        </span>
        한국어
      </Menu.Item>
      <Menu.Item key="ru-RU" disabled>
        <span className={style.menuIcon}>
          <img src={mapFlags.ru} alt="Русский" />
        </span>
        Русский
      </Menu.Item>
    </Menu>
  )

  return (
    <div className={style.switcher}>
      <Tooltip title="Toggle theme" placement="left">
        <a role="button" tabIndex="0" className={style.mode}>
          {isLight && <i className="fe fe-sun" />}
          {!isLight && <i className="fe fe-moon" />}
        </a>
      </Tooltip>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <span className={`${style.dropdown}`}>
          <Tooltip title="Change language" placement="left">
            <span className={style.flag}>
              <i className="fe fe-globe" />
            </span>
          </Tooltip>
        </span>
      </Dropdown>
    </div>
  )
}
