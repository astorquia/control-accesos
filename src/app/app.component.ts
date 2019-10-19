import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { Fichaje } from './models/fichaje';
import { Registro, RegistroDia, Dia } from './models/registro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public registros: Registro[] = [];
  public UIDFilter: string;
  public monthFilter = "-1";
  public registroActivo: Registro;
  public registrosFiltro: RegistroDia[];

  public leerFicheroExcel(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const exc = event.target.files[0];
      reader.readAsText(exc);

      reader.onload = () => {
        const file = reader.result.toString();

        const workbook = XLSX.read(file, { type: 'string' });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.registros = this.getRegistros(this.transformJsonData(jsonData));
        this.UIDFilter = this.registros[0].uid.toString();
        this.filterUID();
        this.filterMonths();
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
        date: new Date(Math.round((values[8] - 25569) * 86400 * 1000)),
      };
    });
  }

  private getRegistros(fichajes: Fichaje[]): Registro[] {
    const fichajesUID: Map<number, Fichaje[]> = new Map();
    fichajes.forEach(fichaje => {
      const registro = fichajesUID.get(fichaje.uid);
      if (registro == null) {
        fichajesUID.set(fichaje.uid, [fichaje]);
      } else {
        registro.push(fichaje);
      }
    });
    return [...fichajesUID.values()].map(fichajes => {
      return {
        uid: fichajes[0].uid,
        name: fichajes[0].name,
        registros: this.getRegistrosDia(fichajes.map(fichaje => fichaje.date)),
      }
    });
  }

  private getRegistrosDia(fechas: Date[]): RegistroDia[] {
    const registros: RegistroDia[] = [];
    fechas.forEach(fecha => {
      const dia: Dia = {
        ano: fecha.getFullYear(),
        mes: fecha.getMonth(),
        dia: fecha.getDate(),
      };
      const diaActivo = registros.find(item => JSON.stringify(item.dia) === JSON.stringify(dia));
      if (diaActivo != null) {
        diaActivo.horas.push(fecha);
      } else {
        registros.push({
          dia: dia,
          horas: [fecha]
        });
      }
    });
    return registros;
  }

  public filterMonths() {
    console.log("filtrando mes por ", this.monthFilter);
    const mes = parseInt(this.monthFilter, 10);
    if (mes === -1) {
      this.registrosFiltro = this.registroActivo.registros;
    } else {
      this.registrosFiltro = this.registroActivo.registros
        .filter(item => item.dia.mes === mes);
    }
  }

  public filterUID() {
    this.registroActivo = this.registros.find(registro => registro.uid === parseInt(this.UIDFilter, 10));
    this.registrosFiltro = this.registroActivo.registros;
    console.log("filtrando id por ", this.UIDFilter);
  }

  public getSumHoras(horas: Date[]): number | undefined {
    if (!(horas.length % 2 === 0) || horas.length === 0) {
      return undefined;
    }
    let grupos: number[] = [];
    for (let i = 0; i < horas.length; i++) {
      const date1 = horas[i];
      const date2 = horas[i + 1];
      grupos.push(this.hoursDifference(date1, date2));
      i++;
    }
    return grupos.reduce((a, b) => a + b, 0);
  }

  private hoursDifference(first: Date, last: Date): number {
    const diff = last.getTime() - first.getTime();
    return diff / 1000 / 60 / 60;
  }

  getMonthName(month: number): string {
    const names = ["Enero", "Febrero", "Marzo", "Abril", "Mayo",
     "Junio", "Julio", "Agosto", "Septiembre", "Octubre", 
     "Noviembre", "Diciembre"];
    if (month < 0 || month > names.length) {
      return "Mes desconocido";
    }
    return names[month];
  }

  filter() {
    this.filterUID();
    this.filterMonths();
  }

}
