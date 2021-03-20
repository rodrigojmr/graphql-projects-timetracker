import { nanoid } from 'nanoid';

class Project {
  id: string;
  name: string;
  description: string;

  constructor(id, { name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

const projectArray = [];

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
  editProject: ({ input }) => {
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
  }
};

export default resolvers;
