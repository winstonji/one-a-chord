import {expect, jest, test} from '@jest/globals';
import { ChartService } from '../../services/chartService';
import { Chart } from '../../model/chart';
import { FakeChart, generateFakeChart} from '../testUtils/chartFaker';
import { Key } from '../../model/key';

//describe is used to wrap a block of related tests. We will add more describe blocks for other functionality, like a block for testing updating lyric segments.
describe("chartService::updateChord tests", () => {

    let chartService: ChartService;
    let fakeChart: FakeChart;

    //beforeEach runs before every single test() call. This resets the fakeChart for subsequent tests.
    beforeEach(() => {
        fakeChart = generateFakeChart();
        chartService = new ChartService(fakeChart.chart);
    });


    //test() runs a single test. This test obviously doesn't do anything, it's just an example.
    //All jest matchers are documented here: https://jestjs.io/docs/using-matchers
    test("checks if logic is real", () =>{
        expect(!false).toBe(true);
    });

    test("update a chord wrapper and check the backing string", () => {
        expect(fakeChart.getFirstChordWrapper().backingString).not.toEqual("A");
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
