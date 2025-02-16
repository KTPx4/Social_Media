// export class IndexedDBService {
//     private dbName: string;
//     private storeName: string;
//     private dbVersion: number;
//
//     constructor(dbName: string, storeName: string, dbVersion: number = 1) {
//         this.dbName = dbName;
//         this.storeName = storeName;
//         this.dbVersion = dbVersion;
//     }
//
//     private async openDB(): Promise<IDBDatabase> {
//         return new Promise((resolve, reject) => {
//             const request = indexedDB.open(this.dbName, this.dbVersion);
//
//             request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
//                 const db = (event.target as IDBOpenDBRequest).result;
//                 if (!db.objectStoreNames.contains(this.storeName)) {
//                     db.createObjectStore(this.storeName, { keyPath: "id" });
//                 }
//             };
//
//             request.onsuccess = () => resolve(request.result);
//             request.onerror = () => reject(request.error);
//         });
//     }
//
//     async addItem<T>(item: T & { id: string }): Promise<void> {
//         const db = await this.openDB();
//         return new Promise((resolve, reject) => {
//             const transaction = db.transaction(this.storeName, "readwrite");
//             const store = transaction.objectStore(this.storeName);
//             store.put(item);
//
//             transaction.oncomplete = () => resolve();
//             transaction.onerror = () => reject(transaction.error);
//         });
//     }
//
//     async getItem<T>(id: string): Promise<T | null> {
//         const db = await this.openDB();
//         return new Promise((resolve, reject) => {
//             const transaction = db.transaction(this.storeName, "readonly");
//             const store = transaction.objectStore(this.storeName);
//             const request = store.get(id);
//
//             request.onsuccess = () => resolve(request.result || null);
//             request.onerror = () => reject(request.error);
//         });
//     }
//
//     async deleteItem(id: string): Promise<void> {
//         const db = await this.openDB();
//         return new Promise((resolve, reject) => {
//             const transaction = db.transaction(this.storeName, "readwrite");
//             const store = transaction.objectStore(this.storeName);
//             store.delete(id);
//
//             transaction.oncomplete = () => resolve();
//             transaction.onerror = () => reject(transaction.error);
//         });
//     }
// }

export class IndexedDBService {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null = null;

    constructor(dbName: string, storeName: string) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    private async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1); // Đảm bảo có phiên bản 1 trở lên

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject("IndexedDB error: " + (event.target as IDBOpenDBRequest).error);
            };
        });
    }

    async getItem<T>(key: string): Promise<T | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result as T);
            request.onerror = () => reject("Failed to get item");
        });
    }

    async addItem<T>(data: T): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve();
            request.onerror = () => reject("Failed to add item");
        });
    }
}
