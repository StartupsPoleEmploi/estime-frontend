
import { Injectable } from '@angular/core';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { DemandeurEmploi } from "@models/demandeur-emploi";
import pdfMakeModule from 'pdfmake/build/pdfmake';
import pdfFontsModule from 'pdfmake/build/vfs_fonts';
pdfMakeModule.vfs = pdfFontsModule.pdfMake.vfs;

@Injectable({ providedIn: 'root' })
export class SimulationPdfMakerService {

  imageBase64: any;

  constructor(
  ) {

  }

  public generatePdf(demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales) {

    const def = {
      content: [
        this.addTitle(),
        this.drawCard(),
        this.addInformationsText()

      ]
      ,

      styles: {
        text: {
          color: '#23333C',
          fontSize: 13,
        },
        title: {
          bold: true,
          color: '#23333C',
          fontSize: 22,
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        }
      }

    };
    pdfMakeModule.createPdf(def).open();
  }

  private addTitle(): any {
    return { text: 'Résultat de ma simulation', style: 'title', margin: [0, 0, 0, 20] };
  }

  private drawCard(): any {
    return {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 510,
          h: 50,
          r: 5,
          lineColor: 'black',
        },
      ]
    }
  }

  private addInformationsText(): any {
    return {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: [
          [
            {
              text: 'Le montant total de la simulation ne prend pas en compte les allocations logement, familiales, autres ressources du foyer et le prélèvement à la source.'
            }
          ]
        ]
      },
      layout: 'headerLineOnly',
      absolutePosition: { x: 45, y: 95 }
    }
  }

}