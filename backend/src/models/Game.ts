export class Game{
    id?: number;
    title: string;
    releaseYear: number;
    platform: string;
    description: string;
    imageUrls: string[];
    rating?: number;
    createdAt?: Date;

    constructor(title: string, releaseYear:number, platform:string,description:string,imageUrls: string[]){
        this.title=title;
        this.releaseYear=releaseYear;
        this.platform=platform;
        this.description=description;
        this.imageUrls=imageUrls;
    }
}