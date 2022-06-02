/* eslint-disable curly */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Article,
  NewsResponse,
  ArticlesByCategoryAndPage,
} from '../interfaces/index';
import { map } from 'rxjs/operators';

import { storedArticlesByCategory } from '../data/mock-news';

const apiKey = environment.apikey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  /**
   *Estructura de datos para mantener los artículos
   *
   **/
  /*
  private articlesByCategory = {
    business: {
      page: 0,
      articles: [],
    },
    health: {
      page: 0,
      articles: [],
    },
  };
  */

  //USA DATA LOCAL
  //private articlesByCagetoryAndPage: ArticlesByCategoryAndPage = {};
  private articlesByCagetoryAndPage: ArticlesByCategoryAndPage =
    storedArticlesByCategory;

  constructor(private http: HttpClient) {}

  private executeQuery<T>(endpoint: string) {
    console.log('peticion HTTP realizada');
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey,
        country: 'us',
      },
    });
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (Object.keys(this.articlesByCagetoryAndPage).includes(category)) {
      // ya existe
    } else {
      // no existe
      this.articlesByCagetoryAndPage[category] = {
        page: 0,
        articles: [],
      };
    }

    const page = this.articlesByCagetoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(
      `/top-headlines?category=${category}&page=${page}`
    ).pipe(
      map(({ articles }) => {
        if (articles.length === 0) return [];

        this.articlesByCagetoryAndPage[category] = {
          page: page,
          articles: [
            ...this.articlesByCagetoryAndPage[category].articles,
            ...articles,
          ],
        };
        return this.articlesByCagetoryAndPage[category].articles;
      })
    );
  }

  getTopHeadLines(): Observable<Article[]> {
    return this.getTopHeadLinesByCategory('business');
    /*
    return this.http
      .get<NewsResponse>(
        `https://newsapi.org/v2/top-headlines?country=us&category=business`,
        {
          params: {
            apiKey,
          },
        }
      )
      .pipe(map(({ articles }) => articles));
      */
  }

  getTopHeadLinesByCategory(
    category: string,
    loadMore: boolean = false
  ): Observable<Article[]> {
    //USA DATA LOCAL
    return of(this.articlesByCagetoryAndPage[category].articles);

    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    //puede se que no quiera cargar más pero que no haya nada en memoria, he de retornar un Observable de Article[]
    //vamos a crear un objservable basado en data
    if (this.articlesByCagetoryAndPage[category]) {
      return of(this.articlesByCagetoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }
}
