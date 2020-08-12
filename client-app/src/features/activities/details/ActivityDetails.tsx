import React, { SyntheticEvent } from "react";
import { Card, Image, Icon, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activity: IActivity;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  deleteActivity: (event: SyntheticEvent<HTMLButtonElement> ,id: string) => void;
  submitting: boolean,
  target: string,
}

export const ActivityDetails: React.FC<IProps> = ({
  activity,
  setEditMode,
  setSelectedActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={3}>
          <Button
            basic
            content="Edit"
            color="blue"
            onClick={() => setEditMode(true)}
          ></Button>
           <Button
            name={activity.id}
            loading={target === activity.id && submitting}
            basic
            content="Delete"
            color="red"
            onClick={(event) => { deleteActivity(event, activity.id); setSelectedActivity(null); }}
          ></Button>
          <Button
            basic
            content="Cancel"
            color="grey"
            onClick={() => setSelectedActivity(null)}
          ></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};
