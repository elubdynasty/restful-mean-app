//validator that validates the img mime-type if
//this is e.g (.jpg or .png)
//Logic behind this validator
import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of} from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => { //async validator that wraps with promises/observable (Generic type).
  if(typeof(control.value)==='string'){
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    //rxjs gives something w/c allows the coder to convert this into observable. Thus, u can create Observable from scratch
    //this observer is simply a tool you use to control when observable emits new data
    fileReader.addEventListener("loadend", () => { //equiv to fileReader.onloadend()
      //MIME type validation
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4); //allows us to access or to read certain patterns in the file but also in the form metadata that we can then use to parse the MIME type
      let header = "";
      let isValid = false;

      for(let i=0; i < arr.length; i++){
        //extract some info on the arr
        header += arr[i].toString(16); //convert this lists of array into hexadecimal string
      }

      switch(header){
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if(isValid){
        observer.next(null); //to emit a new value
      } else{
        observer.next( {invalidMimeType: true} );
      }
      observer.complete(); //letting subscribers know that these observers are done
    });;
    fileReader.readAsArrayBuffer(file); //allow to access the mimeType
  });
  return frObs;
};
