import React, { useMemo, useContext } from 'react';

import { noop } from '../utility/generic';
import { TimelineTimeSteps } from 'react-calendar-timeline-v2';

const defaultContextState = {
  registerScroll: () => {
    console.warn('default registerScroll header used');
    return noop();
  },
  rightSidebarWidth: 0,
  leftSidebarWidth: 150,
  secondLeftSidebarWidth: 0,
  timeSteps: {} as TimelineTimeSteps,
};

export const TimelineHeadersContext = React.createContext(defaultContextState);

export function TimelineHeadersProvider({
  children,
  rightSidebarWidth,
  leftSidebarWidth,
  secondLeftSidebarWidth,
  timeSteps,
  registerScroll,
}: {
  children: React.ReactNode;
  rightSidebarWidth?: number;
  leftSidebarWidth?: number;
  secondLeftSidebarWidth?: number;
  timeSteps?: TimelineTimeSteps;
  registerScroll: (element?: HTMLElement) => void;
}) {
  const contextValue = useMemo(
    () => ({
      rightSidebarWidth: rightSidebarWidth ?? defaultContextState.rightSidebarWidth,
      leftSidebarWidth: leftSidebarWidth ?? defaultContextState.leftSidebarWidth,
      secondLeftSidebarWidth: secondLeftSidebarWidth ?? defaultContextState.secondLeftSidebarWidth,
      timeSteps: timeSteps ?? defaultContextState.timeSteps,
      registerScroll,
    }),
    [rightSidebarWidth, leftSidebarWidth, secondLeftSidebarWidth, timeSteps, registerScroll]
  );

  return <TimelineHeadersContext.Provider value={contextValue}>{children}</TimelineHeadersContext.Provider>;
}

export function TimelineHeadersConsumer(props: { children: (context: typeof defaultContextState) => React.ReactNode }) {
  const context = useContext(TimelineHeadersContext);
  return props.children(context);
}
