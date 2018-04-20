import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject, snapshotChanges } from 'angularfire2/database';

export class Items {
  public id: number;
  public data: {
    stringExample: string;
    booleanExample: boolean;
    numberExample: number;
    dateExample: Date;
    arrayExample: Array<any>;
    nullExample: any;
    objectExample: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public items: any[] = [];
  keySearch: string;

  constructor(private db: AngularFirestore) {
    const a = db.collection('items').snapshotChanges();

    a.map((snapshot: any) => {
      return snapshot.map((data) => {
        let id = data.payload.doc.id;
        let db = data.payload.doc.data() as Items;
        return { id, ...db }
      })
    }).subscribe((snap)=> {
      this.items = snap;
    })
  }

  ngOnInit() {

    console.log(this.items, 'afasf');

  }

  addItem() {
    const  a = {
      stringExample: "Hello world 1!",
      booleanExample: false,
      numberExample: 3.14159265,
      dateExample: new Date("December 10, 1815"),
      arrayExample: [5, true, "hello"],
      nullExample: null,
      objectExample: {
          a: 5,
          b: {
            nested: "foo"
          }
      }
  };
    this.db.collection('items').add(a)
      .then(function() {
        console.log('Document successfully written!');
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });

  }

  updateField(item) {
    console.log(item);
    item.data.booleanExample = false;
    item.data.stringExample = item.id;
    this.db.collection("items").doc(item.id).set(item).then(function() {
      console.log("Document successfully update!");
    }).catch(function(error) {
        console.error("Error update document: ", error);
    });
  }

  searchItems(value) {
    console.log(value, this.keySearch);
    if(value !== undefined || value !== null) {
      const a = this.db.collection('items', ref => ref.where('booleanExample', '==', false));
      // a.get().then();
      a.snapshotChanges().map((snapshot: any) => {
        console.log(snapshot);
        return snapshot.map((data) => {
          return { id: data.payload.doc.id, data: data.payload.doc.data() }
        })
      }).subscribe((snap)=> {
        this.items = snap;
        // console.log(snap);
      });
    }

  }

  deleteItem(id: string) {
    this.db.collection("items").doc(id).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
  }
}
