// src/types/channel.types.ts

export interface IUser {
  _id: string;
  username: string;
  name?: string;
}

export interface IChannel {
  _id: string;
  fname?: string;
  name: string;
  t: string;
  msgs: number;
  usersCount: number;
  ro: boolean;
  default: boolean;
  sysMes: boolean;
  u: IUser;
  _updatedAt: string;
  ts?: string;
  topic?: string;
  broadcast?: boolean;
  encrypted?: boolean;
  description?: string;
  federated?: boolean;
  customFields?: Record<string, any>;
  lastMessage?: Record<string, any>;
  lm?: string;
}

export interface IChannelResponse {
  success: boolean;
  channel?: IChannel;
  channels?: IChannel[];
  count?: number;
  offset?: number;
  total?: number;
}

export interface ICreateChannelBody {
  name: string;
  members?: string[];
  readOnly?: boolean;
  excludeSelf?: boolean;
  customFields?: Record<string, any>;
  extraData?: {
    topic?: string;
    broadcast?: boolean;
    encrypted?: boolean;
    teamId?: string;
  };
}

export interface IDeleteChannelBody {
  roomId?: string;
  roomName?: string;
}

export interface IInviteChannelBody {
  roomId: string;
  userId?: string;
  users?: string[];
}

export interface IJoinChannelBody {
  roomId: string;
  joinCode?: string;
}

export interface ILeaveChannelBody {
  roomId: string;
}

export interface IChannelHistoryParams {
  roomId?: string;
  roomName?: string;
  sort?: Record<string, number>;
  count?: number;
  offset?: number;
  latest?: string;
  oldest?: string;
  inclusive?: boolean;
  showThreadMessages?: boolean;
  unreads?: boolean;
}

export interface IChannelListParams {
  offset?: number;
  count?: number;
  sort?: Record<string, number>;
  query?: string;
  fields?: string;
}
