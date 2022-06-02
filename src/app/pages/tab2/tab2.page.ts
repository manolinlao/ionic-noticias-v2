import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from '../../service/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  public selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  constructor(private newsService: NewsService) {}
  ngOnInit(): void {
    this.newsService
      .getTopHeadLinesByCategory(this.selectedCategory)
      .subscribe((articles) => {
        this.articles = [...articles];
      });
  }

  segmentChanged(event: any) {
    this.selectedCategory = event.detail.value;
    console.log('segmentChanged', event.detail.value);
    this.newsService
      .getTopHeadLinesByCategory(this.selectedCategory)
      .subscribe((articles) => {
        console.log(articles);
        this.articles = [...articles];
      });
  }

  loadData() {
    this.newsService
      .getTopHeadLinesByCategory(this.selectedCategory, true)
      .subscribe((articles) => {
        this.articles.push(...articles);
        if (articles.length === 0) {
          this.infiniteScroll.disabled = true;
          this.infiniteScroll.complete();
          return;
        }
        this.infiniteScroll.complete();

        /*
        // detectar que ya no hay más datos nuevos
        if (articles.length === this.articles.length) {
          this.infiniteScroll.disabled = true;
          // event.target.disabled = true;
          return;
        }

        this.articles = articles;
        this.infiniteScroll.complete();
        // event.target.complete();
        */
      });
  }
}
