import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private file: string;      
  public leerFicheroExcel(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const exc = event.target.files[0];
      reader.readAsText(exc);
      
      reader.onload = () => {
        this.file = reader.result.toString();

        //Con una libreria alasql  libreria de javaScript  que te devuelve un Objeto excel

        //Vamos a comvertir el string a objeto
        //let obj = JSON.parse(this.file);
        console.log(this.file);
      };
    }
  }
}
