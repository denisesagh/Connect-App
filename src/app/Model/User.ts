import {UserSettings} from "./UserSettings";

export interface ProfileUser {
  uid: string;
  admin?: boolean;
  email?: string;
  fullName?: string;
  bio?: string;
  userName?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  myFollower?: string[];
  iAmFollowing?: string[];
  areWeFriends?: boolean;
  settings?: UserSettings[];
}
