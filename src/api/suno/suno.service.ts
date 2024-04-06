import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieJar } from 'tough-cookie';
import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { UserAgentsUtil } from 'src/common/utils/user-agents.util';
import { CreateCustomMusicDto } from './dto/create-suno.dto';
@Injectable()
export class SunoService {
  private readonly client: AxiosInstance;
  private currentToken: string;
  private sid: string;
  private BASE_URL = 'https://studio-api.suno.ai';
  private readonly CLERK_BASE_URL = 'https://api.clerk.dev';
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
    await this.keepAlive();
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

  async generateLyrics() {
    await this.keepAlive();
    try {
      const apiUrl = `${this.BASE_URL}/api/generate/lyrics/`;
      const response = await this.client.post(apiUrl, { prompt: '' });
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async getLyrics(id: string) {
    await this.keepAlive();
    try {
      const apiUrl = `${this.BASE_URL}/api/generate/lyrics/${id}`;
      const response = await this.client.get(apiUrl);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  public async keepAlive(): Promise<void> {
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
