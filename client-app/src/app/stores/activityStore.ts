import { createAttendee } from './../Util/Util';
import { RootStore } from './rootStore';
import { IActivity } from "./../models/activity";
import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { history } from '../..';
import { toast } from "react-toastify";
import { setActivityProps } from '../Util/Util';

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  } 

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable target = "";
  @observable loadingInitial = false;
  @observable loading = false;
  @observable submitting = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.toISOString().split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: IActivity[]}));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.detail(id);
        runInAction("loading activity", () => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("load activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);

      let host = createAttendee(this.rootStore.userStore.user!);
      host.isHost = true;

      let attendees = [];
      attendees.push(host);

      activity.attendees = attendees;
      activity.isHost = true;
      activity.isGoing = true;

      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("create activity error", () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data!');
      console.log(error.response);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction("edit activity error", () => {
        this.submitting = false;
      });
      toast.error('Problem updating data!');
      console.log(error.response);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.target = event.currentTarget.name;
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
        this.target = "";
        this.submitting = false;
      });
    } catch (error) {
      runInAction("delete activity error", () => {
        this.target = "";
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if(this.activity){
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      })
    } catch(error) {
      runInAction(() => {
        this.loading = false;
      })
      toast.error("Problem attending activity");
    }
  }

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if(this.activity) {
          this.activity.attendees = this.activity.attendees.filter(a=> a.username !== this.rootStore.userStore.user!.username);
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      })
    }catch (error) {
      runInAction(() => {
        this.loading = false;
      })
      toast.error("Problem cancelling attendance");
    }
  }
}
