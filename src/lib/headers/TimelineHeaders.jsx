import React from 'react';

import { TimelineHeadersConsumer } from './HeadersContext';
import SidebarHeader from './SidebarHeader';
import { RIGHT_VARIANT, SECOND_LEFT_VARIANT } from './constants';
import { cn } from '../utility/tw';

class TimelineHeaders extends React.Component {
  constructor(props) {
    super(props);
  }

  getRootStyle = () => {
    return {
      ...this.props.style,
      display: 'flex',
      width: '100%',
    };
  };

  getCalendarHeaderStyle = () => {
    const { leftSidebarWidth, rightSidebarWidth, secondLeftSidebarWidth, calendarHeaderStyle } = this.props;
    return {
      ...calendarHeaderStyle,
      width: `calc(100% - ${leftSidebarWidth + rightSidebarWidth + secondLeftSidebarWidth}px)`,
    };
  };

  handleRootRef = (element) => {
    if (this.props.headerRef) {
      this.props.headerRef(element);
    }
  };

  /**
   * check if child of type SidebarHeader
   * refer to for explanation https://github.com/gaearon/react-hot-loader#checking-element-types
   */
  isSidebarHeader = (child) => {
    if (child.type === undefined) return false;
    return child.type.secretKey === SidebarHeader.secretKey;
  };

  render() {
    let rightSidebarHeader;
    let leftSidebarHeader;
    let secondLeftSidebarHeader;
    const calendarHeaders = [];
    const children = Array.isArray(this.props.children) ? this.props.children.filter((c) => c) : [this.props.children];
    React.Children.forEach(children, (child) => {
      if (this.isSidebarHeader(child)) {
        if (child.props.variant === RIGHT_VARIANT) {
          rightSidebarHeader = child;
        } else if (child.props.variant === SECOND_LEFT_VARIANT) {
          secondLeftSidebarHeader = child;
        } else {
          leftSidebarHeader = child;
        }
      } else {
        calendarHeaders.push(child);
      }
    });
    if (!leftSidebarHeader) {
      leftSidebarHeader = <SidebarHeader />;
    }
    if (!rightSidebarHeader && this.props.rightSidebarWidth) {
      rightSidebarHeader = <SidebarHeader variant={RIGHT_VARIANT} />;
    }

    if (!secondLeftSidebarHeader && this.props.secondLeftSidebarWidth) {
      secondLeftSidebarHeader = <SidebarHeader variant={SECOND_LEFT_VARIANT} />;
    }
    return (
      <div
        ref={this.handleRootRef}
        data-testid='headerRootDiv'
        style={this.getRootStyle()}
        className={cn('bg-sidebarBackgroundColor border-b border-borderColor', this.props.className)}>
        {leftSidebarHeader}
        {secondLeftSidebarHeader}
        <div
          ref={this.props.registerScroll}
          style={this.getCalendarHeaderStyle()}
          className={cn('border border-borderColor overflow-hidden', this.props.calendarHeaderClassName)}
          data-testid='headerContainer'>
          {calendarHeaders}
        </div>
        {rightSidebarHeader}
      </div>
    );
  }
}

const TimelineHeadersWrapper = ({
  children,
  style,
  className,
  calendarHeaderStyle,
  calendarHeaderClassName,
  headerRef,
}) => (
  <TimelineHeadersConsumer>
    {({ leftSidebarWidth, rightSidebarWidth, secondLeftSidebarWidth, registerScroll }) => {
      return (
        <TimelineHeaders
          leftSidebarWidth={leftSidebarWidth}
          rightSidebarWidth={rightSidebarWidth}
          secondLeftSidebarWidth={secondLeftSidebarWidth}
          registerScroll={registerScroll}
          style={style}
          className={className}
          calendarHeaderStyle={calendarHeaderStyle}
          calendarHeaderClassName={calendarHeaderClassName}
          headerRef={headerRef}>
          {children}
        </TimelineHeaders>
      );
    }}
  </TimelineHeadersConsumer>
);

TimelineHeadersWrapper.secretKey = 'TimelineHeaders';

export default TimelineHeadersWrapper;
