import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponentComponent } from './home/home-component/home-component.component';

import { LoginComponent } from './autenticacion/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

import { SelCajaHistorialComponent } from './amarre-caja/sel-caja-historial/sel-caja-historial.component';

import { InsCajaComponent } from './amarre-caja/ins-caja/ins-caja.component';

const routes: Routes = [
    { path: 'home', component: SelCajaHistorialComponent, canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: 'login/:usuarioBpro', component: LoginComponent },


    /*****************************************RUTAS DE AMARRE DE CAJA **************************/
    { path: 'ins-caja', component: InsCajaComponent },
    { path: 'sel-caja-historial', component: SelCajaHistorialComponent },

    { path: '**', component: SelCajaHistorialComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
  }
