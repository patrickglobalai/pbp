import { setupFirebaseCollections } from './src/lib/firebase-setup';

// Run the setup
setupFirebaseCollections()
  .then(() => {
    console.log('Setup complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });