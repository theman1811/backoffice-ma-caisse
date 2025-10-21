import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";


@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private messageService: MessageService){

    }

    showSuccess(summary: string, detail: string): void {
        console.log('showSuccess', summary, detail);
        this.messageService.add({
            severity: 'success',
            summary: summary,
            detail: detail,
            life: 3000,
        });
    }

    showError(summary: string, detail: string | undefined): void {
        this.messageService.add({
            severity: 'error',
            summary: summary,
            detail: detail,
            life: 3000,
        });
    }

    showWarning(summary: string, detail: string): void {
        this.messageService.add({
            severity: 'warn',
            summary: summary,
            detail: detail,
            life: 3000,
        });
    }

    showInfo(summary: string, detail: string): void {
        this.messageService.add({
            severity: 'info',
            summary: summary,
            detail: detail,
            life: 3000,
        });
    }

    clear(): void {
        this.messageService.clear();
    }

}