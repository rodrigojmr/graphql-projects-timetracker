class Project {
  constructor(id, { name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

const projectHolder = {};

const resolvers = {
  getProjects: () => {},
  getProject: ({ id }) => {
    return new Project(id, projectHolder[id]);
  }
};
