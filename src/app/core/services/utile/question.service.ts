import { Injectable } from '@angular/core';
import { Question } from '@models/question';


@Injectable({providedIn: 'root'})
export class QuestionService {

  questions: Array<Question>;

  constructor() {
    this.initQuestions();
  }

  public getQuestions(): Array<Question> {
    return this.questions;
  }

  private initQuestions(): void {
    this.questions = new Array<Question>();

    const question1 = new Question();
    question1.question = "Puis-je continuer à percevoir l’Allocation de Solidarité Spécifique en reprenant un emploi ?";
    question1.reponse = "Les demandeurs d’emploi qui bénéficient de l’Allocation de Solidarité Spécifique peuvent, dans certaines limites, cumuler leur allocation avec les revenus d’une nouvelle activité professionnelle.<br><br>Estime est là pour vous aider à l’évaluer !"
    this.questions.push(question1);

    const question2 = new Question();
    question2.question = "Quels types d'aides existent ?";
    this.questions.push(question2);
  }
}