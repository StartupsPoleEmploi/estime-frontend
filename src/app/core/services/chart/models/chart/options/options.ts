import { Legend } from './legend/legend';
import { Plugins } from './plugins/plugins';
import { Scales } from './scales/scales';
import { Layout } from './layout/layout';

export class Options {
    legend : Legend;
    plugins: Plugins;
    scales: Scales;
    layout: Layout;
    responsive: boolean;
    maintainAspectRation: boolean;
    aspectRatio: number;
}