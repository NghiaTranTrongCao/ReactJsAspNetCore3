import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Tab, Grid, Header, Button } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, updateProfile } = rootStore.profileStore;

  const [editProfileMode, setEditProfileMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content="About"></Header>
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editProfileMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditProfileMode(!editProfileMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {!editProfileMode ? (
            <div>{profile!.bio}</div>
          ) : (
            <ProfileEditForm updateProfile={updateProfile} profile={profile!} />
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfileDescription;
