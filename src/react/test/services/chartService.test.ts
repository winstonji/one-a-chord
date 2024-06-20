import {expect, jest, test} from '@jest/globals';
import { ChartService } from '../../services/chartService';
import { Chart } from '../../model/chart';
import { fakeChart } from '../testUtils/chartFaker';
import { ChordWrapper } from '../../model/chordWrapper';

describe("chartService::updateChord tests", () => {

    let chartService: ChartService;
    let chart: Chart;

    beforeAll(() => {
        const setChartMock = jest.fn();
        setChartMock.mockImplementation((updateFn: (chart: Chart) => Chart) => {
            chart = updateFn(chart);
        })

        chartService = new ChartService(setChartMock);
    });

    beforeEach(() => {
        chart = fakeChart();
    });

    test("checks if logic is real", () =>{
        expect(!false).toBe(true);
    });

    test("update a chord wrapper", () => {
        const chordWrapperToUpdate:ChordWrapper = chart.blocks[0].children[0].children[0];
        chartService.updateChord("A", chordWrapperToUpdate);
        const updatedChordWrapper:ChordWrapper = chart.blocks[0].children[0].children[0];
        expect(updatedChordWrapper.backingString).toEqual("A");
    });
});
