// src/services/channel.service.ts
import axiosInstance from "@/lib/axios";
import {
  ICreateChannelBody,
  IDeleteChannelBody,
  IInviteChannelBody,
  IJoinChannelBody,
  ILeaveChannelBody,
  IChannelHistoryParams,
  IChannelListParams,
  IChannelResponse,
} from "@/api/channels/channel.types";

class ChannelService {
  /**
   * Create a public channel.
   * Endpoint: POST /channels.create
   */
  async createChannel(data: ICreateChannelBody): Promise<IChannelResponse> {
    const res = await axiosInstance.post("/channels.create", data);
    return res.data;
  }

  /**
   * Delete a channel by roomId or roomName.
   * Endpoint: POST /channels.delete
   */
  async deleteChannel(data: IDeleteChannelBody): Promise<{ success: boolean }> {
    const res = await axiosInstance.post("/channels.delete", data);
    return res.data;
  }

  /**
   * Get channel history (messages, files, etc.)
   * Endpoint: GET /channels.history
   */
  async getChannelHistory(params: IChannelHistoryParams): Promise<any> {
    const res = await axiosInstance.get("/channels.history", { params });
    return res.data;
  }

  /**
   * Invite users to a channel.
   * Endpoint: POST /channels.invite
   */
  async inviteToChannel(data: IInviteChannelBody): Promise<IChannelResponse> {
    const res = await axiosInstance.post("/channels.invite", data);
    return res.data;
  }

  /**
   * Join a public channel.
   * Endpoint: POST /channels.join
   */
  async joinChannel(data: IJoinChannelBody): Promise<IChannelResponse> {
    const res = await axiosInstance.post("/channels.join", data);
    return res.data;
  }

  /**
   * Leave a public channel.
   * Endpoint: POST /channels.leave
   */
  async leaveChannel(data: ILeaveChannelBody): Promise<IChannelResponse> {
    const res = await axiosInstance.post("/channels.leave", data);
    return res.data;
  }

  /**
   * List all channels on the workspace.
   * Endpoint: GET /channels.list
   */
  async listChannels(params?: IChannelListParams): Promise<IChannelResponse> {
    const res = await axiosInstance.get("/channels.list", { params });
    return res.data;
  }
}

export const channelService = new ChannelService();
