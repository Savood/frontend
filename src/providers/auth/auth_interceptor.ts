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
    let header = {setHeaders: {Authorization: token}};
    return req.clone(header);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    //TODO Fix this
    let token = this.authService.getToken();

    return next.handle(this.addToken(req, token)).catch(error => {
      if (error instanceof HttpErrorResponse) {
        if ((<HttpErrorResponse>error).status == 401)
          return this.handle401Error(req, next);
        else {
          return next.handle(req);
        }
      } else {
        return next.handle(req);
      }
    });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    console.log("401 Error");

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);

      if (this.authService.getRefreshToken()) {
        this.authService.renewToken().then((token: { id_token: string }) => {
          if (token) {
            this.tokenSubject.next(token.id_token);
            this.isRefreshingToken = false;
            return next.handle(this.addToken(req, token.id_token));
          } else {
            this.isRefreshingToken = false;
            return this.logoutUser();
          }
        });
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

  handle400Error(req: HttpRequest<any>, next: HttpHandler) {
    return Observable.throw('Error');
  }

  logoutUser() {
    //TODO send back to login
    return Observable.throw("");
  }
}
