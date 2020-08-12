import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid} from 'uuid';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity | null;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  submitting: boolean
}

export const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initializeActivity,
  createActivity,
  editActivity,
  submitting
}) => {
  const initializeForm = () => {
    if (initializeActivity) {
      return initializeActivity;
    } else {
      return {
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleChangeInput = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if(activity.id.length === 0){
      let newActivity = {...activity, id: uuid() }
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  }

  return (
    <Segment clearing>
      <Form>
        <Form.Input
          name="title"
          onChange={handleChangeInput}
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          name="description"
          onChange={handleChangeInput}
          rows={2}
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          name="category"
          onChange={handleChangeInput}
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          name="date"
          onChange={handleChangeInput}
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          name="city"
          onChange={handleChangeInput}
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          name="venue"
          onChange={handleChangeInput}
          placeholder="Venue"
          value={activity.venue}
        />
        <Button
          floated="right"
          color="grey"
          type="button"
          content="Cancel"
          onClick={() => setEditMode(false)}
        ></Button>
        <Button
          loading={submitting}
          floated="right"
          color="green"
          positive
          type="submit"
          content="Submit"
          onClick={() => handleSubmit() }
        ></Button>
      </Form>
    </Segment>
  );
};
