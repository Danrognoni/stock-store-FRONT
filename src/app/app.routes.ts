import { Routes } from '@angular/router';

// Componentes de "Productos"
import { ProductListComponent } from './pages/product/product-list-component/product-list-component';
import { ProductForm } from './pages/product/product-form/product-form';
import { ProductDetail } from './pages/product/product-detail/product-detail';

// Componentes de "Proveedores"
import { SupplierList } from './pages/supplier/supplier-list/supplier-list';
import { SupplierForm } from './pages/supplier/supplier-form/supplier-form';
import { SupplierDetail } from './pages/supplier/supplier-detail/supplier-detail';
import { SupplierOrderComponent } from './pages/supplier/supplier-order/supplier-order';

// Componentes de "Inventario"
import { InventoryItemList } from './pages/inventory-item/inventory-item-list/inventory-item-list';
import { InventoryItemForm } from './pages/inventory-item/inventory-item-form/inventory-item-form';
import { InventoryItemDetail } from './pages/inventory-item/inventory-item-detail/inventory-item-detail';

// Componentes de "Categoria"
import { CategoryListComponent } from './pages/category/category-list-component/category-list-component';
import { CategoryFormComponent } from './pages/category/category-form-component/category-form-component';

// Componente "Carrito"
import { Cart } from './pages/cart/cart';
import { HomeLayout } from './components/navbar/home-layout/home-layout';
import { ProductLayout } from './components/navbar/stock-manager/product-layout/product-layout';
import { SupplierLayout } from './components/navbar/stock-manager/supplier-layout/supplier-layout';
import { InventoryItemLayout } from './components/navbar/stock-manager/inventory-item-layout/inventory-item-layout';
import { OnlineStoreLayout } from './components/navbar/online-store/online-store-layout/online-store-layout';
import { LocalStoreLayout } from './components/navbar/local-store/local-store-layout/local-store-layout';
import { AuthenticationLayout } from './components/navbar/authentication/authentication-layout/authentication-layout';
import { LoginComponent } from './pages/login/login-component/login-component';
import { RegisterComponent } from './pages/register/register-component/register-component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  // Sección Autenticación
  {
    path: "auth",
    component: AuthenticationLayout,
    children: [
      {path: "login", component: LoginComponent},
      {path: "register", component: RegisterComponent}
    ]
  },
  {
    path:"home",
    component: HomeLayout
  },
  // Sección Productos
  {
    path: 'products',
    component: ProductLayout,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ProductListComponent },
      { path: 'create', component: ProductForm },
      { path: 'edit/:id', component: ProductForm },
      { path: 'detail/:id', component: ProductDetail }
    ]
  },

  // Sección Proveedores
  {
    path: 'suppliers',
    component: SupplierLayout,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: SupplierList },
      { path: 'create', component: SupplierForm },
      { path: 'edit/:id', component: SupplierForm },
      { path: 'detail/:id', component: SupplierDetail },
      { path: 'order/:id', component: SupplierOrderComponent }
    ]
  },

  // Sección Inventario
  {
    path: 'inventory',
    component: InventoryItemLayout,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: InventoryItemList },
      { path: 'create', component: InventoryItemForm },
      { path: 'edit/:id', component: InventoryItemForm },
      { path: 'detail/:id', component: InventoryItemDetail }
    ]
  },

  /*{
    path:'local-store',
    component: LocalStoreLayout
  },
  {
    path:'online-store',
    component: OnlineStoreLayout
  },*/
];
