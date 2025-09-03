import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

export const getUserHistory = (db, path, onData, onError) => {
  const q = query(collection(db, path));
  return onSnapshot(q, snapshot => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    onData(data);
  }, onError);
};

export const saveToHistory = async (db, path, data) => {
  await addDoc(collection(db, path), data);
};

export const deleteFromHistory = async (db, path, id) => {
  await deleteDoc(doc(db, path, id));
};
