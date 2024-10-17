import React, { Component } from 'react';

import { _get, arraysEqual } from '../utility/generic';
import { cn } from '../utility/tw';

export default class Sidebar extends Component {
  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.groupHeights, this.props.groupHeights)
    );
  }

  renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey, index) {
    if (this.props.groupRenderer) {
      return React.createElement(this.props.groupRenderer, {
        group,
        isRightSidebar,
        height: this.props.groupHeights[index],
        index,
      });
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey);
    }
  }

  render() {
    const { width, groupHeights, height, isRightSidebar } = this.props;

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = this.props.keys;

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`,
    };

    const groupsStyle = {
      width: `${width}px`,
    };

    const groupLines = this.props.groups.map((group, index) => {
      const elementStyle = {
        height: `${groupHeights[index]}px`,
        lineHeight: `${groupHeights[index]}px`,
      };

      return (
        <div
          key={_get(group, groupIdKey)}
          className={cn(
            'px-1 overflow-hidden whitespace-nowrap overflow-ellipsis m-0 border-b border-borderColor',
            index % 2 === 0 ? 'bg-rowBackgroundEven' : 'bg-rowBackgroundOdd',
            this.props.sidebarGroupClassName
          )}
          style={elementStyle}>
          {this.renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey, index)}
        </div>
      );
    });

    return (
      <div
        ref={this.props.sidebarRef}
        className={cn('overflow-hidden whitespace-nowrap inline-block vertical-top relative')}
        style={sidebarStyle}>
        <div style={groupsStyle}>{groupLines}</div>
      </div>
    );
  }
}
