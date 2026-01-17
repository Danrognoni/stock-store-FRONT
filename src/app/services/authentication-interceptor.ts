import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('localhost:8080/api')) {
    const authReq = req.clone({
      withCredentials: true
    });
    return next(authReq);
  }
  return next(req);
};
