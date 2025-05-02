import { HttpEvent, HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interceptor para agregar el token de autenticación a las solicitudes HTTP
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = sessionStorage.getItem('token'); // Obtiene el token almacenado en el sessionStorage
  if (token) {
    // Si el token existe, clona la solicitud y agrega el encabezado de autorización
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`) // Agrega el token en el encabezado 'Authorization'
    });
    return next(cloned); // Pasa la solicitud clonada al siguiente manejador
  } else {
    // Si no hay token, pasa la solicitud original sin modificar
    return next(req);
  }
};