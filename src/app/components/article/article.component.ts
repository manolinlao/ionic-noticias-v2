import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import {
  ActionSheetButton,
  ActionSheetController,
  Platform,
} from '@ionic/angular';

import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @Input() indexArticle: number;
  @Input() article: Article;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  openArticle() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
    } else {
      window.open(this.article.url, '_blank');
    }
  }

  async openMenu() {
    console.log('openMenu');

    const normalBtns: ActionSheetButton[] = [
      {
        text: 'Favorito',
        icon: 'heart-outline',
        handler: () => this.onToggleFavorite(),
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
      },
    ];

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle(),
    };

    // if (this.platform.is('capacitor')) {
    if (true) {
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: normalBtns,
    });

    await actionSheet.present();
  }

  onShareArticle() {
    const { title, source, url } = this.article;

    console.log('share article');
    this.socialSharing.share(title, source.name, null, url);
  }

  onToggleFavorite() {
    console.log('toggle favorite');
    this.storageService.saveRemoveArticle(this.article);
  }
}
