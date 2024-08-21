/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Component, signal } from '@angular/core';
import { ElectronService } from '../core/services';
import Shared from '../../../app/shared';

@Component({
  selector: 'app-ai-configuration',
  templateUrl: './ai-configuration.component.html',
  styleUrl: './ai-configuration.component.scss',
})
export class AiConfigurationComponent {
  baseUrl = signal<string>('');
  apiKey = signal<string>('');
  model = signal<string>('');
  modelList = signal<string>('');
  systemMessage = signal<string>('');

  constructor(private electronService: ElectronService) {
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
      .subscribe((x) => this.systemMessage.set(x && x.length > 0 ? x : 'Respond as a casual chat partner' ));
      this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.MODEL_LIST)
      .subscribe((x) => this.modelList.set(x && x.length > 0 ? x : 'Sao10K/L3-70B-Euryale-v2.1,cognitivecomputations/dolphin-2.9.1-llama-3-70b,meta-llama/Meta-Llama-3.1-70B-Instruct' ));

  }

  saveSettings() {
    this.electronService
      .StoreSet(Shared.keys.STORE, Shared.keys.BASE_URL, this.baseUrl())
      .subscribe(() => {});
    this.electronService
      .StoreSet(Shared.keys.STORE, Shared.keys.MODEL, this.model())
      .subscribe(() => {});
    this.electronService
      .StoreSet(Shared.keys.STORE, Shared.keys.API_KEY, this.apiKey())
      .subscribe(() => {});
    this.electronService
      .StoreSet(Shared.keys.STORE, Shared.keys.SYSTEM_MESSAGE, this.systemMessage())
      .subscribe(() => {});
    this.electronService
      .StoreSet(Shared.keys.STORE, Shared.keys.MODEL_LIST, this.modelList())
      .subscribe(() => {});


  }
}
