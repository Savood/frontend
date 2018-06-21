import {
  HttpErrorResponse, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Injectable} from "@angular/core";
import {AuthProvider} from "./auth";
import {App, NavController} from "ionic-angular";
import {Token} from "../../models/token";
import {Observable} from "rxjs/rx/Observable";

/**
 * Created by boebel on 28.05.2018.
 */

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthProvider, public app:App) {

  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    let header = {setHeaders: {Authorization: 'Bearer ' + token}};
    let req_erg = req.clone(header);
    console.log(typeof(req_erg));
    return req_erg;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    //TODO Fix this
    console.log("Intercepting");
    return next.handle(req);
    // let token = this.authService.getToken();
    // return next.handle(this.addToken(req, token))
//       .catch(error => {
//         console.log("Error", error)
// ;
//
//         if (error instanceof HttpErrorResponse) {
//           switch ((<HttpErrorResponse>error).status) {
//             case 401:
//               return this.handle401Error(req, next);
//           }
//         } else {
//           return next.handle(req);
//         }
//       });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    console.log("401 Error");

      if (!this.isRefreshingToken) {
          this.isRefreshingToken = true;

          // Reset here so that the following requests wait until the token
          // comes back from the refreshToken call.
          this.tokenSubject.next(null);

          return this.authService.refreshToken()
            .switchMap((newToken:Token) => {
              console.log("new_token", newToken);
              if (newToken) {
                this.tokenSubject.next(newToken.id_token);
                return next.handle(this.addToken(req, newToken.id_token));
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
    return Observable.throw('Error');
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    //TODO send back to login
    return Observable.throw("");
  }
}
