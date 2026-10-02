export const ROUTES = {
  notes: {
    list: () => '/notes',
    editor: (id: string) => `/notes/${id}`,
    folder: (id: string) => `/notes?folder=${id}`,
    view: (view: string) => `/notes?view=${view}`,
  },
};
