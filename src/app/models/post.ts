import { Interactions } from "./interactions";

export class Post {
    idPost!:string;
    content!:string;
    image!:string
    datePost! : string;
    interactions!: Interactions[];
    
}