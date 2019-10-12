import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { Fichaje } from './models/fichaje';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private fichajes: Fichaje[] = []; 
  public fichajesFiltrados: Fichaje[] = [];
  public monthFilter: string;

  public leerFicheroExcel(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const exc = event.target.files[0];
      reader.readAsText(exc);
      
      reader.onload = () => {
        const file = reader.result.toString();
        
        const workbook = XLSX.read(file, {type:'string'});
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.fichajes = this.transformJsonData(jsonData);
        this.fichajesFiltrados = this.fichajes;
      };
    }
  }

  private transformJsonData(items: any[]): Fichaje[] {
    return items.map(item => {
      const values: any[] = Object.values(item);
      return {
        dn: values[1],
        uid: values[2],
        name: values[3],
        status: values[4],
        action: values[5],
        apb: values[6],
        jobcode: values[7],
        date: new Date(Math.round((values[8] - 25569)*86400*1000)),
      };
    });
  } 

  public filterMonths(){
    console.log("filtrando por ", this.monthFilter);
    this.fichajesFiltrados = this.fichajes.filter(item => item.date.getMonth() === parseInt(this.monthFilter));
  }  

}
