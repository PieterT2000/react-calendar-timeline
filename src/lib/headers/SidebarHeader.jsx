import React from 'react';

import { TimelineHeadersConsumer } from './HeadersContext';
import { LEFT_VARIANT, RIGHT_VARIANT, GRID_VARIANT } from './constants';

class SidebarHeader extends React.PureComponent {
  getRootProps = (props = {}) => {
    const { style } = props;
    const width =
      this.props.variant === RIGHT_VARIANT
        ? this.props.rightSidebarWidth
        : this.props.variant === GRID_VARIANT
        ? this.props.gridSidebarWidth
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
      ...(this.props.variant === GRID_VARIANT
        ? { setGridSidebarHeaderColWidths: this.props.setGridSidebarHeaderColWidths }
        : {}),
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
    {({ leftSidebarWidth, rightSidebarWidth, gridSidebarWidth, setGridSidebarHeaderColWidths }) => {
      return (
        <SidebarHeader
          leftSidebarWidth={leftSidebarWidth}
          rightSidebarWidth={rightSidebarWidth}
          gridSidebarWidth={gridSidebarWidth}
          variant={variant}
          headerData={headerData}
          setGridSidebarHeaderColWidths={setGridSidebarHeaderColWidths}>
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
