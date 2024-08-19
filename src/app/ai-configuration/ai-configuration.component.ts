import { Component, signal } from '@angular/core';
import { ElectronService } from '../core/services';
import Shared from '../../../app/shared';


@Component({
  selector: 'app-ai-configuration',
  templateUrl: './ai-configuration.component.html',
  styleUrl: './ai-configuration.component.scss'
})
export class AiConfigurationComponent {

  constructor(private electronService: ElectronService) {
    this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.ANTHROPIC_KEY)
      .subscribe((x) => this.anthropicKey.set(x));
      this.electronService
      .StoreGet(Shared.keys.STORE, Shared.keys.OPENAI_KEY)
      .subscribe((x) => this.openAiKey.set(x));

  }
  anthropicKey = signal<string>('');
  openAiKey = signal<string>('');
  openedAccordian = signal<number>(0);

  saveAnthropicKey() {
    this.electronService
      .StoreSet(Shared.keys.STORE, Shared.keys.ANTHROPIC_KEY, this.anthropicKey())
      .subscribe(() => {});
  }
  saveOpenAiKey() {
    this.electronService
      .StoreSet(Shared.keys.STORE, Shared.keys.OPENAI_KEY, this.openAiKey())
      .subscribe(() => {});
  }
}
