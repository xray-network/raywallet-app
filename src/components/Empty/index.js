import { React } from 'react'
import style from './style.module.scss'

const Empty = ({ title }) => {
  return <div className={style.empty}>{title}</div>
}

Empty.defaultProps = {
  title: '',
}

export default Empty
