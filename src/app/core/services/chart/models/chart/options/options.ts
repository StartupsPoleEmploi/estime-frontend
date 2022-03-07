import { Legend } from './legend/legend';
import { Plugins } from './plugins/plugins';
import { Layout } from './layout/layout';

export class Options {
    legend: Legend;
    plugins: Plugins;
    scales: Object;
    layout: Layout;
    responsive: boolean;
    maintainAspectRatio: boolean;
    aspectRatio: number;
}