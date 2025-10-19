import axios from "@/lib/axios";
import {
  PostMessageRequest,
  PostMessageResponse,
  GetMessageResponse,
  GetPinnedMessagesResponse,
  PinMessageRequest,
  PinMessageResponse,
} from "@/api/chat/chat.types";

export class ChatService {
  private headers: Record<string, string>;

  constructor(authToken: string, userId: string) {
    this.headers = {
      "X-Auth-Token": authToken,
      "X-User-Id": userId,
    };
  }

  /** 💬 Send a new message to a channel or user */
  async postMessage(payload: PostMessageRequest): Promise<PostMessageResponse> {
    const response = await axios.post("/chat.postMessage", payload, {
      headers: this.headers,
    });
    return response.data;
  }

  /** 🧾 Get a single chat message by its ID */
  async getMessage(msgId: string): Promise<GetMessageResponse> {
    const response = await axios.get("/chat.getMessage", {
      headers: this.headers,
      params: { msgId },
    });
    return response.data;
  }

  /** 📌 Get all pinned messages from a room */
  async getPinnedMessages(
    roomId: string,
    offset?: number,
    count?: number,
    sort?: Record<string, 1 | -1>
  ): Promise<GetPinnedMessagesResponse> {
    const response = await axios.get("/chat.getPinnedMessages", {
      headers: this.headers,
      params: { roomId, offset, count, sort },
    });
    return response.data;
  }

  /** 📍 Pin a specific message in a room */
  async pinMessage(payload: PinMessageRequest): Promise<PinMessageResponse> {
    const response = await axios.post("/chat.pinMessage", payload, {
      headers: this.headers,
    });
    return response.data;
  }
}

export const chatService = new ChatService(
  "RScctEHSmLGZGywfIhWyRpyofhKOiMoUIpimhvheU3f",
  "rbAXPnMktTFbNpwtJ"
);
