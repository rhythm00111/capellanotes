export const ROUTES = {
  notes: {
    list: () => '/dashboard/notes',
    editor: (id: string) => `/dashboard/notes/${id}`,
    folder: (id: string) => `/dashboard/notes?folder=${id}`,
    view: (view: string) => `/dashboard/notes?view=${view}`,
  },
};
