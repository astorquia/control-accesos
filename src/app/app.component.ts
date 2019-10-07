import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

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
        
        const workbook = XLSX.read(this.file, {type:'string'});
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log(jsonData);
        // console.log(this.file);
      };
    }
  }
}
