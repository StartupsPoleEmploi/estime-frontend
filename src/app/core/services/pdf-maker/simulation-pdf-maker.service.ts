
import { Injectable } from '@angular/core';
import { DemandeurEmploi } from "@models/demandeur-emploi";
import { Simulation } from '@app/commun/models/simulation';
import pdfMakeModule from 'pdfmake/build/pdfmake.min';
import pdfFontsModule from 'pdfmake/build/vfs_fonts';
import { ScreenService } from '../utile/screen.service';
import { BlockInformationsService } from "./content/bloc-informations.service";
import { BlockRessourcesEstimeesService } from "./content/block-ressources-estimees.service";
import { Style } from './models/style';
import { Text } from "./models/text";
import { BlockDonneesSaisiesService } from './content/block-donnees-saisies.service';
import { DeConnecteService } from '../demandeur-emploi-connecte/de-connecte.service';

pdfMakeModule.vfs = pdfFontsModule.pdfMake.vfs;


@Injectable({ providedIn: 'root' })
export class SimulationPdfMakerService {

  isExtraSmallScreen: boolean;
  imageBase64: any;

  constructor(
    private blockInformationsService: BlockInformationsService,
    private blockDonneesSaisiesService: BlockDonneesSaisiesService,
    private blockRessourcesEstimeesService: BlockRessourcesEstimeesService,
    private deConnecteService: DeConnecteService,
    private screenService: ScreenService
  ) {
    this.isExtraSmallScreen = this.screenService.isExtraSmallScreen();
  }

  public generatePdf(simulation: Simulation) {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();

    const def = {
      content: this.getContent(demandeurEmploiConnecte, simulation),
      styles: this.getStyles(),
      pageMargins: [40, 40, 40, 40],
      footer: function (currentPage, pageCount) { return { text: "Page " + currentPage.toString() + ' sur ' + pageCount, alignment: 'right', style: 'normalText', margin: [0, 20, 20, 0] }; }
    };

    if (this.isExtraSmallScreen) {
      pdfMakeModule.createPdf(def).download('estimation-reprise-activite-pole-emploi');
    } else {
      pdfMakeModule.createPdf(def).open();
    }
  }

  private getContent(demandeurEmploi: DemandeurEmploi, simulation: Simulation): any {
    let content = [];
    this.addTitle(content);
    this.blockDonneesSaisiesService.addBlockDonneesSaisies(content, demandeurEmploi);
    this.blockInformationsService.addBlockInformations(content);
    this.blockRessourcesEstimeesService.addElementTableMesRessourcesEstimees(content, simulation);
    return content;
  }

  private getStyles(): any {
    return {
      tableStyle1: {
        margin: [10, 0, 0, 10]
      },
      tableStyle2: {
        margin: [-5, 0, 0, 10]
      },
      tableStyle3: {
        margin: [0, 20, 0, 0]
      },
      tableStyle4: {
        margin: [0, 0, 0, 0]
      },
      tableStyle5: {
        margin: [10, 0, 0, 15]
      },
      tableStyle6: {
        margin: [0, 20, 0, 20]
      }
    };
  }

  private addTitle(content: Array<any>): void {
    const title = new Text();
    title.text = 'Résultat de ma simulation';

    const style = new Style();
    style.color = '#FF5950';
    style.fontSize = 24;
    title.style = style;

    title.margin = [0, 10, 0, 15];

    content.push(title);
  }

}