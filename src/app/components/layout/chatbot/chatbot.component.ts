import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
declare const chatBotJs: Function;

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  chatBotQue = ["Tell me something I don't know", "Tell me something funny", "Tell me a food fact", "Tell me a joke", "Tell me food trivia", "Tell me a fact about food"];
  question: string;
  answer: {};

  constructor(
    private _apiServices: ApiService,
  ) {

  }

  ngOnInit(): void {
    chatBotJs();
  }

  ngAfterViewInit() {
    chatBotJs();
    console.log(chatBotJs);
  }
  questionAfterReplace: string;
  flag = false;
  getQue(question) {

    this.questionAfterReplace = question.replace(/\s/g, '+');
    console.log(this.questionAfterReplace);
    let apiKey = "&apiKey=41cd200dd2e442978c0cb5d02e6e8fc1"
    this._apiServices
      .get(`food/converse?text=${this.questionAfterReplace}`, apiKey)
      .subscribe(
        (responseInfo) => {
          console.log(responseInfo);
          this.answer = responseInfo['answerText'];
          console.log(this.answer);
        },
        (err) => {
          console.log(err);
        }
      );
    this.flag = true;
  }


}
