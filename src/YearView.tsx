import React, { Fragment } from 'react';
//import { h, Component, Fragment } from 'preact';
import { sliceEvents, createPlugin, ViewProps } from '@fullcalendar/react';
import {
    createRef, DayHeader, DateProfileGenerator, DateProfile,
    memoize, DayTableModel, DaySeriesModel, ChunkContentCallbackArgs, Duration,
    SimpleScrollGrid,
    SimpleScrollGridSection
} from '@fullcalendar/common';
import { TableView, DayTable } from '@fullcalendar/daygrid'

class YearView extends React.Component<ViewProps, {}> {

    render() {
        //  let segs = sliceEvents(this.props, true); // allDay=true
        console.log(this.props);
        return (
            <Fragment>
                <div className='view-title'>hahahadddd
                    {this.props.dateProfile.currentRange.start.toUTCString()}
                </div>
                <div className='view-events'>
                    {/* {segs.length} events  */}
                </div>
            </Fragment>
        );
    }
}

class TestView extends TableView {

    private buildDayTableModel = memoize(buildDayTableModel)
    private headerRef = createRef<DayHeader>()
    private tableRef = createRef<DayTable>()

    render() {
        
        let { options, dateProfileGenerator } = this.context;
        let { props } = this;
        let sections: SimpleScrollGridSection[] = []
        let dayTableModel = this.buildDayTableModel(props.dateProfile, dateProfileGenerator)
        console.log(options.monthMode);
        let headerContent = options.dayHeaders &&
            <DayHeader
                ref={this.headerRef}
                dateProfile={props.dateProfile}
                dates={dayTableModel.headerDates}
                datesRepDistinctDays={dayTableModel.rowCnt === 1}
            />

        let bodyContent = (contentArg: ChunkContentCallbackArgs) => (
            
            <DayTable
                ref={this.tableRef}
                dateProfile={props.dateProfile}
                dayTableModel={dayTableModel}
                businessHours={props.businessHours}
                dateSelection={props.dateSelection}
                eventStore={props.eventStore}
                eventUiBases={props.eventUiBases}
                eventSelection={props.eventSelection}
                eventDrag={props.eventDrag}
                eventResize={props.eventResize}
                nextDayThreshold={options.nextDayThreshold as Duration}
                colGroupNode={contentArg.tableColGroupNode}
                tableMinWidth={contentArg.tableMinWidth}
                dayMaxEvents={options.dayMaxEvents as number | boolean}
                dayMaxEventRows={options.dayMaxEventRows as number | boolean}
                showWeekNumbers={options.weekNumbers}

                expandRows={!props.isHeightAuto}
                headerAlignElRef={this.headerElRef}
                clientWidth={contentArg.clientWidth}
                clientHeight={contentArg.clientHeight}
                forPrint={props.forPrint}

            />
        )
        return options.dayMinWidth
            ? this.renderHScrollLayout(headerContent, bodyContent, dayTableModel.colCnt, options.dayMinWidth)
            : this.renderSimpleLayout(headerContent, bodyContent)


        //    return <SimpleScrollGrid
        //     liquid={!props.isHeightAuto && !props.forPrint}
        //     cols={[] /* TODO: make optional? */}
        //     sections={sections}
        // />
    }
}

export function buildDayTableModel(dateProfile: DateProfile, dateProfileGenerator: DateProfileGenerator) {
    let daySeries = new DaySeriesModel(dateProfile.renderRange, dateProfileGenerator)
    
    let breakOnWeeks = /year|month|week/.test(dateProfile.currentRangeUnit);
    debugger;
    let model = new DayTableModel(
        daySeries,false);

    // return new DayTableModel(
    //     daySeries,
    //     /year|month|week/.test(dateProfile.currentRangeUnit)
    // )
    return model;
}

export default createPlugin({

    views: {
        yearView: YearView,
        customView: TestView
    }
});