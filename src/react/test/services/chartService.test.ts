import {expect, jest, test} from '@jest/globals';
import { ChartService } from '../../services/chartService';
import { Chart } from '../../model/chart';
import { fakeChart } from '../testUtils/chartFaker';

describe("chartService::updateChord tests", () => {

    let chartService: ChartService;
    let chart;

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
        chartService.updateChord()
    })
});
