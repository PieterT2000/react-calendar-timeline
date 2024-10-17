import React, { useMemo, useContext, useState } from 'react';

import { noop } from '../utility/generic';
import { TimelineTimeSteps } from 'react-calendar-timeline-v3';

const defaultContextState = {
  registerScroll: () => {
    console.warn('default registerScroll header used');
    return noop();
  },
  rightSidebarWidth: 0,
  leftSidebarWidth: 150,
  gridSidebarWidth: 0,
  gridSidebarHeaderColWidths: [] as number[],
  timeSteps: {} as TimelineTimeSteps,
  setGridSidebarHeaderColWidths: noop as React.Dispatch<React.SetStateAction<number[]>>,
};

export const TimelineHeadersContext = React.createContext(defaultContextState);

export function TimelineHeadersProvider({
  children,
  rightSidebarWidth,
  leftSidebarWidth,
  gridSidebarWidth,
  timeSteps,
  registerScroll,
}: {
  children: React.ReactNode;
  rightSidebarWidth?: number;
  leftSidebarWidth?: number;
  gridSidebarWidth?: number;
  timeSteps?: TimelineTimeSteps;
  registerScroll: (element?: HTMLElement) => void;
}) {
  const [gridSidebarHeaderColWidths, setGridSidebarHeaderColWidths] = useState<number[]>([]);
  const contextValue = useMemo(
    () => ({
      rightSidebarWidth: rightSidebarWidth ?? defaultContextState.rightSidebarWidth,
      leftSidebarWidth: leftSidebarWidth ?? defaultContextState.leftSidebarWidth,
      gridSidebarWidth: gridSidebarWidth ?? defaultContextState.gridSidebarWidth,
      gridSidebarHeaderColWidths,
      timeSteps: timeSteps ?? defaultContextState.timeSteps,
      registerScroll,
      setGridSidebarHeaderColWidths,
    }),
    [rightSidebarWidth, leftSidebarWidth, gridSidebarWidth, timeSteps, registerScroll, gridSidebarHeaderColWidths]
  );

  return <TimelineHeadersContext.Provider value={contextValue}>{children}</TimelineHeadersContext.Provider>;
}

export const useHeadersContext = () => useContext(TimelineHeadersContext);

export function TimelineHeadersConsumer(props: { children: (context: typeof defaultContextState) => React.ReactNode }) {
  const context = useHeadersContext();
  return props.children(context);
}
