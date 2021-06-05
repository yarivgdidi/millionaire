import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionerComponent } from './pages/questioner/questioner/questioner.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'questioner',
    component: QuestionerComponent,
    data: { title: 'Questioner' }
  },
  { path: '',
    redirectTo: '/questioner',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
