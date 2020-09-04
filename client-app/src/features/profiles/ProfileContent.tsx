import React from "react";
import { Tab } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ProfilePhotos from "./ProfilePhotos";
import ProfileDescription from "./ProfileDescription";
import ProfileFollowing from "./ProfileFollowing";
import { IProfile } from "../../app/models/profile";

interface IProp {
  setActiveTab: (activeTabIndex: any) => void;
  profile: IProfile
}

const ProfileContent: React.FC<IProp> = ({ setActiveTab, profile }) => {
  const panes = [
    { menuItem: "About", render: () => <ProfileDescription /> },
    { menuItem: "Photos", render: () => <ProfilePhotos /> },
    {
      menuItem: "Activities",
      render: () => <Tab.Pane>Activities Content</Tab.Pane>,
    },
    { menuItem: `Followers (${profile.followersCount})`, render: () => <ProfileFollowing /> },
    { menuItem: `Following (${profile.followingCount})`, render: () => <ProfileFollowing /> },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
    />
  );
};

export default observer(ProfileContent);
