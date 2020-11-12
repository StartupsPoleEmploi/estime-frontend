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
    question1.question = "Est-ce que je peux continuer à toucher des allocations chômage en retravaillant ?";
    question1.reponse = "C'est possible de bénéficier d'un complément d'ARE quand on retravaille, selon le nouveau salaire.<br><br>Estime va vous aider à visualiser tout cela."
    this.questions.push(question1);

    const question2 = new Question();
    question2.question = "Quels types d'aides existent ?";
    question2.reponse = "En fonction du contrat et de votre situation, il existe des aides à la mobilité, à la garde d'enfants, la prime d'activité...<br><br>Estime va vous aider à y voir plus clair."
    this.questions.push(question2);
  }
}