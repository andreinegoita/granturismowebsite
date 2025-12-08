export class Review{
    id?: number;
    userId: number;
    gameId: number;
    rating: number;
    comment: string;
    likes: number;
    dislikes: number;
    username?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(userId: number, gameId:number,rating:number,comment:string){
        this.userId=userId;
        this.gameId=gameId;
        this.rating=rating;
        this.comment=comment;
        this.likes=0;
        this.dislikes=0;
    }

    validateRating() : boolean{
        return this.rating >=1 && this.rating <= 5;
    }

    validateComment(): boolean {
        return this.comment.length >= 10 && this.comment.length <= 1000;
    }
}