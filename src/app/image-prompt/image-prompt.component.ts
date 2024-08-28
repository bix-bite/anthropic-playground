import { Component, signal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ChatService, ElectronService } from '../core/services';
import Shared from '../../../app/shared';

@Component({
  selector: 'app-image-prompt',
  templateUrl: './image-prompt.component.html',
  styleUrl: './image-prompt.component.scss'
})
export class ImagePromptComponent {

  apiKey = '';
  imagePrompt = signal('');
  imageSrc: string | undefined;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private chatService: ChatService,
    private electronService: ElectronService
  ) {


    this.electronService.StoreGet(Shared.keys.STORE, Shared.keys.API_KEY)
      .subscribe((x) => this.apiKey = x)
  }


  send() {
      this.chatService.imageFromPrompt(this.imagePrompt(), this.apiKey).subscribe((x) => {
        this.imageSrc = x;
      })
  }
}
