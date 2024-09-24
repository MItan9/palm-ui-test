"use client";

import axios from "axios";
import https from "https";
import { interval } from "rxjs";

export class User {
  static ANONYMOUS = new User("", "", []);

  constructor(name, email, roles) {
    this.name = name;
    this.email = email;
    this.roles = roles;
  }

  get isAuthenticated() {
    return !!this.name;
  }

  hasAnyRole(...roles) {
    return roles.some((role) => this.roles.includes(role));
  }
}

export class UserService {
  refreshSub = null;

  constructor(user, setUser) {
    this.user = user;
    this.setUser = setUser;
    this.refresh(user, setUser);
  }

  createAxiosInstance() {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_REVERSE_PROXY_URI,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  async fetchUserData() {
    const axiosInstance = this.createAxiosInstance();
    try {
      const response = await axiosInstance.get("/bff/api/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  updateUserIfNeeded(userData) {
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

  scheduleRefresh(exp) {
    const now = Date.now();
    const delay = (exp * 1000 - now) * 0.8;

    if (delay > 2000) {
      this.refreshSub?.unsubscribe();
      this.refreshSub = interval(delay).subscribe(() => {
        this.refresh(this.user, this.setUser);
      });
    }
  }

  async refresh(user, setUser) {
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
