import { persisted } from 'svelte-local-storage-store'
import type { SessionStore } from '$types/local_types';

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/
export const sessionStore = persisted('sessionStore', {
    name: 'webapp',
    loggedIn: false,
    model: undefined,
} as SessionStore);
