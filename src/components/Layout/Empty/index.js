import { React } from 'react'

const Empty = ({ title }) => {
  return <div className="ray__empty">{title}</div>
}

Empty.defaultProps = {
  title: '',
}

export default Empty
