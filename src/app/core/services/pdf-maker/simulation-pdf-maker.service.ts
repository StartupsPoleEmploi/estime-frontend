
import { Injectable } from '@angular/core';
import { DemandeurEmploi } from "@models/demandeur-emploi";
import { Simulation } from '@app/commun/models/simulation';
import pdfMakeModule from 'pdfmake/build/pdfmake.min';
import pdfFontsModule from 'pdfmake/build/vfs_fonts';
import { ScreenService } from '../utile/screen.service';
import { BlockInformationsService } from "./content/bloc-informations.service";
import { BlockRessourcesEstimeesService } from "./content/block-ressources-estimees.service";
import { DetailAidesEligiblesService } from "./content/detail-aides-eligibles";
import { Style } from './models/style';
import { Text } from "./models/text";
import { BlockDonneesSaisiesService } from './content/block-donnees-saisies-service';
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
    private detailAidesEligiblesService: DetailAidesEligiblesService,
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
      pdfMakeModule.createPdf(def).download('simulation-estime-pole-emploi');
    } else {
      pdfMakeModule.createPdf(def).open();
    }
  }

  private getContent(demandeurEmploi: DemandeurEmploi, simulation: Simulation): any {
    let content = [];
    this.addLogoEstime(content);
    this.addTitle(content);
    this.blockDonneesSaisiesService.addBlockDonneesSaisies(content, demandeurEmploi);
    this.blockInformationsService.addBlockInformations(content);
    this.blockRessourcesEstimeesService.addElementTableMesRessourcesEstimees(content, simulation);
    this.detailAidesEligiblesService.addPagesDetailAides(content, simulation);
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
        margin: [0, 10, 0, 0]
      },
      tableStyle4: {
        margin: [0, 0, 0, 0]
      },
      tableStyle5: {
        margin: [10, 0, 0, 30]
      },
    };
  }

  private addLogoEstime(content: Array<any>): void {
    content.push({
      image: 'data:image/png;base64,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',
      width: 153,
      height: 60
    });
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