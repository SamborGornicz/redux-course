import { Auth } from '@supabase/ui'
import { Provider } from 'react-redux'

import Container from "./components/Container";
import { supabase } from "./lib/api";
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Container />
      </Auth.UserContextProvider>
    </Provider>
  );
}
