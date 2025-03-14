// Menu configuration utilities - Type definitions only
// Functions moved to +layout.server.js

// Define types for the menu structure
export type MenuItem = {
  title: string;
  path: string;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export type Reading = {
  title: string;
  author?: string;
  url?: string;
  pages?: string;
  path?: string;
  source?: string;
};

export type Assignment = {
  title: string;
  due?: string;
  description?: string;
  path?: string;
  source?: string;
};

export type CourseMenu = {
  title: string;
  sections: MenuSection[];
  readings?: Reading[];
  assignments?: Assignment[];
};

export type MenuDataType = Record<string, CourseMenu>; 