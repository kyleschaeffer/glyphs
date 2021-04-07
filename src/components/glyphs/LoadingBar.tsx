import classNames from 'classnames/bind'
import React from 'react'
import { useContext } from 'react'

import { GlyphsContext } from '../controllers/GlyphsController'
import style from './LoadingBar.module.scss'

const cx = classNames.bind(style)

export const LoadingBar: React.FC = () => {
  const { progress } = useContext(GlyphsContext)

  return <progress className={cx('bar')} value={progress} max={1} />
}
