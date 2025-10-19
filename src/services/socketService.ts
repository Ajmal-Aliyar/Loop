import { useMessageStore } from '@/store/messageStore';
import type { ChatMessage } from '@/api/chat/chat.types';

interface DDPMessage {
  msg: string;
  method: string;
  params: any[];
  id: string;
}

interface DDPResponse {
  _id: string;
  rid: string;
  msg: string;
  token?: string;
  alias?: string;
  ts: { $date: number };
  u: {
    _id: string;
    username: string;
    name?: string;
  };
  _updatedAt: { $date: number };
  newRoom?: boolean;
  showConnecting?: boolean;
}

class SocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageId = 0;
  private subscriptions = new Map<string, string>();

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // Replace with your actual WebSocket URL
      const wsUrl = 'ws://localhost:3000/websocket'; // Adjust based on your server
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.authenticate();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleReconnect();
    }
  }

  private authenticate() {
    // Send authentication message
    const authMessage: DDPMessage = {
      msg: 'method',
      method: 'login',
      params: [{
        resume: localStorage.getItem('authToken') // Get from your auth store
      }],
      id: this.generateMessageId()
    };
    this.send(authMessage);
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);
      
      if (message.msg === 'result') {
        this.handleResult(message);
      } else if (message.msg === 'changed') {
        this.handleChanged(message);
      } else if (message.msg === 'added') {
        this.handleAdded(message);
      } else if (message.msg === 'removed') {
        this.handleRemoved(message);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleResult(message: any) {
    // Handle method call results
    if (message.method === 'sendMessageLivechat') {
      // Message sent successfully
      console.log('Message sent:', message);
    }
  }

  private handleChanged(message: any) {
    // Handle real-time updates
    if (message.collection === 'stream-room-messages') {
      const messageData = message.fields?.args?.[0];
      if (messageData) {
        this.handleNewMessage(messageData);
      }
    }
  }

  private handleAdded(message: any) {
    // Handle new messages
    if (message.collection === 'stream-room-messages') {
      const messageData = message.fields?.args?.[0];
      if (messageData) {
        this.handleNewMessage(messageData);
      }
    }
  }

  private handleRemoved(message: any) {
    // Handle removed messages
    console.log('Message removed:', message);
  }

  private handleNewMessage(messageData: any) {
    const chatMessage: ChatMessage = {
      _id: messageData._id,
      rid: messageData.rid,
      msg: messageData.msg,
      alias: messageData.alias,
      ts: new Date(messageData.ts.$date).toISOString(),
      u: messageData.u,
      _updatedAt: new Date(messageData._updatedAt.$date).toISOString(),
      reactions: messageData.reactions,
      mentions: messageData.mentions,
      channels: messageData.channels,
      starred: messageData.starred,
      t: messageData.t,
      groupable: messageData.groupable,
    };

    // Add message to store
    useMessageStore.getState().addMessage(messageData.rid, chatMessage);
  }

  public subscribeToRoom(roomId: string) {
    const subscriptionMessage: DDPMessage = {
      msg: 'sub',
      method: 'stream-room-messages',
      params: [roomId, false],
      id: this.generateMessageId()
    };
    
    this.subscriptions.set(roomId, subscriptionMessage.id);
    this.send(subscriptionMessage);
  }

  public unsubscribeFromRoom(roomId: string) {
    const subscriptionId = this.subscriptions.get(roomId);
    if (subscriptionId) {
      const unsubscribeMessage: DDPMessage = {
        msg: 'unsub',
        method: subscriptionId,
        params: [],
        id: this.generateMessageId()
      };
      this.send(unsubscribeMessage);
      this.subscriptions.delete(roomId);
    }
  }

  public sendLivechatMessage(roomId: string, message: string, token?: string) {
    const messageId = this.generateRandomId();
    
    const ddpMessage: DDPMessage = {
      msg: 'method',
      method: 'sendMessageLivechat',
      params: [{
        _id: messageId,
        rid: roomId,
        msg: message,
        token: token || ''
      }],
      id: this.generateMessageId()
    };

    this.send(ddpMessage);
    return messageId;
  }

  private send(message: DDPMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }

  private generateMessageId(): string {
    return (++this.messageId).toString();
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const socketService = new SocketService();
