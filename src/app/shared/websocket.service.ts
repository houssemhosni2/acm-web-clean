
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NotificationsEntity } from './Entities/notifications.entity';
import { HttpClient } from '@angular/common/http';
import { AcmURLConstants } from './acm-url-constants';
import { SharedService } from './shared.service';
import { AcmDevToolsServices } from './acm-dev-tools.services';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    // webSocketEndPoint = environment.webSocketEndPoint;
    topic = '/queue/progress-';
    sessionId;
    stompClient: any;
    showRes = false;
    subscription: Subscription;
    private count = 0;
    notifications: NotificationsEntity[] = [];

    constructor(private httpClient: HttpClient, private loanSharedService: SharedService, private devToolsServices: AcmDevToolsServices) {
    }
    /**
     * connect
     */
    /*_connect() {
        console.log('Initialize WebSocket Connection');
        const ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        // disactivate degub messages in console
        this.stompClient.debug = null;
        const cnx = this;
        // connecte to the endPoint WebSocket
        cnx.stompClient.connect({}, () => {
            // generate user session id
            const sessionId = /\/([^\/]+)\/websocket/.exec(ws._transport.url)[1];
            console.log('connected, session id: ' + sessionId);
            // subscribe to methode count notif
            this.sessionId = sessionId;
            cnx.stompClient.subscribe('/queue/progress-' + sessionId, (sdkEvent) => {
                cnx.onMessageReceived(sdkEvent);
            });
            this.addSessionId(this.sessionId).subscribe();

            // reconnection delay to the WS server
            cnx.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    }*/
    /**
     * disconnect
     */
    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected');
    }

    // on error, schedule a reconnection attempt
   /* errorCallBack(error) {
        console.log('errorCallBack -> ' + error);
        setTimeout(() => {
            this._connect();
        }, 5000);
    }*/
    /**
     * Send Request To the Server
     * @param name prefix send message
     * @param body username connected user
     */
    public _send(name: string, body: any) {
        // console.log('Message Recieved from body :: ' + body);
        this.stompClient.send('/app/' + name, {}, body);
    }
    /**
     * Message Recieved from Server
     * @param message message
     */
    onMessageReceived(message) {
        this.loanSharedService.addNotification(JSON.parse(message.body));
        this.loanSharedService.countNotifications++;
        this.devToolsServices.openToast(2, 'notifications.new_notification');
    }
    /**
     * get number of notifications
     * @returns number
     */
    getCount() {
        return this.count;
    }
    /**
     * set number of notification
     */
    setCount(message) {
        this.count = Number(message.body);
    }
    /**
     *
     * @param sessionId string
     * @returns void
     */
    addSessionId(sessionId: string): Observable<void> {
        return this.httpClient.get<void>(AcmURLConstants.ADD_SESSION_ID + sessionId);
    }
}
