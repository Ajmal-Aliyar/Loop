// ---------- Common Types ----------
export interface UserRef {
  _id: string;
  username: string;
  name?: string;
}

// ---------- POST /chat.postMessage ----------
export interface PostMessageRequest {
  channel: string; // Channel name or roomId
  text: string; // Message text
  alias?: string; // Optional alias if impersonation allowed
  emoji?: string;
  avatar?: string;
  attachments?: Record<string, any>[];
  tmid?: string; // Thread message ID (for replies)
  customFields?: Record<string, any>;
}

export interface PostedMessage {
  _id: string;
  rid: string;
  msg: string;
  alias?: string;
  ts: string;
  u: UserRef;
  _updatedAt: string;
  parseUrls?: boolean;
  groupable?: boolean;
}

export interface PostMessageResponse {
  ts: number;
  channel: string;
  message: PostedMessage;
  success: boolean;
}

// ---------- GET /chat.getMessage ----------
export interface ChatMessage {
  _id: string;
  rid: string;
  msg: string;
  alias?: string;
  ts: string;
  u: UserRef;
  _updatedAt: string;
  reactions?: Record<string, any>;
  mentions?: Array<Record<string, any>>;
  channels?: Array<Record<string, any>>;
  starred?: Record<string, any>;
  t?: string;
  groupable?: boolean;
}

export interface GetMessageResponse {
  message: ChatMessage;
  success: boolean;
}

// ---------- GET /chat.getPinnedMessages ----------
export interface PinnedMessage {
  _id: string;
  rid: string;
  msg: string;
  ts: string;
  u: UserRef;
  _updatedAt: string;
  urls?: Array<Record<string, any>>;
  mentions?: Array<Record<string, any>>;
  channels?: Array<Record<string, any>>;
  md?: Array<Record<string, any>>;
  pinned?: boolean;
  pinnedAt?: string;
  pinnedBy?: UserRef;
  reactions?: Record<string, any>;
  starred?: Array<Record<string, any>>;
  replies?: string[];
  tcount?: number;
  tlm?: string;
}

export interface GetPinnedMessagesResponse {
  messages: PinnedMessage[];
  count: number;
  offset: number;
  total: number;
  success: boolean;
}

// ---------- POST /chat.pinMessage ----------
export interface PinMessageRequest {
  messageId: string;
}

export interface PinMessageResponse {
  message: {
    _id: string;
    t: string;
    rid: string;
    ts: string;
    msg: string;
    u: UserRef;
    groupable: boolean;
    attachments?: Array<Record<string, any>>;
    _updatedAt: string;
  };
  success: boolean;
}
