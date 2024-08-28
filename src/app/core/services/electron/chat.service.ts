import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  openAI: OpenAI | undefined;
  modelName = '';
  systemMessage = '';

  OnMessages = new Subject<ChatCompletionMessageParam[]>();
  currentMessages: ChatCompletionMessageParam[] = [];

  constructor(private http: HttpClient) {}

  imageFromPrompt(prompt: string, apiKey: string): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: `bearer ${apiKey}`,
    });

    const formData = new FormData();
    formData.append('prompt', prompt);
    return this.http
      .post(
        'https://api.deepinfra.com/v1/inference/Lykon/DreamShaper',
        formData,
        { headers }
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .pipe(map((response: any) => response.images[0] as string));
  }

  setMessages(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    this.currentMessages = messages;
    this.OnMessages.next(this.currentMessages);
  }

  private initChatIfNeeded(): ChatCompletionMessageParam[] {
    if (this.currentMessages.length === 0) {
      this.currentMessages.push({
        role: 'system',
        content: this.systemMessage,
      });
    }
    return this.currentMessages;
  }

  clear() {
    this.currentMessages = [];
    this.openAI = undefined;
    this.OnMessages.next(this.currentMessages);
  }

  createModel(
    modelName: string,
    systemMessage: string,
    baseURL: string,
    apiKey: string
  ) {
    this.openAI = new OpenAI({
      baseURL,
      apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.modelName = modelName;
    this.systemMessage = systemMessage;
  }

  staticSend(options: {
    modelName: string;
    systemMessage: string;
    baseURL: string;
    apiKey: string;
    message: string;
  }) {
    if (this.openAI === undefined) {
      this.createModel(
        options.modelName,
        options.systemMessage,
        options.baseURL,
        options.apiKey
      );
    }
    this.initChatIfNeeded();
    this.send(options.message);
  }
  send(message: string) {
    this.initChatIfNeeded();
    this.currentMessages.push({ role: 'user', content: message });
    this.OnMessages.next(this.currentMessages);
    if (this.openAI == undefined) {
      throw new Error(
        'Model has not been created yet.  Call createModel first'
      );
    }

    if (this.currentMessages.length > 31) {
      this.currentMessages = [
        this.currentMessages[0],
        ...this.currentMessages.slice(this.currentMessages.length - 29),
      ];
    }

    this.openAI.chat.completions
      .create({
        messages: this.currentMessages,
        max_tokens: 4096,
        model: this.modelName,
      })
      .then(
        (value) => {
          this.currentMessages.push(value.choices[0].message);
          this.OnMessages.next(this.currentMessages);
        },
        () => {
          console.log('hmm');
        }
      );
  }
}
