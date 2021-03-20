declare global {
  interface Project {
    id: string;
    name: string;
    description: string;
    time?: Time[];
  }

  interface Time {
    description: string;
    amount: number;
  }
}

export {};
