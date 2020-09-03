import { toast } from "react-toastify";
import { IProfile, IPhoto } from "./../models/profile";
import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import agent from "../api/agent";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable profile: IProfile | null = null;
  @observable loading = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    }

    return false;
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profile.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profile.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
        }

        if (photo.isMain) {
          this.rootStore.userStore.user!.image = photo.url;
          this.profile!.image = photo.url;
        }

        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem on uploading photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profile.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((a) => a.isMain)!.isMain = false;
        this.profile!.photos.find((a) => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem on setting main photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profile.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(p => p.id !== photo.id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem on deleting photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
