// repository.interface.ts
export interface IRepository<T> {
  addDocument(data: T, documentID: string): Promise<string>;
  getAllDocuments(): Promise<T[]>;
}
