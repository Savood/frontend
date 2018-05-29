import {
  HttpErrorResponse, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AuthProvider} from "./auth";
/**
 * Created by boebel on 28.05.2018.
 */

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthProvider) {
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    let header = {setHeaders: {Authorization: 'Bearer ' + token}}
    return req.clone(header)
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    return next.handle(this.addToken(req, this.authService.getAuthToken()))
      .catch(error => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              return this.handle400Error(error, next);
            case 401:
              return this.handle401Error(req, next);
          }
        } else {
          return Observable.throw(error);
        }
      });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authService.refreshToken()
        .switchMap((newToken: string) => {
          if (newToken) {
            this.tokenSubject.next(newToken);
            return next.handle(this.addToken(this.getNewRequest(req), newToken));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        })
        .catch(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser();
        })
        .finally(() => {
          this.isRefreshingToken = false;
        });
    } else {
      return this.tokenSubject
        .filter(token => token != null)
        .take(1)
        .switchMap(token => {
          return next.handle(this.addToken(req, token));
        });
    }
  }

  handle400Error(req:HttpRequest<any>, next: HttpHandler){
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    //TODO send back to login
    return Observable.throw("");
  }
}
