/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Component, signal, ViewChild } from '@angular/core';
import { ChatService, ElectronService } from '../core/services';
import { ChatCompletionMessageParam } from 'openai/resources';
import Shared from '../../../app/shared';
import { sys } from 'typescript';
import { ToastrService } from 'ngx-toastr';
type alertInfo = { type: string; msg: string };


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @ViewChild('scroll', { static: true }) scroll: any;


  readonly STORE_KEY = 'Saved.Chats';
  alertInfo: alertInfo[] = [];
  shouldSave = false;

  messages = signal<ChatCompletionMessageParam[]>([
    { role: 'user', content: 'This is an example starter text.'},
    { role: 'assistant', content: 'This is an example starter text.'},
    { role: 'user', content: 'This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) This is an example starter text. CREATE src/app/example/example.component.scss (0 bytes) danie@Kells-Laptop CLANGARM64 /c/git/anthropic-playground (main) '},
    { role: 'assistant', content: 'This is an example starter text.'},
    { role: 'user', content: 'This is an example starter text.'},
    { role: 'assistant', content: 'This is an example starter text. This is an example starter text. This is an example starter text. This is an example starter text.'},
  ])
  newChatMessage = signal('');
  baseUrl = signal<string>('');
  apiKey = signal<string>('');
  model = signal<string>('');
  systemMessage = signal<string>('');
  modelToOpen = signal<string>('');
  savedChats = signal<string[]>([]);
  modelList: string[] = [];

  constructor(
    private toastr: ToastrService,
    private chatService: ChatService,
    private electronService: ElectronService) {
    chatService.OnMessages.subscribe((x) => {
      this.messages.set(x.filter((m) => m.role === 'assistant' || m.role === 'user' ));
      this.newChatMessage.set('')
      setTimeout(() => {
        this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
      }, 20);
    });


    this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.BASE_URL)
      .subscribe((x) => this.baseUrl.set(x));
    this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.API_KEY)
      .subscribe((x) => this.apiKey.set(x));
    this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.MODEL)
      .subscribe((x) => this.model.set(x));
    this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.SYSTEM_MESSAGE)
      .subscribe((x) => this.systemMessage.set(x));
    this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.MODEL_LIST)
      .subscribe((x) => this.modelList = x ? x.split(',').map((v) => v.trim()) : []);
    this.electronService
      .StoreGetKeys(this.STORE_KEY)
      .subscribe((x) => this.savedChats.set(x  || [] ));

  }

  checkEverythingIsGood() : boolean {
    const missingItems: string[] = [];

    if (this.apiKey() === undefined || this.apiKey().length === 0) {
      missingItems.push('The API key is not provided.  Set it in the AI configuration tab');
    }

    if (this.baseUrl() === undefined || this.baseUrl().length === 0) {
      missingItems.push('The base URL is not provided.  Set it in the AI configuration tab');
    }

    if (this.model() === undefined || this.model().length === 0) {
      missingItems.push('The model name is not provided.  Select here or on the AI configuration tab for a default');
    }

    if (this.systemMessage() === undefined || this.systemMessage().length === 0) {
      missingItems.push('The starting system message is not provided.  Set it in the AI configuration tab for the default or here');
    }

    if (missingItems.length > 0) {

      this.toastr.warning(missingItems.join('.  '), 'Missing Configuration');
      return false;
    } else {
      return true;
    }

  }
  modelNameChanged(target: any) {
    console.log('setting model name ' + JSON.stringify(target));
    console.log('setting model name ' + this.model());
    console.log('setting model name ' + target.value);
  }


  openModel(name: string) {
    this.modelToOpen.set(name);
    if (this.shouldSave) {
      this.saveChat();
    }

    this.electronService.StoreGet(this.STORE_KEY, name).subscribe((x: any) => {
      this.clear();
      const sysMsg = x.messages.find((m: ChatCompletionMessageParam) => m.role == 'system');
      if (sysMsg) {
        this.systemMessage.set(sysMsg.content);
      }
      this.chatService.setMessages(x.messages as ChatCompletionMessageParam[])
    })
  }
  clear() {
    this.chatService.clear();
    this.shouldSave = false;
  }

  saveChat() {
    const chatFreeze = {
      model: this.model(),
      messages: this.chatService.currentMessages,
    }
    this.shouldSave = false;
    this.electronService.StoreSet(this.STORE_KEY, Shared.formattedNow(), chatFreeze ).subscribe(() =>
      this.electronService
      .StoreGetKeys(this.STORE_KEY)
      .subscribe((x) => this.savedChats.set(x  || [] ))
    );

  }
  send() {

    if (!this.checkEverythingIsGood()) {
      return;
    }

    if (this.newChatMessage().length > 0) {
      console.log(` sending ${this.newChatMessage()}`);
      this.shouldSave = true;
      this.chatService.staticSend({
        modelName: this.model(),
        systemMessage: this.systemMessage(),
        apiKey: this.apiKey(),
        baseURL: this.baseUrl(),
        message: this.newChatMessage()
      });
      this.newChatMessage.set('...');
    }
  }
}
