import React, { Component } from 'react';

import PreventClickOnDrag from '../interaction/PreventClickOnDrag';
import { cn } from '../utility/tw';

class GroupRow extends Component {
  render() {
    const {
      onContextMenu,
      onDoubleClick,
      isEvenRow,
      style,
      onClick,
      clickTolerance,
      horizontalLineClassNamesForGroup,
      group,
    } = this.props;

    const classNamesForGroup = horizontalLineClassNamesForGroup?.(group);

    const className = cn(
      'border-b border-borderColor z-[40]',
      {
        'bg-rowBackgroundEven': isEvenRow,
        'bg-rowBackgroundOdd': !isEvenRow,
      },
      classNamesForGroup
    );

    return (
      <PreventClickOnDrag clickTolerance={clickTolerance} onClick={onClick}>
        <div onContextMenu={onContextMenu} onDoubleClick={onDoubleClick} className={className} style={style} />
      </PreventClickOnDrag>
    );
  }
}

export default GroupRow;
