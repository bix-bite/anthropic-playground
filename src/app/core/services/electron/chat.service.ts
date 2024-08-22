import { Injectable } from '@angular/core';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  setMessages(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    this.currentMessages = messages;
    this.OnMessages.next(this.currentMessages);
  }
  openAI: OpenAI | undefined;
  modelName = '';
  systemMessage = ''

  OnMessages = new Subject<ChatCompletionMessageParam[]>();
  currentMessages: ChatCompletionMessageParam[] = [];

  private initChatIfNeeded(): ChatCompletionMessageParam[] {
    if (this.currentMessages.length === 0) {
      this.currentMessages.push({role: 'system', content: this.systemMessage});
    }
    return this.currentMessages;
  }

  clear() {
    this.currentMessages = [];
    this.openAI = undefined;
    this.OnMessages.next(this.currentMessages);
  }

  createModel(modelName: string, systemMessage: string, baseURL: string, apiKey: string) {
    this.openAI = new OpenAI({baseURL, apiKey, dangerouslyAllowBrowser: true});
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
      this.createModel(options.modelName, options.systemMessage, options.baseURL, options.apiKey);
    }
    this.initChatIfNeeded();
    this.send(options.message);
  }
  send(message: string) {
    this.initChatIfNeeded();
    this.currentMessages.push({role: 'user', content: message});
    this.OnMessages.next(this.currentMessages);
    if (this.openAI == undefined) {
      throw new Error('Model has not been created yet.  Call createModel first')
    }

    if (this.currentMessages.length > 21) {
      this.currentMessages = [
        this.currentMessages[0], ...this.currentMessages.slice(this.currentMessages.length - 19)
      ];
    }

    this.openAI.chat.completions.create( { messages : this.currentMessages,  max_tokens: 4096, model: this.modelName}).then(
      (value) => {
        this.currentMessages.push(value.choices[0].message);
        this.OnMessages.next(this.currentMessages);
      },
      () => {
         console.log('hmm')
      }
    )
  }




}
