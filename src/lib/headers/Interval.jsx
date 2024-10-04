import React from 'react';

import { getNextUnit } from '../utility/calendar';
import { composeEvents } from '../utility/events';
import { cn } from '../utility/tw';

class Interval extends React.PureComponent {
  onIntervalClick = () => {
    const { primaryHeader, interval, unit, showPeriod } = this.props;
    if (primaryHeader) {
      const nextUnit = getNextUnit(unit);
      const newStartTime = interval.startTime.clone().startOf(nextUnit);
      const newEndTime = interval.startTime.clone().endOf(nextUnit);
      showPeriod(newStartTime, newEndTime);
    } else {
      showPeriod(interval.startTime, interval.endTime);
    }
  };

  getIntervalProps = (props = {}) => {
    return {
      ...this.props.getIntervalProps({
        interval: this.props.interval,
        ...props,
      }),
      onClick: composeEvents(this.onIntervalClick, props.onClick),
    };
  };

  render() {
    const { intervalText, interval, intervalRenderer, headerData } = this.props;
    const Renderer = intervalRenderer;
    if (Renderer) {
      return (
        <Renderer
          getIntervalProps={this.getIntervalProps}
          intervalContext={{
            interval,
            intervalText,
          }}
          data={headerData}
        />
      );
    }

    return (
      <div
        data-testid='dateHeaderInterval'
        {...this.getIntervalProps({})}
        className={cn(
          'absolute flex items-center justify-center h-full border-b border-l-2 border-borderColor cursor-pointer text-sm bg-dateHeaderBgColor',
          {
            'border-x border-borderColor text-itemColor bg-inherit': this.props.primaryHeader,
          }
        )}>
        <span>{intervalText}</span>
      </div>
    );
  }
}

export default Interval;
