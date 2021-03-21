import {
  Project as IProject,
  TimeInput
} from './../../client/src/generated/graphql';
import { nanoid } from 'nanoid';

class Project {
  id: string;
  name: string;
  description: string;
  time?: { description: string; amount: number }[];

  constructor(id, { name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

const projectArray: IProject[] = [];

const resolvers = {
  projects: () => projectArray,
  project: ({ id }) => {
    const matchingProject = projectArray.find(project => project.id === id);
    return matchingProject;
  },
  createProject: ({ input }) => {
    const id = nanoid();
    const newProject = new Project(id, input);
    projectArray.push(newProject);

    return newProject;
  },
  editProject: ({ input }: { input: IProject }) => {
    const { id, name, description } = input;
    const project = projectArray.find(project => project.id === id);
    project.name = name;
    project.description = description;
    return project;
  },
  deleteProject: ({ id }) => {
    const projectToDelete = projectArray.find(project => project.id === id);
    const index = projectArray.findIndex(project => project.id === id);
    projectArray.splice(index, 1);
    return projectToDelete;
  },
  addTime: ({ id, timeInput }: { id: string; timeInput: TimeInput }) => {
    const { description, amount } = timeInput;
    const project = projectArray.find(project => project.id === id);

    const timeArrCopy = project.time ? project.time : [];
    const matchingTime = timeArrCopy.find(
      time => time.description === timeInput.description
    );
    if (matchingTime) {
      matchingTime.amount += timeInput.amount;
    } else {
      timeArrCopy.push({ description, amount });
    }
    project.time = timeArrCopy;
    return project;
  },
  deleteTime: ({ id, key }: { id: string; key: number }) => {
    const project = projectArray.find(project => project.id === id);

    if (project.time[key]) {
      project.time.splice(key, 1);
    }
    return project;
  }
};

export default resolvers;
