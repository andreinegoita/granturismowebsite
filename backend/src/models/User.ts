export class User{
    id?: number;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt?: Date;

    constructor(username: string, email:string, password:string, role: 'admin' | 'user' = 'user'){
        this.username=username;
        this.email=email;
        this.password=password;
        this.role=role;
    }

    isAdmin(): boolean{
        return this.role === 'admin';
    }
}