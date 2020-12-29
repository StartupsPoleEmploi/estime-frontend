import { Component, OnInit } from '@angular/core';
import { Question } from '@app/commun/models/question';
import { QuestionService } from '@app/core/services/utile/question.service';

@Component({
  selector: 'app-section-questions',
  templateUrl: './section-questions.component.html',
  styleUrls: ['./section-questions.component.scss']
})
export class SectionQuestionsComponent implements OnInit {

  questions: Array<Question>;

  constructor(
    private questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  private loadQuestions():void {
    this.questions = this.questionService.getQuestions();
  }

}
