import React, { Component } from 'react';

import Items from './items/Items';
import Sidebar from './layout/Sidebar';
import Columns from './columns/Columns';
import GroupRows from './row/GroupRows';
import ScrollElement from './scroll/ScrollElement';
import MarkerCanvas from './markers/MarkerCanvas';
import windowResizeDetector from '../resize-detector/window';

import {
  getMinUnit,
  calculateTimeForXPosition,
  calculateScrollCanvas,
  getCanvasBoundariesFromVisibleTime,
  getCanvasWidth,
  stackTimelineItems,
} from './utility/calendar';
import { _get, _length } from './utility/generic';
import { defaultKeys, defaultTimeSteps } from './default-config';
import { TimelineStateProvider } from './timeline/TimelineStateContext';
import { TimelineMarkersProvider } from './markers/TimelineMarkersContext';
import { TimelineHeadersProvider } from './headers/HeadersContext';
import { ItemsProvider } from './items/ItemsContext';
import TimelineHeaders from './headers/TimelineHeaders';
import { cn } from './utility/tw.js';
import RenderHeaders from './headers/RenderHeaders.jsx';
import { ReactCalendarTimelineProps, Unit } from 'react-calendar-timeline-v3';

interface ReactCalendarTimelineState {
  width: number;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  canvasTimeStart: number;
  canvasTimeEnd: number;
  selectedItem: any;
  dragTime: number | null;
  dragGroupTitle: string | null;
  resizeTime: number | null;
  resizingItem: any;
  resizingEdge: 'left' | 'right' | null;
  dimensionItems?: {
    id: string;
    dimensions: {
      left: number;
      width: number;
      collisionLeft: number;
      collisionWidth: number;
      top?: number | null;
      height?: number;
      stack?: boolean;
      order?: number;
    };
  }[];
  height?: number;
  groupHeight?: number[];
  groupTops?: number[];
  draggingItem?: any;
  newGroupOrder?: any;
}

export default class ReactCalendarTimeline extends Component<ReactCalendarTimelineProps, ReactCalendarTimelineState> {
  static defaultProps = {
    sidebarWidth: 150,
    rightSidebarWidth: 0,
    secondLeftSidebarWidth: 0,
    dragSnap: 1000 * 60 * 15, // 15min
    minResizeWidth: 20,
    lineHeight: 30,
    itemHeightRatio: 0.65,
    buffer: 3,

    minZoom: 60 * 60 * 1000, // 1 hour
    maxZoom: 5 * 365.24 * 86400 * 1000, // 5 years

    clickTolerance: 3, // how many pixels can we drag for it to be still considered a click?

    canChangeGroup: true,
    canMove: true,
    canResize: 'right',
    useResizeHandle: false,
    canSelect: true,

    stackItems: false,

    traditionalZoom: false,

    horizontalLineClassNamesForGroup: null,

    onItemMove: null,
    onItemResize: null,
    onItemClick: null,
    onItemSelect: null,
    onItemDeselect: null,
    onItemDrag: null,
    onCanvasClick: null,
    onItemDoubleClick: null,
    onItemContextMenu: null,
    onZoom: null,

    verticalLineClassNamesForTime: null,

    moveResizeValidator: null,

    dayBackground: null,

    defaultTimeStart: null,
    defaultTimeEnd: null,

    itemTouchSendsClick: false,

    style: {},
    className: '',
    keys: defaultKeys,
    timeSteps: defaultTimeSteps,
    headerRef: () => {},
    scrollRef: () => {},

    // if you pass in visibleTimeStart and visibleTimeEnd, you must also pass onTimeChange(visibleTimeStart, visibleTimeEnd),
    // which needs to update the props visibleTimeStart and visibleTimeEnd to the ones passed
    visibleTimeStart: null,
    visibleTimeEnd: null,
    onTimeChange: function (
      visibleTimeStart: number,
      visibleTimeEnd: number,
      updateScrollCanvas: (visibleTimeStart: number, visibleTimeEnd: number) => void
    ) {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    },
    // called when the canvas area of the calendar changes
    onBoundsChange: null,
    children: null,

    selected: null,
    disableScroll: false,
    minCellWidth: 17,
  };

  getTimelineContext = () => {
    const { width, visibleTimeStart, visibleTimeEnd, canvasTimeStart, canvasTimeEnd } = this.state;

    return {
      timelineWidth: width,
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd,
    };
  };

  getTimelineUnit = () => {
    const { width, visibleTimeStart, visibleTimeEnd } = this.state;

    const { timeSteps } = this.props;

    const zoom = visibleTimeEnd - visibleTimeStart;
    const minUnit = getMinUnit(zoom, width, timeSteps, this.props.minCellWidth);

    return minUnit;
  };

  constructor(props: ReactCalendarTimelineProps) {
    super(props);

    this.getSelected = this.getSelected.bind(this);
    this.hasSelectedItem = this.hasSelectedItem.bind(this);
    this.isItemSelected = this.isItemSelected.bind(this);

    let visibleTimeStart: number;
    let visibleTimeEnd: number;

    if (this.props.defaultTimeStart && this.props.defaultTimeEnd) {
      visibleTimeStart = this.props.defaultTimeStart.valueOf();
      visibleTimeEnd = this.props.defaultTimeEnd.valueOf();
    } else if (this.props.visibleTimeStart && this.props.visibleTimeEnd) {
      visibleTimeStart = this.props.visibleTimeStart;
      visibleTimeEnd = this.props.visibleTimeEnd;
    } else {
      //throwing an error because neither default or visible time props provided
      throw new Error(
        'You must provide either "defaultTimeStart" and "defaultTimeEnd" or "visibleTimeStart" and "visibleTimeEnd" to initialize the Timeline'
      );
    }

    const [canvasTimeStart, canvasTimeEnd] = getCanvasBoundariesFromVisibleTime(
      visibleTimeStart,
      visibleTimeEnd,
      props.buffer
    );

    this.state = {
      width: 1000,
      visibleTimeStart: visibleTimeStart,
      visibleTimeEnd: visibleTimeEnd,
      canvasTimeStart: canvasTimeStart,
      canvasTimeEnd: canvasTimeEnd,
      selectedItem: null,
      dragTime: null,
      dragGroupTitle: null,
      resizeTime: null,
      resizingItem: null,
      resizingEdge: null,
    };

    const canvasWidth = getCanvasWidth(this.state.width, props.buffer);

    const { dimensionItems, height, groupHeights, groupTops } = stackTimelineItems(
      props.items,
      props.groups,
      canvasWidth,
      this.state.canvasTimeStart,
      this.state.canvasTimeEnd,
      props.keys,
      props.lineHeight!,
      props.itemHeightRatio!,
      props.stackItems!,
      this.state.draggingItem,
      this.state.resizingItem,
      this.state.dragTime,
      this.state.resizingEdge,
      this.state.resizeTime,
      this.state.newGroupOrder
    );

    /* eslint-disable react/no-direct-mutation-state */
    this.state.dimensionItems = dimensionItems;
    this.state.height = height;
    this.state.groupHeights = groupHeights;
    this.state.groupTops = groupTops;

    /* eslint-enable */
    this.unit = this.getTimelineUnit() as Unit;
  }

  componentDidMount() {
    this.resize(this.props);

    if (this.props.resizeDetector && this.props.resizeDetector.addListener) {
      this.props.resizeDetector.addListener(this);
    }

    windowResizeDetector.addListener(this);

    this.lastTouchDistance = null;
  }

  componentWillUnmount() {
    if (this.props.resizeDetector && this.props.resizeDetector.removeListener) {
      this.props.resizeDetector.removeListener(this);
    }

    windowResizeDetector.removeListener(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visibleTimeStart, visibleTimeEnd, items, groups } = nextProps;

    // This is a gross hack pushing items and groups in to state only to allow
    // For the forceUpdate check
    const derivedState = { items, groups };

    // if the items or groups have changed we must re-render
    const forceUpdate = items !== prevState.items || groups !== prevState.groups;

    // We are a controlled component
    if (visibleTimeStart && visibleTimeEnd) {
      // Get the new canvas position
      Object.assign(
        derivedState,
        calculateScrollCanvas(visibleTimeStart, visibleTimeEnd, forceUpdate, items, groups, nextProps, prevState)
      );
    } else if (forceUpdate) {
      // Calculate new item stack position as canvas may have changed
      const canvasWidth = getCanvasWidth(prevState.width, nextProps.buffer);
      Object.assign(
        derivedState,
        stackTimelineItems(
          items,
          groups,
          canvasWidth,
          prevState.canvasTimeStart,
          prevState.canvasTimeEnd,
          nextProps.keys,
          nextProps.lineHeight,
          nextProps.itemHeightRatio,
          nextProps.stackItems,
          prevState.draggingItem,
          prevState.resizingItem,
          prevState.dragTime,
          prevState.resizingEdge,
          prevState.resizeTime,
          prevState.newGroupOrder
        )
      );
    }

    return derivedState;
  }

  componentDidUpdate(prevProps, prevState) {
    const newZoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
    const oldZoom = prevState.visibleTimeEnd - prevState.visibleTimeStart;

    // are we changing zoom? Report it!
    if (this.props.onZoom && newZoom !== oldZoom) {
      this.props.onZoom(this.getTimelineContext(), this.getTimelineUnit() as Unit);
    }

    // The bounds have changed? Report it!
    if (this.props.onBoundsChange && this.state.canvasTimeStart !== prevState.canvasTimeStart) {
      this.props.onBoundsChange(this.state.canvasTimeStart, this.state.canvasTimeStart + newZoom * 3);
    }

    // Check the scroll is correct
    const scrollLeft = Math.round(
      (this.state.width * (this.state.visibleTimeStart - this.state.canvasTimeStart)) / newZoom
    );
    const componentScrollLeft = Math.round(
      (prevState.width * (prevState.visibleTimeStart - prevState.canvasTimeStart)) / oldZoom
    );

    if (componentScrollLeft !== scrollLeft) {
      this.scrollComponent.scrollLeft = scrollLeft;
      this.scrollHeaderRef.scrollLeft = scrollLeft;
    }

    const newUnit = this.getTimelineUnit() as Unit;
    if (newUnit !== this.unit) {
      this.props.onUnitChange?.(newUnit);
      this.unit = newUnit;
    }
  }

  calcCanvasAndVisibleWidth = () => {
    const { width: containerWidth } = this.container.getBoundingClientRect();

    const width =
      containerWidth - this.props.sidebarWidth! - this.props.secondLeftSidebarWidth! - this.props.rightSidebarWidth!;
    const canvasWidth = getCanvasWidth(width, this.props.buffer);

    return { canvasWidth, width };
  };

  resize = (props = this.props) => {
    const { canvasWidth, width } = this.calcCanvasAndVisibleWidth();
    const { dimensionItems, height, groupHeights, groupTops } = stackTimelineItems(
      props.items,
      props.groups,
      canvasWidth,
      this.state.canvasTimeStart,
      this.state.canvasTimeEnd,
      props.keys,
      props.lineHeight,
      props.itemHeightRatio,
      props.stackItems,
      this.state.draggingItem,
      this.state.resizingItem,
      this.state.dragTime,
      this.state.resizingEdge,
      this.state.resizeTime,
      this.state.newGroupOrder
    );

    // this is needed by dragItem since it uses pageY from the drag events
    // if this was in the context of the scrollElement, this would not be necessary

    this.setState({
      width,
      dimensionItems,
      height,
      groupHeights,
      groupTops,
    });
    //initial scroll left is the buffer - 1 (1 is visible area) divided by 2 (2 is the buffer split on the right and left of the timeline)
    const scrollLeft = width * ((props.buffer - 1) / 2);
    this.scrollComponent.scrollLeft = scrollLeft;
    this.scrollHeaderRef.scrollLeft = scrollLeft;
    this.props.onCanvasResize?.({ width: canvasWidth, visibleWidth: width, height });
  };

  onScroll = (scrollX) => {
    const width = this.state.width;

    const canvasTimeStart = this.state.canvasTimeStart;

    const zoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;

    const visibleTimeStart = canvasTimeStart + (zoom * scrollX) / width;

    if (this.state.visibleTimeStart !== visibleTimeStart || this.state.visibleTimeEnd !== visibleTimeStart + zoom) {
      this.props.onTimeChange(
        visibleTimeStart,
        visibleTimeStart + zoom,
        this.updateScrollCanvas,
        this.getTimelineUnit()
      );
    }
  };

  // called when the visible time changes
  public updateScrollCanvas = (
    visibleTimeStart,
    visibleTimeEnd,
    forceUpdateDimensions,
    items = this.props.items,
    groups = this.props.groups
  ) => {
    this.setState(
      calculateScrollCanvas(
        visibleTimeStart,
        visibleTimeEnd,
        forceUpdateDimensions,
        items,
        groups,
        this.props,
        this.state
      )
    );
  };

  handleWheelZoom = (speed, xPosition, deltaY) => {
    this.changeZoom(1.0 + (speed * deltaY) / 500, xPosition / this.state.width);
  };

  changeZoom = (scale, offset = 0.5) => {
    const { minZoom, maxZoom } = this.props;
    const oldZoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
    const newZoom = Math.min(Math.max(Math.round(oldZoom * scale), minZoom), maxZoom); // min 1 min, max 20 years
    const newVisibleTimeStart = Math.round(this.state.visibleTimeStart + (oldZoom - newZoom) * offset);

    this.props.onTimeChange?.(
      newVisibleTimeStart,
      newVisibleTimeStart + newZoom,
      this.updateScrollCanvas,
      this.getTimelineUnit() as Unit
    );
  };

  showPeriod = (from, to) => {
    const visibleTimeStart = from.valueOf();
    const visibleTimeEnd = to.valueOf();

    const zoom = visibleTimeEnd - visibleTimeStart;
    // can't zoom in more than to show one hour
    if (zoom < this.props.minZoom) {
      return;
    }

    this.props.onTimeChange(visibleTimeStart, visibleTimeStart + zoom, this.updateScrollCanvas, this.getTimelineUnit());
  };

  selectItem = (item, clickType, e) => {
    if (this.isItemSelected(item) || (this.props.itemTouchSendsClick && clickType === 'touch')) {
      if (item && this.props.onItemClick) {
        const time = this.timeFromItemEvent(e);
        this.props.onItemClick(item, e, time);
      }
    } else {
      this.setState({ selectedItem: item });
      if (item && this.props.onItemSelect) {
        const time = this.timeFromItemEvent(e);
        this.props.onItemSelect(item, e, time);
      } else if (item === null && this.props.onItemDeselect) {
        this.props.onItemDeselect(e); // this isnt in the docs. Is this function even used?
      }
    }
  };

  doubleClickItem = (item, e) => {
    if (this.props.onItemDoubleClick) {
      const time = this.timeFromItemEvent(e);
      this.props.onItemDoubleClick(item, e, time);
    }
  };

  contextMenuClickItem = (item, e) => {
    if (this.props.onItemContextMenu) {
      const time = this.timeFromItemEvent(e);
      this.props.onItemContextMenu(item, e, time);
    }
  };

  // TODO: this is very similar to timeFromItemEvent, aside from which element to get offsets
  // from.  Look to consolidate the logic for determining coordinate to time
  // as well as generalizing how we get time from click on the canvas
  getTimeFromRowClickEvent = (e) => {
    const { dragSnap, buffer } = this.props;
    const { width, canvasTimeStart, canvasTimeEnd } = this.state;
    // this gives us distance from left of row element, so event is in
    // context of the row element, not client or page
    const { offsetX } = e.nativeEvent;

    const time = calculateTimeForXPosition(
      canvasTimeStart,

      canvasTimeEnd,
      getCanvasWidth(width, buffer),
      offsetX
    );
    return Math.floor(time / dragSnap) * dragSnap;
  };

  timeFromItemEvent = (e) => {
    const { width, visibleTimeStart, visibleTimeEnd } = this.state;
    const { dragSnap } = this.props;

    const scrollComponent = this.scrollComponent;
    const { left: scrollX } = scrollComponent.getBoundingClientRect();

    const xRelativeToTimeline = e.clientX - scrollX;

    const relativeItemPosition = xRelativeToTimeline / width;
    const zoom = visibleTimeEnd - visibleTimeStart;
    const timeOffset = relativeItemPosition * zoom;

    const time = Math.round(visibleTimeStart + timeOffset);
    return Math.floor(time / dragSnap) * dragSnap;
  };

  dragItem = (item, dragTime, newGroupOrder) => {
    const newGroup = this.props.groups[newGroupOrder];
    const keys = this.props.keys;

    this.setState({
      draggingItem: item,
      dragTime: dragTime,
      newGroupOrder: newGroupOrder,
      dragGroupTitle: newGroup ? _get(newGroup, keys.groupLabelKey) : '',
    });

    this.updatingItem({
      eventType: 'move',
      itemId: item,
      time: dragTime,
      newGroupOrder,
    });
  };

  dropItem = (item, dragTime, newGroupOrder) => {
    this.setState({ draggingItem: null, dragTime: null, dragGroupTitle: null });
    if (this.props.onItemMove) {
      this.props.onItemMove(item, dragTime, newGroupOrder);
    }
  };

  resizingItem = (item, resizeTime, edge) => {
    this.setState({
      resizingItem: item,
      resizingEdge: edge,
      resizeTime: resizeTime,
    });

    this.updatingItem({
      eventType: 'resize',
      itemId: item,
      time: resizeTime,
      edge,
    });
  };

  resizedItem = (item, resizeTime, edge, timeDelta) => {
    this.setState({ resizingItem: null, resizingEdge: null, resizeTime: null });
    if (this.props.onItemResize && timeDelta !== 0) {
      this.props.onItemResize(item, resizeTime, edge);
    }
  };

  updatingItem = ({ eventType, itemId, time, edge, newGroupOrder }) => {
    if (this.props.onItemDrag) {
      this.props.onItemDrag({ eventType, itemId, time, edge, newGroupOrder });
    }
  };

  columns(canvasTimeStart, canvasTimeEnd, canvasWidth, minUnit, timeSteps, height) {
    return (
      <Columns
        canvasTimeStart={canvasTimeStart}
        canvasTimeEnd={canvasTimeEnd}
        canvasWidth={canvasWidth}
        lineCount={_length(this.props.groups)}
        minUnit={minUnit}
        timeSteps={timeSteps}
        height={height}
        verticalLineClassNamesForTime={this.props.verticalLineClassNamesForTime}
      />
    );
  }

  handleRowClick = (e, rowIndex) => {
    // shouldnt this be handled by the user, as far as when to deselect an item?
    if (this.hasSelectedItem()) {
      this.selectItem(null);
    }

    if (this.props.onCanvasClick == null) return;

    const time = this.getTimeFromRowClickEvent(e);
    const groupId = _get(this.props.groups[rowIndex], this.props.keys.groupIdKey);
    this.props.onCanvasClick(groupId, time, e);
  };

  handleRowDoubleClick = (e, rowIndex) => {
    if (this.props.onCanvasDoubleClick == null) return;

    const time = this.getTimeFromRowClickEvent(e);
    const groupId = _get(this.props.groups[rowIndex], this.props.keys.groupIdKey);
    this.props.onCanvasDoubleClick(groupId, time, e);
  };

  handleScrollContextMenu = (e, rowIndex) => {
    if (this.props.onCanvasContextMenu == null) return;

    const timePosition = this.getTimeFromRowClickEvent(e);

    const groupId = _get(this.props.groups[rowIndex], this.props.keys.groupIdKey);

    if (this.props.onCanvasContextMenu) {
      e.preventDefault();
      this.props.onCanvasContextMenu(groupId, timePosition, e);
    }
  };

  rows(canvasWidth, groupHeights, groups) {
    return (
      <GroupRows
        groups={groups}
        canvasWidth={canvasWidth}
        lineCount={_length(this.props.groups)}
        groupHeights={groupHeights}
        clickTolerance={this.props.clickTolerance}
        onRowClick={this.handleRowClick}
        onRowDoubleClick={this.handleRowDoubleClick}
        horizontalLineClassNamesForGroup={this.props.horizontalLineClassNamesForGroup}
        onRowContextClick={this.handleScrollContextMenu}
      />
    );
  }

  items(canvasTimeStart, zoom, canvasTimeEnd, canvasWidth, minUnit, dimensionItems, groupHeights, groupTops) {
    return (
      <ItemsProvider value={{ getTimelineContext: this.getTimelineContext }}>
        <Items
          canvasTimeStart={canvasTimeStart}
          canvasTimeEnd={canvasTimeEnd}
          canvasWidth={canvasWidth}
          dimensionItems={dimensionItems}
          groupTops={groupTops}
          items={this.props.items}
          groups={this.props.groups}
          keys={this.props.keys}
          selectedItem={this.state.selectedItem}
          dragSnap={this.props.dragSnap}
          minResizeWidth={this.props.minResizeWidth}
          canChangeGroup={this.props.canChangeGroup}
          canMove={this.props.canMove}
          canResize={this.props.canResize}
          useResizeHandle={this.props.useResizeHandle}
          canSelect={this.props.canSelect}
          moveResizeValidator={this.props.moveResizeValidator}
          itemSelect={this.selectItem}
          itemDrag={this.dragItem}
          itemDrop={this.dropItem}
          onItemDoubleClick={this.doubleClickItem}
          onItemContextMenu={this.props.onItemContextMenu ? this.contextMenuClickItem : undefined}
          itemResizing={this.resizingItem}
          itemResized={this.resizedItem}
          itemRenderer={this.props.itemRenderer}
          selected={this.props.selected}
          scrollRef={this.scrollComponent}
        />
      </ItemsProvider>
    );
  }

  handleHeaderRef = (el) => {
    this.scrollHeaderRef = el;
    this.props.headerRef(el);
  };

  sidebar(height, groupHeights) {
    const { sidebarWidth } = this.props;
    return (
      sidebarWidth && (
        <Sidebar
          groups={this.props.groups}
          groupRenderer={this.props.groupRenderer}
          keys={this.props.keys}
          width={sidebarWidth}
          groupHeights={groupHeights}
          height={height}
          sidebarGroupClassName={this.props.sidebarGroupClassName}
        />
      )
    );
  }

  secondLeftSidebar(height, groupHeights) {
    const { secondLeftSidebarWidth } = this.props;
    return (
      secondLeftSidebarWidth && (
        <Sidebar
          groups={this.props.groups}
          keys={this.props.keys}
          groupRenderer={this.props.secondLeftSidebarGroupRenderer}
          isRightSidebar={false}
          width={secondLeftSidebarWidth}
          groupHeights={groupHeights}
          height={height}
          sidebarGroupClassName={this.props.sidebarGroupClassName}
        />
      )
    );
  }

  rightSidebar(height, groupHeights) {
    const { rightSidebarWidth } = this.props;
    return (
      rightSidebarWidth && (
        <Sidebar
          groups={this.props.groups}
          keys={this.props.keys}
          groupRenderer={this.props.groupRenderer}
          isRightSidebar
          width={rightSidebarWidth}
          groupHeights={groupHeights}
          height={height}
          sidebarGroupClassName={this.props.sidebarGroupClassName}
        />
      )
    );
  }

  /**
   * check if child of type TimelineHeader
   * refer to for explanation https://github.com/gaearon/react-hot-loader#checking-element-types
   */
  isTimelineHeader = (child) => {
    if (child.type === undefined) return false;
    return child.type.secretKey === TimelineHeaders.secretKey;
  };

  childrenWithProps(
    canvasTimeStart,
    canvasTimeEnd,
    canvasWidth,
    dimensionItems,
    groupHeights,
    groupTops,
    height,
    visibleTimeStart,
    visibleTimeEnd,
    minUnit,
    timeSteps
  ) {
    if (!this.props.children) {
      return null;
    }

    // convert to an array and remove the nulls
    const childArray = Array.isArray(this.props.children)
      ? this.props.children.filter((c) => c)
      : [this.props.children];

    const childProps = {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      visibleTimeStart: visibleTimeStart,
      visibleTimeEnd: visibleTimeEnd,
      dimensionItems,
      items: this.props.items,
      groups: this.props.groups,
      keys: this.props.keys,
      groupHeights: groupHeights,
      groupTops: groupTops,
      selected: this.getSelected(),
      height: height,
      minUnit: minUnit,
      timeSteps: timeSteps,
    };

    return React.Children.map(childArray, (child) => {
      if (!this.isTimelineHeader(child)) {
        return React.cloneElement(child, childProps);
      } else {
        return null;
      }
    });
  }

  getSelected() {
    return this.state.selectedItem && !this.props.selected ? [this.state.selectedItem] : this.props.selected || [];
  }

  hasSelectedItem() {
    if (!Array.isArray(this.props.selected)) return !!this.state.selectedItem;
    return this.props.selected.length > 0;
  }

  isItemSelected(itemId) {
    const selectedItems = this.getSelected();
    return selectedItems.some((i) => i === itemId);
  }
  getScrollElementRef = (el) => {
    this.props.scrollRef(el);
    this.scrollComponent = el;
  };

  render() {
    const {
      items,
      groups,
      sidebarWidth,
      rightSidebarWidth,
      secondLeftSidebarWidth,
      timeSteps,
      traditionalZoom,
      buffer,
    } = this.props;
    const { draggingItem, resizingItem, width, visibleTimeStart, visibleTimeEnd, canvasTimeStart, canvasTimeEnd } =
      this.state;
    let { dimensionItems, height, groupHeights, groupTops } = this.state;
    const zoom = visibleTimeEnd - visibleTimeStart;
    const canvasWidth = getCanvasWidth(width, buffer);
    const minUnit = getMinUnit(zoom, width, timeSteps, this.props.minCellWidth);

    const isInteractingWithItem = !!draggingItem || !!resizingItem;

    if (isInteractingWithItem) {
      const stackResults = stackTimelineItems(
        items,
        groups,
        canvasWidth,
        this.state.canvasTimeStart,
        this.state.canvasTimeEnd,
        this.props.keys,
        this.props.lineHeight,
        this.props.itemHeightRatio,
        this.props.stackItems,
        this.state.draggingItem,
        this.state.resizingItem,
        this.state.dragTime,
        this.state.resizingEdge,
        this.state.resizeTime,
        this.state.newGroupOrder
      );
      dimensionItems = stackResults.dimensionItems;
      height = stackResults.height;
      groupHeights = stackResults.groupHeights;
      groupTops = stackResults.groupTops;
    }

    const outerComponentStyle = {
      height: `${height}px`,
    };

    return (
      <TimelineStateProvider
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        canvasTimeStart={canvasTimeStart}
        canvasTimeEnd={canvasTimeEnd}
        canvasWidth={canvasWidth}
        showPeriod={this.showPeriod}
        timelineUnit={minUnit}
        timelineWidth={this.state.width}>
        <TimelineMarkersProvider>
          <TimelineHeadersProvider
            registerScroll={this.handleHeaderRef}
            timeSteps={timeSteps}
            leftSidebarWidth={this.props.sidebarWidth}
            rightSidebarWidth={this.props.rightSidebarWidth}
            secondLeftSidebarWidth={this.props.secondLeftSidebarWidth}>
            <div
              style={this.props.style}
              ref={(el) => (this.container = el)}
              className={cn('react-timeline', this.props.className)}>
              <RenderHeaders isTimelineHeader={this.isTimelineHeader}>{this.props.children}</RenderHeaders>
              <div style={outerComponentStyle} className='block overflow-hidden whitespace-nowrap'>
                {sidebarWidth > 0 ? this.sidebar(height, groupHeights) : null}
                {secondLeftSidebarWidth > 0 ? this.secondLeftSidebar(height, groupHeights) : null}
                <ScrollElement
                  scrollRef={this.getScrollElementRef}
                  width={width}
                  height={height}
                  onZoom={this.changeZoom}
                  onWheelZoom={this.handleWheelZoom}
                  traditionalZoom={traditionalZoom}
                  onScroll={this.onScroll}
                  isInteractingWithItem={isInteractingWithItem}
                  disableScroll={this.props.disableScroll}>
                  <MarkerCanvas>
                    {this.columns(canvasTimeStart, canvasTimeEnd, canvasWidth, minUnit, timeSteps, height)}
                    {this.rows(canvasWidth, groupHeights, groups)}
                    {this.items(
                      canvasTimeStart,
                      zoom,
                      canvasTimeEnd,
                      canvasWidth,
                      minUnit,
                      dimensionItems,
                      groupHeights,
                      groupTops
                    )}
                    {this.childrenWithProps(
                      canvasTimeStart,
                      canvasTimeEnd,
                      canvasWidth,
                      dimensionItems,
                      groupHeights,
                      groupTops,
                      height,
                      visibleTimeStart,
                      visibleTimeEnd,
                      minUnit,
                      timeSteps
                    )}
                  </MarkerCanvas>
                </ScrollElement>
                {rightSidebarWidth > 0 && this.rightSidebar(height, groupHeights)}
              </div>
            </div>
          </TimelineHeadersProvider>
        </TimelineMarkersProvider>
      </TimelineStateProvider>
    );
  }
}
