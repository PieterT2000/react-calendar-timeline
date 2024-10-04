import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  CustomHeader,
  CustomHeaderPropsChildrenFnProps,
  DateHeader,
  ReactCalendarTimelineProps,
  Timeline,
  TimelineMarkers,
  TodayMarker,
} from 'react-calendar-timeline-v2';
import { cn } from '../utils.js';
import './../index.css';
import { TimelineHeaders } from 'react-calendar-timeline-v2';
import { SidebarHeader } from 'react-calendar-timeline-v2';
import { dummyYearlyTotals } from '../data.js';
import throttle from 'lodash.throttle';

const dummyYearlTotalsMap = dummyYearlyTotals.reduce((acc, curr) => {
  acc.set(curr.year, curr);
  return acc;
}, new Map<number, (typeof dummyYearlyTotals)[number]>());

export const column_defs = [
  { id: 'cost', label: 'Cost' },
  { id: 'kWh_m2_saving', label: 'kWh/m2 saving' },
  { id: 'kWh_saving', label: 'kWh saving' },
];

const groups = [
  { id: 1, label: 'Lighting Controls', color: '#C47CC5' },
  { id: 2, label: 'Low Energy Lighting', color: '#9AD0C4' },
  { id: 3, label: 'Airtightness', color: '#7BA8C6' },
  { id: 4, label: 'Window Replacement', color: '#E9C058' },
  { id: 5, label: 'Roof Insulation', color: '#E9C058' },
  { id: 6, label: 'Window Insulation', color: '#EBA17F' },
];

const defaultItems = [
  {
    id: '1',
    group: 1,
    label: 'Lighting Controls',
    start_time: new Date().valueOf(),
    end_time: new Date(new Date().setMonth(new Date().getMonth() + 3)).valueOf(),
    color: '#C47CC5',
    column_data: {
      cost: { value: '£11,715', raw: 11715 },
      kWh_m2_saving: { value: '-72.84', raw: -72.84 },
      kWh_saving: { value: '-21,333', raw: -21333 },
    },
  },
  {
    id: '2',
    group: 2,
    label: 'Low Energy Lighting',
    start_time: new Date().valueOf(),
    end_time: new Date(new Date().setMonth(new Date().getMonth() + 4)).valueOf(),
    color: '#9AD0C4',
    column_data: {
      cost: { value: '£1,025', raw: 1025 },
      kWh_m2_saving: { value: '-3.78', raw: -3.78 },
      kWh_saving: { value: '-1,108', raw: -1108 },
    },
  },
  {
    id: '3',
    group: 3,
    label: 'Airtightness',
    start_time: new Date().valueOf(),
    end_time: new Date(new Date().setMonth(new Date().getMonth() + 5)).valueOf(),
    color: '#7BA8C6',
    column_data: {
      cost: { value: '£879', raw: 879 },
      kWh_m2_saving: { value: '-17.97', raw: -17.97 },
      kWh_saving: { value: '-5,264', raw: -5264 },
    },
  },
  {
    id: '4',
    group: 4,
    label: 'Window Replacement',
    start_time: new Date().valueOf(),
    end_time: new Date(new Date().setMonth(new Date().getMonth() + 3)).valueOf(),
    color: '#E9C058',
    column_data: {
      cost: { value: '£10,251', raw: 10251 },
      kWh_m2_saving: { value: '-26.80', raw: -26.8 },
      kWh_saving: { value: '-7,850', raw: -7850 },
    },
  },
  {
    id: '5',
    group: 5,
    label: 'Roof Insulation',
    start_time: new Date().valueOf(),
    end_time: new Date(new Date().setMonth(new Date().getMonth() + 4)).valueOf(),
    color: '#EBA17F',
    column_data: {
      cost: { value: '£1,757', raw: 1757 },
      kWh_m2_saving: { value: '-22.70', raw: -22.7 },
      kWh_saving: { value: '-6,649', raw: -6649 },
    },
  },
  {
    id: '6',
    group: 6,
    label: 'Window Insulation',
    start_time: new Date().valueOf(),
    end_time: new Date(new Date().setMonth(new Date().getMonth() + 5)).valueOf(),
    color: '#EBA17F',
    column_data: {
      cost: { value: '£30,752', raw: 30752 },
      kWh_m2_saving: { value: '-23.33', raw: -23.33 },
      kWh_saving: { value: '-6,834', raw: -6834 },
    },
  },
];

type TimelineRenderProps = ReactCalendarTimelineProps<(typeof defaultItems)[number], (typeof groups)[number]>;

const today = new Date();
const TIME_CONSTANTS = {
  minTime: new Date('2024-01-01').valueOf(),
  maxTime: new Date('2050-12-31').valueOf(),
  defaultTimeStart: new Date(today.getFullYear(), 0, 1),
  defaultTimeEnd: new Date(today.getFullYear() + 3, 0, 1),
};

const resizeHandlerClasses = 'absolute h-full top-0 bottom-0 z-[99]';

const itemRenderer: TimelineRenderProps['itemRenderer'] = ({
  item,
  timelineContext,
  itemContext,
  getItemProps,
  getResizeProps,
}) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  const backgroundColor = itemContext.selected
    ? itemContext.dragging
      ? 'bg-red-500'
      : 'bg-[#FF5F49]'
    : `bg-[${item.color}]`;

  return (
    <div
      {...getItemProps({
        className: cn(
          'bg-[#9AD0C4] text-white text-sm rounded-[4px] px-4 transition-colors border-0',
          backgroundColor,
          {
            'cursor-move': itemContext.selected || itemContext.dragging,
          }
        ),
      })}>
      {itemContext.useResizeHandle ? (
        <div
          {...leftResizeProps}
          className={cn(resizeHandlerClasses, 'left-0 w-4', {
            'hover:cursor-w-resize': itemContext.selected,
          })}
        />
      ) : null}
      <div
        className='overflow-hidden whitespace-nowrap overflow-ellipsis'
        style={{
          height: itemContext.dimensions.height,
        }}>
        {item.label}
      </div>
      {itemContext.useResizeHandle ? (
        <div
          {...rightResizeProps}
          className={cn(resizeHandlerClasses, 'right-0 w-4', {
            'hover:cursor-e-resize': itemContext.selected,
          })}
        />
      ) : null}
    </div>
  );
};

const groupRenderer: TimelineRenderProps['groupRenderer'] = ({ group }) => {
  return (
    <div className='text-base text-secondary px-4 h-full flex items-center justify-start space-x-2'>
      <span className='w-4 h-4' style={{ backgroundColor: group.color }} />
      <span>{group.label}</span>
    </div>
  );
};

const dateHeaderFormatTable = {
  month: {
    long: 'MMMM',
    mediumLong: 'MMM',
    medium: 'MM',
    short: 'M',
  },
};

const BORDER_COLOR = 'border-secondary-violet-50';

export default function App() {
  const [maxZoom, setMaxZoom] = useState(6 * 365.24 * 86400 * 1000); // 6 years
  const { items, resizeItem, moveItem } = useItems();
  const timelineRef = useRef<Timeline>(null);
  // TODO: if monthly cells should not be shown, remove this.
  const [monthlyCellsVisible, setMonthlyCellsVisible] = useState(false);

  const originalHeaderHeight = useRef<number>(0);

  const headerRootRefCb = useCallback((element: HTMLDivElement) => {
    if (element) {
      originalHeaderHeight.current = element.getBoundingClientRect().height;
    }
  }, []);

  const handleTimeChange: TimelineRenderProps['onTimeChange'] = (
    visibleTimeStart,
    visibleTimeEnd,
    updateScrollCanvas
  ) => {
    const { minTime, maxTime } = TIME_CONSTANTS;
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  const handleCanvasResize = useCallback<NonNullable<TimelineRenderProps['onCanvasResize']>>(({ visibleWidth }) => {
    // Each column is a 200px wide year column
    const maxColumns = visibleWidth / 200;
    const newMaxZoom = Math.floor(Math.max(maxColumns, 1) * 365.24 * 86400 * 1000);
    setMaxZoom(newMaxZoom);
  }, []);

  useLayoutEffect(() => {
    if (!maxZoom) return;
    // TODO: remove below hack!
    // HACK: updateScrollCanvas is a method on the Timeline class
    // Somehow the items are not being rendered correctly without this timeout
    setTimeout(() => {
      // @ts-ignore
      timelineRef.current?.updateScrollCanvas(
        TIME_CONSTANTS.defaultTimeStart.valueOf(),
        TIME_CONSTANTS.defaultTimeStart.valueOf() + maxZoom
      );
    });
  }, [maxZoom]);

  const debouncedHandleCanvasResize = useCallback(throttle(handleCanvasResize, 100), [handleCanvasResize]);

  const secondSidebarColumnRenderer: TimelineRenderProps['secondLeftSidebarGroupRenderer'] = ({ group }) => {
    // Find item that belongs to this group
    // assuming there is only one item per group
    const item = items.find((item) => item.group === group.id);
    if (!item) return null;
    // render item column data as grid
    return (
      <div
        className='text-right grid h-full'
        style={{ gridTemplateColumns: `repeat(${column_defs.length}, minmax(min-content, 1fr))` }}>
        {column_defs.map((column) => (
          <div key={column.id} className='text-base text-secondary px-2 flex items-center justify-end'>
            {item.column_data[column.id as keyof typeof item.column_data].value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='w-full'>
      {/* <h1 className='text-4xl justify-center flex'>Custom Timeline</h1> */}
      <div className='w-full'>
        <Timeline
          ref={timelineRef}
          groups={groups}
          items={items}
          lineHeight={54}
          sidebarWidth={220}
          secondLeftSidebarWidth={400}
          canMove
          canResize='both'
          useResizeHandle
          itemHeightRatio={0.75}
          defaultTimeStart={TIME_CONSTANTS.defaultTimeStart}
          defaultTimeEnd={TIME_CONSTANTS.defaultTimeEnd}
          // If minZoom is changed, labelFormat in the second DateHeader should be updated
          minZoom={365.24 * 86400 * 1000} // 1 year
          // Maxzoom depends on the width of the canvas since the first header column has a min width of 200px
          maxZoom={maxZoom}
          onTimeChange={handleTimeChange}
          onItemMove={moveItem}
          onItemResize={resizeItem}
          onCanvasResize={debouncedHandleCanvasResize}
          onUnitChange={(unit) => setMonthlyCellsVisible(unit === 'month')}
          itemRenderer={itemRenderer}
          groupRenderer={groupRenderer}
          secondLeftSidebarGroupRenderer={secondSidebarColumnRenderer}
          canChangeGroup={false}
          minCellWidth={20}
          verticalLineClassNamesForTime={(start, end) => {
            const startYear = new Date(start).getFullYear();
            // Every second line should be a different color
            const isEven = startYear % 2 === 0;
            return [
              'border-0',
              isEven ? 'bg-secondary-violet-25 border-r' : 'bg-secondary-violet-50 border-l',
              BORDER_COLOR,
              'border-0',
            ];
          }}
          horizontalLineClassNamesForGroup={() => ['border-b-0 px-0']}
          sidebarGroupClassName={cn('px-0 border-0 border-r', BORDER_COLOR, 'bg-transparent')}>
          <TimelineMarkers>
            {/* TODO: style this marker in a better way */}
            <TodayMarker date={today}>
              {({ styles, date }) => {
                const customStyles = {
                  left: styles.left,
                  top: styles.top,
                  bottom: styles.bottom,
                };
                return <div style={customStyles} className='bg-accent pointer-events-none absolute w-0.5' />;
              }}
            </TodayMarker>
          </TimelineMarkers>
          <TimelineHeaders
            className={cn('bg-transparent', BORDER_COLOR)}
            calendarHeaderClassName='border-0'
            headerRef={headerRootRefCb}>
            <SidebarHeader>
              {({ getRootProps }) => (
                <div
                  {...getRootProps({
                    style: {
                      height: `${originalHeaderHeight.current + (monthlyCellsVisible ? 36 : 0)}px`,
                    },
                  })}
                  className={cn('border-r', BORDER_COLOR, 'flex flex-col justify-end grow')}>
                  <div className='space-y-3 px-4 py-2'>
                    <div className='text-sm font-medium text-secondary'>Summary</div>
                    <div className='flex flex-col gap-y-2'>
                      {dummyYearlyTotals[0].attributes.map((attribute) => (
                        <div key={attribute.id} className='text-sm flex justify-between'>
                          <div className='text-xs text-secondary-violet-300'>{attribute.label}</div>
                          <div className='text-xs text-secondary-violet-500'>{attribute.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={cn('text-sm font-medium text-secondary-violet-400 h-9 flex items-center px-4', {
                      'mt-9': monthlyCellsVisible,
                    })}>
                    Initiatives
                  </div>
                </div>
              )}
            </SidebarHeader>
            <SidebarHeader variant='secondLeft'>
              {({ getRootProps }) => (
                <div
                  {...getRootProps({
                    style: {
                      height: `${originalHeaderHeight.current + (monthlyCellsVisible ? 36 : 0)}px`,
                    },
                  })}
                  className='border-r flex flex-col justify-end grow'>
                  <div
                    className={cn('px-2 text-xs font-medium text-secondary-violet-400 h-9 grid items-center', {
                      'mt-9': monthlyCellsVisible,
                    })}
                    style={{
                      gridTemplateColumns: `repeat(${column_defs.length}, minmax(min-content, 1fr))`,
                    }}>
                    {column_defs.map((column) => (
                      <div key={column.id} className='text-right'>
                        {column.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SidebarHeader>
            <CustomHeader height={124} unit='year'>
              {(props: CustomHeaderPropsChildrenFnProps<undefined> | undefined) => {
                if (!props) return null;
                const { headerContext, getRootProps, getIntervalProps, showPeriod } = props;
                const { intervals } = headerContext;
                return (
                  <div {...getRootProps()} className='relative'>
                    {intervals.map((interval) => {
                      const yearData = dummyYearlTotalsMap.get(interval.startTime.year());
                      if (!yearData) return <div key={interval.startTime.valueOf()} className='absolute' />;
                      return (
                        <div
                          {...getIntervalProps({
                            interval,
                            onClick: () => {
                              showPeriod(interval.startTime, interval.endTime);
                            },
                          })}
                          className={cn('absolute px-3 py-2 h-full border-l', BORDER_COLOR)}>
                          <div className='flex flex-col h-full justify-end max-w-[200px] gap-y-2'>
                            {yearData.attributes.map((attribute) => (
                              <div key={attribute.id} className='text-sm flex justify-between'>
                                <div className='text-xs text-secondary-violet-300'>{attribute.label}</div>
                                <div className='text-xs text-secondary-violet-500'>{attribute.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            </CustomHeader>
            <DateHeader
              unit='primaryHeader'
              className='relative'
              height={36}
              intervalRenderer={({ intervalContext, getIntervalProps }) => {
                return (
                  <div
                    {...getIntervalProps({})}
                    className={cn('absolute px-4 py-2 text-sm text-secondary border-l', BORDER_COLOR)}>
                    {intervalContext.intervalText}
                  </div>
                );
              }}
            />
            {monthlyCellsVisible && (
              <DateHeader
                height={36}
                className='relative'
                labelFormat={([startTime, endTime], unit, labelWidth) => {
                  // Since this is only rendered for month, we don't need to fill the dateHeaderFormatTable with other units
                  if (!['month'].includes(unit)) return '';
                  let format;
                  unit = unit as 'month';
                  if (labelWidth >= 75) {
                    format = dateHeaderFormatTable[unit]['long'];
                  } else if (labelWidth >= 32) {
                    format = dateHeaderFormatTable[unit]['mediumLong'];
                  } else {
                    format = dateHeaderFormatTable[unit]['short'];
                  }
                  return startTime.format(format);
                }}
                intervalRenderer={({ intervalContext, getIntervalProps }) => {
                  return (
                    <div
                      {...getIntervalProps({})}
                      className={cn(
                        'absolute text-sm text-secondary border-l',
                        BORDER_COLOR,
                        'h-full flex justify-center items-center'
                      )}>
                      {intervalContext.intervalText}
                    </div>
                  );
                }}
              />
            )}
          </TimelineHeaders>
        </Timeline>
      </div>
    </div>
  );
}

function useItems() {
  const [items, setItems] = useState(defaultItems);

  const resizeItem = (itemId: number, time: number, edge: 'left' | 'right') => {
    setItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, [edge === 'left' ? 'start_time' : 'end_time']: time } : item
      )
    );
  };

  const moveItem = (itemId: number, newStartTime: number) => {
    setItems((items) =>
      items.map((item) => {
        const startTimeDelta = newStartTime - item.start_time;
        return item.id === itemId
          ? { ...item, start_time: newStartTime, end_time: item.end_time + startTimeDelta }
          : item;
      })
    );
  };
  return { items, resizeItem, moveItem };
}
