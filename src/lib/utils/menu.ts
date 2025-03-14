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

export type CourseMenu = {
  title: string;
  sections: MenuSection[];
};

export type MenuDataType = Record<string, CourseMenu>; 