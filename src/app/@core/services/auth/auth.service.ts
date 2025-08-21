import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { LoginRequest, LoginResponse, SendValidateEmailRequest } from "../../interfaces/auth.interface";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly _baseApi = `${environment.BASE_API}/auth`;

    constructor(private http: HttpClient) {}

    login(body: LoginRequest): Observable<LoginResponse>{
        return this.http.post<LoginResponse>(`${this._baseApi}/login`, body)
    }

    sendValidateEmail(body: SendValidateEmailRequest){
        return this.http.post(`${this._baseApi}/send-validate-email`, body)
    }

}