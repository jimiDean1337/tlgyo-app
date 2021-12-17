export interface Program {
  title?: string;
  description?: string;
  icon?: string;
  body?: any;
  images?: ProgramImage[];
  link?: string;
}

interface ProgramImage {
  type?: string;
  src?: string;
}
