import {
  HttpErrorResponse, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Injectable} from "@angular/core";
import {AuthProvider} from "./auth";
import {App} from "ionic-angular";
import {Observable} from "rxjs/Rx";

/**
 * Created by boebel on 28.05.2018.
 */

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthProvider, public app: App) {
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      let header = {setHeaders: {Authorization: token}};
      return req.clone(header);
    }
    else {
      return req;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    //TODO Fix this
    let token = this.authService.getToken();

    return next.handle(this.addToken(req, token))
      .catch(error => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 401:
              return this.handle401Error(req, next);
            default:
              return Observable.throw(error);
          }
        }
        return Observable.throw(error);
      });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    console.log("Error 401");

    if (!this.isRefreshingToken) {
      console.log("IT IS NOT REFRESHING TOKEN");
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);

      if (this.authService.getRefreshToken()) {
        console.log("THERE IS A REFRESHTOKEN");
        return Observable.fromPromise(this.authService.renewToken())
          .switchMap((newToken: { id_token: string }) => {
            console.log("Right in refreshing");
            if (newToken) {
              console.log(newToken.id_token);
              this.tokenSubject.next(newToken.id_token);
              return next.handle(this.addToken(req, newToken.id_token));
            }
            return this.logoutUser("No new Token");
          })
          .catch(err => {
            return Observable.throw(err);
          })
          .finally(() => this.isRefreshingToken == false);

      } else {
        return Observable.throw("No Refreshtoken");
      }
    } else {
      return this.tokenSubject
        .filter(token => token != null)
        .take(1)
        .switchMap(token => {
          return next.handle(this.addToken(req, token));
        });
    }
  }

  logoutUser(text?: string) {
    return Observable.throw(`LOGOUT ${text}`);
  }
}
