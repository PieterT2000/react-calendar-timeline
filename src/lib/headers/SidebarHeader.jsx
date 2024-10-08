import React from 'react';

import { TimelineHeadersConsumer } from './HeadersContext';
import { LEFT_VARIANT, RIGHT_VARIANT, SECOND_LEFT_VARIANT } from './constants';

class SidebarHeader extends React.PureComponent {
  getRootProps = (props = {}) => {
    const { style } = props;
    const width =
      this.props.variant === RIGHT_VARIANT
        ? this.props.rightSidebarWidth
        : this.props.variant === SECOND_LEFT_VARIANT
        ? this.props.secondLeftSidebarWidth
        : this.props.leftSidebarWidth;
    return {
      style: {
        ...style,
        width,
      },
    };
  };

  getStateAndHelpers = () => {
    return {
      getRootProps: this.getRootProps,
      data: this.props.headerData,
    };
  };

  render() {
    const props = this.getStateAndHelpers();
    const Renderer = this.props.children;
    return <Renderer {...props} />;
  }
}

const SidebarWrapper = ({ children, variant, headerData }) => (
  <TimelineHeadersConsumer>
    {({ leftSidebarWidth, rightSidebarWidth, secondLeftSidebarWidth }) => {
      return (
        <SidebarHeader
          leftSidebarWidth={leftSidebarWidth}
          rightSidebarWidth={rightSidebarWidth}
          secondLeftSidebarWidth={secondLeftSidebarWidth}
          variant={variant}
          headerData={headerData}>
          {children}
        </SidebarHeader>
      );
    }}
  </TimelineHeadersConsumer>
);

SidebarWrapper.defaultProps = {
  variant: LEFT_VARIANT,
  children: ({ getRootProps }) => <div data-testid='sidebarHeader' {...getRootProps()} />,
};

SidebarWrapper.secretKey = 'SidebarHeader';

export default SidebarWrapper;
