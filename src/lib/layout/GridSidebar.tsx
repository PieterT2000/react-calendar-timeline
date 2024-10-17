import React, { useCallback } from 'react';
import { GridSidebarGroupRendererProps, TimelineGroupBase } from 'react-calendar-timeline-v3';
import { _get } from '../utility/generic.js';
import { cn } from '../utility/tw.js';
import { useHeadersContext } from '../headers/HeadersContext.js';

function GridSidebar<CustomGroup extends TimelineGroupBase = TimelineGroupBase>({
  height,
  groupHeights,
  groups,
  groupRenderer,
  sidebarRef,
  gridSidebarClassName,
  gridSidebarStyle,
}: {
  height: number;
  groupHeights: number[];
  groups: any[];
  groupRenderer: (props: GridSidebarGroupRendererProps<CustomGroup>) => React.ReactNode;
  sidebarRef?: React.Ref<HTMLDivElement>;
  gridSidebarClassName?: string;
  gridSidebarStyle?: React.CSSProperties;
}) {
  const { gridSidebarHeaderColWidths, gridSidebarWidth } = useHeadersContext();

  const renderGroupContent = useCallback(
    (group: CustomGroup, index: number) =>
      React.createElement(groupRenderer, {
        group,
        height: groupHeights[index],
        gridSidebarHeaderColWidths,
        index,
        key: group.id,
      }),
    [groupRenderer]
  );

  return (
    <div
      ref={sidebarRef}
      style={{ width: `${gridSidebarWidth}px`, height: `${height}px` }}
      className={cn('overflow-hidden whitespace-nowrap inline-block vertical-top relative')}>
      <div className={cn('w-full h-full', gridSidebarClassName)} style={gridSidebarStyle}>
        {groups.map((group, idx) => renderGroupContent(group, idx))}
      </div>
    </div>
  );
}

export default GridSidebar;
