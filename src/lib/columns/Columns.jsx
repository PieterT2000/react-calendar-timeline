import React, { Component } from 'react';

import { iterateTimes } from '../utility/calendar';
import { TimelineStateConsumer } from '../timeline/TimelineStateContext';
import { cn } from '../utility/tw';

class Columns extends Component {
  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.lineCount === this.props.lineCount &&
      nextProps.minUnit === this.props.minUnit &&
      nextProps.timeSteps === this.props.timeSteps &&
      nextProps.height === this.props.height &&
      nextProps.verticalLineClassNamesForTime === this.props.verticalLineClassNamesForTime
    );
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      height,
      verticalLineClassNamesForTime,
      getLeftOffsetFromDate,
    } = this.props;

    const lines = [];

    iterateTimes(canvasTimeStart, canvasTimeEnd, minUnit, timeSteps, (time, nextTime) => {
      const minUnitValue = time.get(minUnit === 'day' ? 'date' : minUnit);
      const firstOfType = minUnitValue === (minUnit === 'day' ? 1 : 0);

      const classNamesForTime = verticalLineClassNamesForTime?.(
        time.unix() * 1000, // turn into ms, which is what verticalLineClassNamesForTime expects
        nextTime.unix() * 1000 - 1
      );

      const className = cn(
        'absolute pointer-events-none top-0 border-l border-borderColor z-[30]',
        firstOfType && 'border-l-2',
        ['day', 'hour', 'minute'].includes(minUnit) && [0, 6].includes(time.day()) && 'bg-weekend',
        classNamesForTime
      );

      const left = getLeftOffsetFromDate(time.valueOf());
      const right = getLeftOffsetFromDate(nextTime.valueOf());
      lines.push(
        <div
          key={`line-${time.valueOf()}`}
          className={className}
          style={{
            left: `${left}px`,
            width: `${right - left}px`,
            height: `${height}px`,
          }}
        />
      );
    });

    return <div>{lines}</div>;
  }
}

const ColumnsWrapper = ({ ...props }) => {
  return (
    <TimelineStateConsumer>
      {({ getLeftOffsetFromDate }) => <Columns getLeftOffsetFromDate={getLeftOffsetFromDate} {...props} />}
    </TimelineStateConsumer>
  );
};

export default ColumnsWrapper;
