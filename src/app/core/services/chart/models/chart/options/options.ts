import { Legend } from './legend/legend';
import { Plugins } from './plugins/plugins';
import { Scales } from './scales/scales';

export class Options {
    legend : Legend;
    plugins: Plugins;
    scales: Scales;
    responsive: Boolean;
    maintainAspectRation: Boolean;
    aspectRatio: Number;
}