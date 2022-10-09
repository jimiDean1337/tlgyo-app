import { Injectable } from '@angular/core';
import { AngularFireDatabase, PathReference, QueryFn } from '@angular/fire/compat/database';
// import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

  public addToCollection(collectionName: string, data: any) {
    return this.afs.collection(collectionName).add(data);
  }

  public addToDBList<T = any>(listName: string, data: any) {
    return this.db.list<T>(listName).push(data);
  }

  public getDBList<T = any>(pathOrRef: PathReference, qry?: QueryFn) {
    return this.db.list<T>(pathOrRef, qry ? qry:null);
  }

  public getDBObject<T = any>(pathOrRef: PathReference) {
    return this.db.object<T>(pathOrRef);
  }
}
