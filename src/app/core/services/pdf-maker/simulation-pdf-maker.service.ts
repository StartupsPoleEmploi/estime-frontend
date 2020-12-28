
import { Injectable, Testability } from '@angular/core';
import { DemandeurEmploi } from "@models/demandeur-emploi";
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import pdfMakeModule from 'pdfmake/build/pdfmake';
import pdfFontsModule from 'pdfmake/build/vfs_fonts';
import { BlockRessourcesEstimeesService } from "./content/block-ressources-estimees.service";
import { BlockInformationsService } from "./content/bloc-informations.service";
import { Text } from "./models/text";
import { Style } from './models/style';
import { DetailAidesEligiblesService } from "./content/detail-aides-eligibles";

pdfMakeModule.vfs = pdfFontsModule.pdfMake.vfs;


@Injectable({ providedIn: 'root' })
export class SimulationPdfMakerService {

  imageBase64: any;

  constructor(
    private blockInformationsService: BlockInformationsService,
    private blockRessourcesEstimeesService: BlockRessourcesEstimeesService,
    private detailAidesEligiblesService:DetailAidesEligiblesService
  ) {

  }

  public generatePdf(demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales) {

    const def = {
      content: this.getContent(demandeurEmploi, simulationAidesSociales),
      styles: this.getStyles(),
      pageMargins: [ 20, 40, 20, 40 ],
      footer: function(currentPage, pageCount) { return { text: "Page " + currentPage.toString() + ' sur ' + pageCount, alignment: 'right', style: 'normalText', margin: [0, 20, 20, 0] }; }
    };

    pdfMakeModule.createPdf(def).open();
  }

  private getContent(demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): any {
    let content = [];
    this.addLogoEstime(content);
    this.addTitle(content);
    this.blockInformationsService.addBlockInformations(content);
    this.blockRessourcesEstimeesService.addElementTableMesRessourcesEstimees(content, demandeurEmploi, simulationAidesSociales);
    this.addTextAvertissement(content);
    this.detailAidesEligiblesService.addPagesDetailAides(content, simulationAidesSociales);
    return content;
  }

  private getStyles(): any {
    return {
      tableStyle1: {
        margin: [10, 0, 0, 10]
      },
      tableStyle3: {
        margin: [0, 10, 0, 0]
      },
      tableStyle4: {
        margin: [0, 0, 0, 0]
      }
    };
  }

  private addLogoEstime(content: Array<any>): void {
    content.push({
      image: 'data:image/png;base64,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',
      width: 200,
      height: 57
		});
  }

  private addTitle(content: Array<any>): void {
    const title = new Text();
    title.text = 'Résultat de ma simulation';

    const style = new Style();
    style.color = '#1B2B67';
    style.fontSize = 24;
    title.style = style;

    title.margin = [0, 10, 0, 15];

    content.push(title);
  }

  private addTextAvertissement(content: Array<any>): void {
    const text = new Text();
    text.text = 'Les montants n\'ont qu\'une valeur indicative. Ils dépendent des informations que vous avez renseignées, sous réserve d\'éventuels changements de votre situation personnelle ou de la règlementation des aides.';

    const style = new Style();
    style.color = '#23333C';
    style.fontSize = 11;
    text.style = style;
    text.margin = [0, 15, 0, 0];

    content.push(text);
  }


}