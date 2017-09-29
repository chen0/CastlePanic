import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { TestComponent } from './test/test.component';

let routes: Routes = [
    { path: 'lobby/:id', component: CreateComponent },
    { path: 'test', component: TestComponent }, 
    { path: '', component: IndexComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
})
export class AppRoutingModule { }

export const routingComponents = [CreateComponent, TestComponent, IndexComponent];
