import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    console.log('Checking admin status for user:', userId);
    
    // Single query to check user role and admin status
    const userQuery = query(
      collection(db, 'users'),
      where('userId', '==', userId),
      where('role', '==', 'admin')
    );
    
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      console.log('User is not an admin');
      return false;
    }

    // Get admin permissions
    const adminQuery = query(
      collection(db, 'admins'),
      where('userId', '==', userId)
    );
    
    const adminSnapshot = await getDocs(adminQuery);
    if (adminSnapshot.empty) {
      console.log('No admin permissions found');
      return false;
    }

    const adminData = adminSnapshot.docs[0].data();
    console.log('Admin permissions:', adminData.permissions);

    // Check if admin has any active permissions
    const hasPermissions = adminData.permissions && 
      Object.values(adminData.permissions).some(value => value === true);
    
    console.log('Has active permissions:', hasPermissions);
    return hasPermissions;

  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}