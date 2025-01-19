
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { PrimeReactProvider} from 'primereact/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </PrimeReactProvider>
)
