export interface User {
  id?: string; // Optional because it's added by Firestore
  firstname: string;
  lastname: string;
  type: string; // Example: 'admin', 'user', 'guest'
  status: string; // Example: 'active', 'inactive'
}
