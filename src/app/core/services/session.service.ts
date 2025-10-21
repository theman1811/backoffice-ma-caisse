import { Injectable } from "@angular/core";
import { environment } from "@/environnments/environnment";
import { Observable, of } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class SessionService {
    userSessionKey= 'userSession' as const


    constructor(){}



    saveUserSession(user: Record<any, any>) : void{
        localStorage.setItem(this.userSessionKey, JSON.stringify(user))
    }

    
    getUserSession(): string|null {
        const user= localStorage.getItem(this.userSessionKey)
        return user ? JSON.parse(user) : null
    }


    deleteSessionUser(): Observable<null> {
        localStorage.removeItem(this.userSessionKey)
        return of(null)
    }
}