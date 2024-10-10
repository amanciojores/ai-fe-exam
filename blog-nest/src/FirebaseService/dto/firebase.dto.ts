// repository.interface.ts
export interface IRepository<T> {
  addDocument(data: T): Promise<string>;
  getAllDocuments(): Promise<T[]>;
}
