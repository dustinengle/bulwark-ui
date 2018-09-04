import PropTypes from 'prop-types'
import React from 'react'
import {kill, pickRest} from '../lib/utils'
import Icon from './Icon'

// Tab
export const Tab = (props) => {
  const [mods, {children, icon, index, title, ...rest}] = pickRest(props, ['active', 'disabled'])
  return (
    <div block='tab' mods={mods} {...rest}>
      {!!title && <div block='tab' elem='title'>{title}</div>}
      {!!icon && <div block='tab' elem='icon'><Icon k={icon} /></div>}
    </div>
  )
}

Tab.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string
}

// Tabs
export class Tabs extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  state = {
    index: 0,
    left: 0,
    width: 149
  }

  tabs = null

  componentDidMount () {
    if (this.tabs && this.tabs.children) {
      this.tabs.children[0].children[0].click()
    }
  }

  handleSelect = (ev, index) => {
    kill(ev)
    const state = {index}

    if (ev && ev.target) {
      let el = ev.target
      if (!el.classList.contains('tab__icon') && !el.classList.contains('tab__title')) {
        el = el.parentNode
      }
      let rect = el.getBoundingClientRect()
      state.left = rect.left
      state.width = Math.abs(rect.right - rect.left)
    }

    this.setState(state)
  }

  render () {
    const [mods, {children, ...rest}] = pickRest(this.props, [])
    let tabs = children
    if (!Array.isArray(tabs)) tabs = [tabs]

    // Clone tabs and add props
    let content = null
    let hasIcon = false
    tabs = tabs.map((t, i) => {
      if (!hasIcon && !!t.props.icon) hasIcon = true
      if (i === this.state.index) content = t.props.children
      return React.cloneElement(t, {
        active: i === this.state.index,
        key: i,
        onClick: t.props.disabled ? undefined : ev => this.handleSelect(ev, i)
      })
    })

    // Setup bar style
    const barStyle = {
      left: this.state.left,
      top: (hasIcon ? 70 : 50) - 1,
      width: this.state.width
    }

    return (
      <div block='tabs' mods={mods} {...rest}>
        <div block='tabs' elem='list'>
          <span block='tabs_list' elem='items' ref={i => { this.tabs = i }}>
            {tabs}
            <div block='tabs' elem='clear' />
          </span>
        </div>
        <div block='tabs' elem='content'>{content}</div>
        <div block='tabs' elem='bar' style={barStyle} />
      </div>
    )
  }
}

export default {Tab, Tabs}
