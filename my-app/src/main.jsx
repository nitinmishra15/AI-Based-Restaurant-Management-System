import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import '@fontsource/poppins';
import { CartProvider } from './app/providers/CartProvider.jsx'
import { AuthProvider } from './app/providers/AuthContextApi/AuthProvider.jsx'
import { MenuProvider } from './app/providers/MenuContextApi/MenuProvider.jsx'
import { TableProvider } from './app/providers/TableContextApi/TableProvider.jsx'
import StaffProvider from './app/providers/StaffContextApi/StaffProvider.jsx'
import { InventoryProvider } from './app/providers/InventoryContextApi/InventoryProvider.jsx'
import { OfferProvider } from './app/providers/OfferContextApi/OfferProvider.jsx'

createRoot(document.getElementById('root')).render(
  <TableProvider>
    <AuthProvider>
      <MenuProvider>
        <StaffProvider>
          <InventoryProvider>
            <OfferProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </OfferProvider>
          </InventoryProvider>
        </StaffProvider>
      </MenuProvider>
    </AuthProvider>
  </TableProvider>
);
