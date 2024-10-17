import { Dayjs } from 'dayjs';
import ReactCalendarTimeline, {
  TimelineItemBase,
  TimelineGroupBase,
  ReactCalendarItemRendererProps,
  Id,
} from 'react-calendar-timeline';

declare module 'react-calendar-timeline-v3' {
  export * from 'react-calendar-timeline';
  export { ReactCalendarTimeline as Timeline };

  export interface ReactCalendarGroupRendererProps<CustomGroup extends TimelineGroupBase = TimelineGroupBase> {
    group: CustomGroup;
    index: number;
    height: number;
    isRightSidebar?: boolean | undefined;
  }

  export interface GridSidebarGroupRendererProps<CustomGroup extends TimelineGroupBase = TimelineGroupBase>
    extends Omit<ReactCalendarGroupRendererProps<CustomGroup>, 'isRightSidebar'> {
    gridSidebarHeaderColWidths: number[];
  }

  export interface TimeFormat {
    long: string;
    mediumLong: string;
    medium: string;
    short: string;
  }

  export interface LabelFormat {
    year: TimeFormat;
    month: TimeFormat;
    week: TimeFormat;
    day: TimeFormat;
    hour: TimeFormat;
    minute: TimeFormat;
  }

  export interface ReactCalendarTimelineProps<
    CustomItem extends TimelineItemBase<any> = TimelineItemBase<number>,
    CustomGroup extends TimelineGroupBase = TimelineGroupBase,
  > {
    children?: React.ReactNode;
    groups: CustomGroup[];
    items: CustomItem[];
    keys?: TimelineKeys | undefined;
    defaultTimeStart?: Date | Dayjs | undefined;
    defaultTimeEnd?: Date | Dayjs | undefined;
    visibleTimeStart?: number;
    visibleTimeEnd?: number;
    selected?: Id[] | undefined;
    sidebarWidth?: number | undefined;
    sidebarContent?: React.ReactNode | undefined;
    rightSidebarWidth?: number | undefined;
    gridSidebarWidth?: number;
    rightSidebarContent?: React.ReactNode | undefined;
    dragSnap?: number | undefined;
    minResizeWidth?: number | undefined;
    lineHeight?: number | undefined;
    itemHeightRatio?: number | undefined;
    minZoom?: number | undefined;
    maxZoom?: number | undefined;
    clickTolerance?: number | undefined;
    canMove?: boolean | undefined;
    canChangeGroup?: boolean | undefined;
    canResize?: false | true | 'left' | 'right' | 'both' | undefined;
    useResizeHandle?: boolean | undefined;
    stackItems?: boolean | undefined;
    traditionalZoom?: boolean | undefined;
    itemTouchSendsClick?: boolean | undefined;
    timeSteps?: TimelineTimeSteps | undefined;
    scrollRef?: React.Ref<any> | undefined;
    onItemDrag?(itemDragObject: OnItemDragObjectMove | OnItemDragObjectResize): void;
    onItemMove?(itemId: Id, dragTime: number, newGroupOrder: number): void;
    onItemResize?(itemId: Id, endTimeOrStartTime: number, edge: 'left' | 'right'): void;
    onItemSelect?(itemId: Id, e: any, time: number): void;
    onItemDeselect?(e: React.SyntheticEvent): void;
    onItemClick?(itemId: Id, e: React.SyntheticEvent, time: number): void;
    onItemDoubleClick?(itemId: Id, e: React.SyntheticEvent, time: number): void;
    onItemContextMenu?(itemId: Id, e: React.SyntheticEvent, time: number): void;
    onCanvasClick?(groupId: Id, time: number, e: React.SyntheticEvent): void;
    onCanvasDoubleClick?(groupId: Id, time: number, e: React.SyntheticEvent): void;
    onCanvasContextMenu?(groupId: Id, time: number, e: React.SyntheticEvent): void;
    onZoom?(timelineContext: TimelineContext, unit: Unit): void;
    moveResizeValidator?(action: 'move' | 'resize', itemId: Id, time: number, resizeEdge: 'left' | 'right'): number;
    onCanvasResize?(prosp: { width: number; visibleWidth: number; height: number }): void;
    onTimeChange?(
      visibleTimeStart: number,
      visibleTimeEnd: number,
      updateScrollCanvas: (start: number, end: number) => void,
      unit: Unit
    ): any;
    onUnitChange?(unit: Unit): void;
    onBoundsChange?(canvasTimeStart: number, canvasTimeEnd: number): any;
    itemRenderer?: ((props: ReactCalendarItemRendererProps<CustomItem>) => React.ReactNode) | undefined;
    groupRenderer?: ((props: ReactCalendarGroupRendererProps<CustomGroup>) => React.ReactNode) | undefined;
    gridSidebarGroupRenderer?: ((props: GridSidebarGroupRendererProps<CustomGroup>) => React.ReactNode) | undefined;
    resizeDetector?:
      | {
          addListener: (component: ReactCalendarTimeline) => void;
          removeListener: (component: ReactCalendarTimeline) => void;
        }
      | undefined;
    verticalLineClassNamesForTime?: ((start: number, end: number) => string[] | undefined) | undefined;
    horizontalLineClassNamesForGroup?: ((group: CustomGroup) => string[]) | undefined;
    buffer?: number | undefined;
    // Fields that are in propTypes but not documented
    headerRef?: React.Ref<any> | undefined;
    sidebarRef?: React.Ref<HTMLDivElement> | undefined;
    gridSidebarRef?: React.Ref<HTMLDivElement> | undefined;
    className?: string;
    sidebarGroupClassName?: string | undefined;
    gridSidebarClassName?: string | undefined;
    gridSidebarStyle?: React.CSSProperties | undefined;
    /**
     * The minimum width (in pixels) for each cell. This can be adjusted to change how often the timeline switches to the next unit of time.
     */
    minCellWidth?: number | undefined;
    hideHorizontalLines?: boolean | undefined;
    disableScroll?: boolean | undefined;
    style?: React.CSSProperties | undefined;
  }

  export interface TimelineTimeSteps {
    second: number;
    minute: number;
    hour: number;
    day: number;
    month: number;
    year: number;
  }

  export class TimelineMarkers extends React.Component {}

  export interface CustomMarkerChildrenProps {
    styles: React.CSSProperties;
    date: number;
  }
  export interface MarkerProps {
    date: Date | number;
    children?: ((props: CustomMarkerChildrenProps) => React.ReactNode) | undefined;
  }

  export class CustomMarker extends React.Component<MarkerProps> {}

  export interface TodayMarkerProps extends MarkerProps {
    interval?: number | undefined;
  }
  export class TodayMarker extends React.Component<TodayMarkerProps> {}

  export type CursorMarkerProps = Omit<MarkerProps, 'date'>;
  export class CursorMarker extends React.Component<CursorMarkerProps> {}

  export interface TimelineHeadersProps {
    children?: React.ReactNode;
    style?: React.CSSProperties | undefined;
    className?: string | undefined;
    calendarHeaderStyle?: React.CSSProperties | undefined;
    calendarHeaderClassName?: string | undefined;
    headerRef?: React.Ref<any> | undefined;
  }
  export class TimelineHeaders extends React.Component<TimelineHeadersProps> {}

  export type TimelineHeaderProps = TimelineHeadersProps;

  export interface SidebarHeaderChildrenFnProps<Data> {
    getRootProps: (propsToOverride?: { style: React.CSSProperties }) => { style: React.CSSProperties };
    data: Data;
  }

  export type SidebarHeaderProps<Data> =
    | {
        variant?: 'left' | 'right' | undefined;
        headerData?: Data | undefined;
        children: (props: SidebarHeaderChildrenFnProps<Data>) => React.ReactNode;
      }
    | {
        variant: 'grid';
        headerData?: Data | undefined;
        children: (
          props: SidebarHeaderChildrenFnProps<Data> & {
            setGridSidebarHeaderColWidths: React.Dispatch<React.SetStateAction<number[]>>;
          }
        ) => React.ReactNode;
      };
  export class SidebarHeader<Data = any> extends React.Component<SidebarHeaderProps<Data>> {}

  export type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'isoWeek' | 'month' | 'year';

  export interface IntervalContext {
    interval: { startTime: number; endTime: number; labelWidth: number; left: number };
    intervalText: string;
  }
  export interface GetIntervalProps {
    interval?: Interval | undefined;
    style?: React.CSSProperties | undefined;
    onClick?: React.MouseEventHandler | undefined;
  }
  export interface IntervalRenderer<Data> {
    intervalContext: IntervalContext;
    getIntervalProps: (props?: GetIntervalProps) => Required<GetIntervalProps> & { key: string | number };
    data?: Data | undefined;
  }

  export interface DateHeaderProps<Data> {
    style?: React.CSSProperties | undefined;
    className?: string | undefined;
    unit?: Unit | 'primaryHeader' | undefined;
    labelFormat?:
      | string
      | (([startTime, endTime]: [Dayjs, Dayjs], unit: Unit, labelWidth: number) => string)
      | undefined;
    intervalRenderer?: ((props: IntervalRenderer<Data>) => React.ReactNode) | undefined;
    headerData?: Data | undefined;
    children?: ((props: SidebarHeaderChildrenFnProps<Data>) => React.ReactNode) | undefined;
    height?: number | undefined;
  }
  export class DateHeader<Data = any> extends React.Component<DateHeaderProps<Data>> {}
  export interface Interval {
    startTime: Dayjs;
    endTime: Dayjs;
  }
  export interface HeaderContext {
    intervals: Array<{ startTime: Dayjs; endTime: Dayjs }>;
    unit: string;
  }
  export interface CustomHeaderPropsChildrenFnProps<Data> {
    timelineContext: TimelineContext;
    headerContext: HeaderContext;
    getIntervalProps: (props?: GetIntervalProps) => Required<GetIntervalProps> & { key: string | number };
    getRootProps: (propsToOverride?: { style: React.CSSProperties }) => { style: React.CSSProperties };
    showPeriod: (startDate: Dayjs | number, endDate: Dayjs | number) => void;
    data: Data;
  }

  export interface CustomHeaderProps<Data> {
    unit?: Unit | undefined;
    headerData?: Data | undefined;
    height?: number | undefined;
    children: (props?: CustomHeaderPropsChildrenFnProps<Data>) => React.ReactNode;
  }
  export class CustomHeader<Data = any> extends React.Component<CustomHeaderProps<Data>> {}

  export const defaultKeys: TimelineKeys;
  export const defaultTimeSteps: TimelineTimeSteps;
  export const defaultHeaderFormats: LabelFormat;

  export default class ReactCalendarTimeline<
    CustomItem extends TimelineItemBase<any> = TimelineItemBase<number>,
    CustomGroup extends TimelineGroupBase = TimelineGroupBase,
  > extends React.Component<ReactCalendarTimelineProps<CustomItem, CustomGroup>> {}
}
