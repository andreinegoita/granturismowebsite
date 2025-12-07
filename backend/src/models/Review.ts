export class Review{
    id?: number;
    userId: number;
    gameId: number;
    rating: number;
    comment: string;
    createdAt?: Date;

    constructor(userId: number, gameId:number,rating:number,comment:string){
        this.userId=userId;
        this.gameId=gameId;
        this.rating=rating;
        this.comment=comment;
    }

    validateRating() : boolean{
        return this.rating >=1 && this.rating <= 5;
    }
}