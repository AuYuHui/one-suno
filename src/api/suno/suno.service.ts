import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieJar } from 'tough-cookie';
import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { UserAgentsUtil } from 'src/common/utils/user-agents.util';
import { CreateCustomMusicDto, CreateLyricsDto } from './dto/create-suno.dto';

@Injectable()
export class SunoService {
  private readonly client: AxiosInstance;
  private currentToken: string;
  private sid: string;
  private readonly BASE_URL = 'https://studio-api.suno.ai';
  private readonly CLERK_BASE_URL = 'https://api.clerk.dev';
  private lastRefreshTime: number = null;
  private readonly tokenExpiry: number = 5; // seconds
  constructor(private config: ConfigService) {
    const cookie = this.config.get('COOKIE');
    this.sid = this.config.get('SESSION_ID');
    const cookieJar = new CookieJar();

    this.client = wrapper(
      axios.create({
        jar: cookieJar,
        withCredentials: true,
        headers: {
          'User-Agent': UserAgentsUtil.random,
          Cookie: cookie,
        },
      }),
    );

    this.client.interceptors.request.use((config) => {
      if (this.currentToken && !config.url.includes('/tokens/api')) {
        config.headers['Content-Type'] = 'text/plain;charset=UTF-8';
        config.headers['Authorization'] = `Bearer ${this.currentToken}`;
        config.headers['Referer'] = 'https://app.suno.ai/';
        config.headers['Origin'] = 'https://app.suno.ai/';
      }
      return config;
    });
  }

  async generateMusic(playload: CreateCustomMusicDto) {
    await this.getToken();
    try {
      if (!playload.model) {
        playload.model = 'chirp-v3-0';
      }
      const apiUrl = `${this.BASE_URL}/api/generate/v2/`;
      const response = await this.client.post(apiUrl, {
        prompt: playload.prompt,
        title: playload.title,
        tags: playload.tags,
        continue_at: playload.continueAt,
        continue_clip_id: playload.continueClipId,
        mv: playload.model,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async getMusic(ids: string) {
    await this.getToken();
    try {
      const apiUrl = `${this.BASE_URL}/api/feed/?ids=${ids}`;
      const response = await this.client.get(apiUrl);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async generateLyrics(playload: CreateLyricsDto) {
    await this.getToken();

    try {
      const apiUrl = `${this.BASE_URL}/api/generate/lyrics/`;
      const response = await this.client.post(apiUrl, {
        prompt: playload.prompt,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async getLyrics(id: string) {
    await this.getToken();
    try {
      const apiUrl = `${this.BASE_URL}/api/generate/lyrics/${id}`;
      const response = await this.client.get(apiUrl);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getToken() {
    const currentTime = Date.now() / 1000; // current time in seconds

    if (
      this.currentToken === null ||
      currentTime - this.lastRefreshTime >= this.tokenExpiry
    ) {
      // Refresh token if it's null or expired
      await this.generateNewToken();
      this.lastRefreshTime = currentTime;
    }
  }
  private async generateNewToken(): Promise<void> {
    if (!this.sid) {
      throw new Error('Session ID is not set. Cannot renew token.');
    }
    try {
      // URL to renew session token
      const renewUrl = `https://clerk.suno.ai/v1/client/sessions/${this.sid}/tokens/api?_clerk_js_version=4.71.2`;

      // Renew session token
      const renewResponse = await this.client.post(renewUrl);

      const newToken = renewResponse.data['jwt'];
      // Update Authorization field in request header with the new JWT token
      this.currentToken = newToken;
    } catch (error) {
      console.log(error);
    }
  }
}
