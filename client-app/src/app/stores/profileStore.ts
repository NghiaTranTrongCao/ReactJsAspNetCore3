import { toast } from "react-toastify";
import { IProfile, IPhoto } from "./../models/profile";
import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed, reaction } from "mobx";
import agent from "../api/agent";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowing(predicate);
        }
        else {
          this.followings = [];
        }
      }
    );
  }

  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable profile: IProfile | null = null;
  @observable loading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;

  @action setActiveTab = (activeTabIndex: number) => {
    this.activeTab = activeTabIndex;
  };

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
        this.profile!.photos = this.profile!.photos.filter(
          (p) => p.id !== photo.id
        );
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

  @action updateProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profile.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }

        this.profile = { ...this.profile!, ...profile };
      });
      toast.success("Update Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Problem on editing profile");
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profile.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem on following this user");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profile.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem on unfollowing this user");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowing = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await agent.Profile.listFollowings(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem on loading following");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
