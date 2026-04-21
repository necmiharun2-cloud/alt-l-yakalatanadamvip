import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  orderBy, 
  limit, 
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export const dbService = {
  async getPredictions(type: 'current' | 'success', role: string = 'user', isVip: boolean = false) {
    try {
      const statusToQuery = type === 'current' ? 'published' : 'settled';
      let q: any;

      if (role === 'admin') {
        q = query(
          collection(db, 'predictions'), 
          where('type', '==', type)
        );
      } else if (isVip) {
        q = query(
          collection(db, 'predictions'), 
          where('type', '==', type),
          where('status', '==', statusToQuery)
        );
      } else {
        q = query(
          collection(db, 'predictions'), 
          where('type', '==', type),
          where('status', '==', statusToQuery),
          where('visibility', 'in', ['public', 'sample'])
        );
      }
      
      const querySnapshot = await getDocs(q);
      const docs: any[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) }));
      // Sort client-side to avoid composite index requirements
      docs.sort((a, b) => {
         const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
         const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
         return tB - tA;
      });
      return docs;
    } catch (err) {
      console.error('getPredictions error:', err);
      return [];
    }
  },

  async getPredictionBySlug(slug: string, role: string = 'user', isVip: boolean = false) {
    try {
      let q: any;
      if (role === 'admin') {
         q = query(collection(db, 'predictions'), where('slug', '==', slug), limit(1));
      } else if (isVip) {
         q = query(collection(db, 'predictions'), where('slug', '==', slug), where('status', 'in', ['published', 'settled']), limit(1));
      } else {
         q = query(collection(db, 'predictions'), where('slug', '==', slug), where('status', 'in', ['published', 'settled']), where('visibility', 'in', ['public', 'sample']), limit(1));
      }
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...(docData.data() as Record<string, any>) };
    } catch (err) {
      console.error('getPredictionBySlug error:', err);
      return null;
    }
  },

  async getBlogPosts() {
    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('getBlogPosts error:', err);
      return [];
    }
  },

  async getBlogPostBySlug(slug: string) {
    try {
      const q = query(collection(db, 'blogs'), where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    } catch (err) {
      console.error('getBlogPostBySlug error:', err);
      return null;
    }
  },

  async getBanks() {
    try {
      const q = query(collection(db, 'banks'), where('active', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('getBanks error:', err);
      return [];
    }
  },

  async getSliderItems() {
    try {
      const q = query(collection(db, 'slider'), where('active', '==', true));
      const querySnapshot = await getDocs(q);
      const items: any[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) }));
      items.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      return items;
    } catch (err) {
      console.error('getSliderItems error:', err);
      return [];
    }
  }
};
