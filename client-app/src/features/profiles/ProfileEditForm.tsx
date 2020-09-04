import React, {  } from "react";
import { Form, Button } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import TextInput from "../../app/common/form/TextInput";
import { observer } from "mobx-react-lite";
import { combineValidators, isRequired } from "revalidate";
import { IProfile } from "../../app/models/profile";

const validate = combineValidators({
  displayName: isRequired("displayName"),
});

interface IProps {
  updateProfile: (profile: Partial<IProfile>) => void;
  profile: IProfile;
}

export const ProfileEditForm: React.FC<IProps> = ({
  updateProfile,
  profile,
}) => {
  return (
    <FinalForm
      validate={validate}
      onSubmit={updateProfile}
      initialValues={profile}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit} error loading={submitting}>
          <Field
            name="displayName"
            placeholder="Display Name"
            value={profile.displayName}
            component={TextInput}
          />
          <Field
            name="bio"
            placeholder="Bio"
            rows={3}
            value={profile.bio}
            component={TextAreaInput}
          />
          <Button
            loading={submitting}
            disabled={invalid || pristine}
            floated="right"
            color="green"
            positive
            type="submit"
            content="Update Profile"
            onClick={handleSubmit}
          ></Button>
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);
