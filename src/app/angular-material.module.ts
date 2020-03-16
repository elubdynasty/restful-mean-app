
import {NgModule} from '@angular/core';
import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule,MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  exports: [ //to be usable in another module (need to be re-exported)
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})



export class AngularMaterialModule{

}
