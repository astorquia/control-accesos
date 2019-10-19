export interface Registro {
    uid: number;
    name: string;
    registros: RegistroDia[];
}

export interface RegistroDia {
    dia: Dia;
    horas: Date[];
}

export interface Dia {
    dia: number;
    mes: number;
    ano: number;
}
