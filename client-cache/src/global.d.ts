declare global {
  interface Project {
    name: String;
    description: String;
    time?: Time[];
  }

  interface Time {
    description: String;
    amount: Number;
  }
}

export {};
