//export interface IUser {
    //name: string,
    //email: string,
    //pass: string
//}

export interface IUser {
  id?: number;
  nombre?: string;
  mail: string;
  contrasenia: string;
  rol?: "ADMIN" | "USUARIO";
}