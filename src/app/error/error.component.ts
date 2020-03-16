
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  //selector: 'app-root',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})

export class ErrorComponent{
  //message = 'An unknown error occurred!';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}){} //USING MAT DIALOG DATA TOKEN to identify this data you're passing around
}
