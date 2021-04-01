import { Data } from './data/data';
import { Options } from './options/options';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class Chart {
    type: String;
    data: Data;
    options: Options;
    plugins: Array<typeof ChartDataLabels>;
  }