import React from 'react';

export const defaultItemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  return (
    <div {...getItemProps(item.itemProps)}>
      {itemContext.useResizeHandle && <div {...leftResizeProps} />}

      <div
        className='sticky left-0 overflow-hidden inline-block rounded-sm px-1.5 h-full'
        style={{ maxHeight: `${itemContext.dimensions.height}` }}>
        {itemContext.title}
      </div>

      {itemContext.useResizeHandle && <div {...rightResizeProps} />}
    </div>
  );
};
