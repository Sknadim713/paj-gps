import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('./drawer/login/login-routing.module').then((m) => m.LoginPageRoutingModule),
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./drawer/drawer.module').then((m) => m.DrawerPageModule),
  },


  {
    path: 'map',
    loadChildren: () =>
      import('./drawer/map/map-routing.module').then(
        (m) => m.MapPageRoutingModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
