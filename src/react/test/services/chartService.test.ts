import {expect, jest, test} from '@jest/globals';
import { ChartService } from '../../services/chartService';
import { Chart } from '../../model/chart';
import { FakeChart, generateFakeChart} from '../testUtils/chartFaker';
import { Key } from '../../model/key';

//describe is used to wrap a block of related tests. We will add more describe blocks for other functionality, like a block for testing updating lyric segments.
describe("chartService::updateChord tests", () => {

    let chartService: ChartService;
    let fakeChart: FakeChart;

    //beforeAll runs a single time before any tests run in the current describe block.
    beforeAll(() => {

        //This is setting up a mock for the setChart function inside of chartService.
        //This is so we can control it and override the behaviour, since it's expecting a react hook.
        const setChartMock = jest.fn();
        setChartMock.mockImplementation((updateFn: (chart: Chart) => Chart) => {
            fakeChart.chart = updateFn(fakeChart.chart);
        });

        chartService = new ChartService(setChartMock);
    });


    //beforeEach runs before every single test() call. This resets the fakeChart for subsequent tests.
    beforeEach(() => {
        fakeChart = generateFakeChart();
    });


    //test() runs a single test. This test obviously doesn't do anything, it's just an example.
    //All jest matchers are documented here: https://jestjs.io/docs/using-matchers
    test("checks if logic is real", () =>{
        expect(!false).toBe(true);
    });

    test("update a chord wrapper and check the backing string", () => {
        chartService.updateChord(fakeChart.getFirstChordWrapper(), "A");
        expect(fakeChart.getFirstChordWrapper().backingString).toEqual("A");
    });

    test("update a chord wrapper and check the root", () => {
        expect(fakeChart.getFirstChordWrapper().root).not.toEqual("Gb");
        chartService.updateChord(fakeChart.getFirstChordWrapper(), "Gb");
        expect(fakeChart.getFirstChordWrapper().root).toEqual(Key.Gb);
    });

    test("update a chord wrapper and check the quality", () => {
        chartService.updateChord(fakeChart.getFirstChordWrapper(), "Gbmaj");
        expect(fakeChart.getFirstChordWrapper().quality).toEqual("maj");
    });
});
