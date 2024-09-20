"use client";

import axios from "axios";
import https from "https";
import { Dispatch, SetStateAction } from "react";
import { Subscription, interval } from "rxjs";

interface UserinfoDto {
  username: string;
  email: string;
  roles: string[];
  exp: number;
}

export class User {
  static readonly ANONYMOUS = new User("", "", []);

  constructor(
    readonly name: string,
    readonly email: string,
    readonly roles: string[]
  ) { }

  get isAuthenticated(): boolean {
    return !!this.name;
  }

  hasAnyRole(...roles: string[]): boolean {
    return roles.some(role => this.roles.includes(role));
  }
}

export class UserService {
  private refreshSub?: Subscription;

  constructor(private user: User, private setUser: Dispatch<SetStateAction<User>>) {
    this.refresh(user, setUser);
  }

  private createAxiosInstance() {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_REVERSE_PROXY_URI,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  private async fetchUserData(): Promise<UserinfoDto | null> {
    const axiosInstance = this.createAxiosInstance();
    try {
      const response = await axiosInstance.get<UserinfoDto>("/bff/api/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  private updateUserIfNeeded(userData: UserinfoDto) {
    if (
      userData.username !== this.user.name ||
      userData.email !== this.user.email ||
      (userData.roles || []).toString() !== this.user.roles.toString()
    ) {
      this.setUser(
        userData.username
          ? new User(userData.username, userData.email, userData.roles)
          : User.ANONYMOUS
      );
    }
  }

  private scheduleRefresh(exp: number) {
    const now = Date.now();
    const delay = (exp * 1000 - now) * 0.8;

    if (delay > 2000) {
      this.refreshSub?.unsubscribe();
      this.refreshSub = interval(delay).subscribe(() => {
        this.refresh(this.user, this.setUser);
      });
    }
  }

  async refresh(
    user: User,
    setUser: Dispatch<SetStateAction<User>>
  ): Promise<void> {
    const userData = await this.fetchUserData();

    if (userData) {
      this.updateUserIfNeeded(userData);
      if (userData.exp) {
        this.scheduleRefresh(userData.exp);
      }
    }
  }

  cleanup() {
    this.refreshSub?.unsubscribe();
  }
}
