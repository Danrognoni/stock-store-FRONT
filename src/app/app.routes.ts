import { Routes } from '@angular/router';

import { Login } from './pages/user/login/login';
import { Register } from './pages/user/register/register';
import { ForgotPassword } from './pages/user/forgot-password/forgot-password';

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

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeLayout },

  // Sección Autenticación
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },

  // Sección Productos
  {
    path: 'products',
    component: ProductLayout,
    children: [
      { path: '', redirectTo: 'productList', pathMatch: 'full' },
      { path: 'productList', component: ProductListComponent },
      { path: 'createProduct', component: ProductForm },
      { path: 'editProduct/:id', component: ProductForm },
      { path: 'productDetail/:id', component: ProductDetail }
    ]
  },

  // Sección Proveedores
  {
    path: 'suppliers',
    component: SupplierLayout,
    children: [
      { path: '', redirectTo: 'supplierList', pathMatch: 'full' },
      { path: 'supplierList', component: SupplierList },
      { path: 'createSupplier', component: SupplierForm },
      { path: 'editSupplier/:id', component: SupplierForm },
      { path: 'supplierDetail/:id', component: SupplierDetail },
      { path: 'supplierOrder/:id', component: SupplierOrderComponent }
    ]
  },

  // Sección Inventario
  {
    path: 'inventory',
    component: InventoryItemLayout,
    children: [
      { path: '', redirectTo: 'inventoryList', pathMatch: 'full' },
      { path: 'inventoryList', component: InventoryItemList },
      { path: 'createInventoryItem', component: InventoryItemForm },
      { path: 'editInventoryItem/:id', component: InventoryItemForm },
      { path: 'inventoryItemDetail/:id', component: InventoryItemDetail }
    ]
  },

  // Sección Categoría
  /*{
    path: 'categories',
    component: CategoryLayout,
    children: [
      { path: '', redirectTo: 'categoryListComponent', pathMatch: 'full' },
      { path: 'categoryListComponent', component: CategoryListComponent },
      { path: 'createCategory', component: CategoryFormComponent },
      { path: 'editCategory/:id', component: CategoryFormComponent }
    ]
  }*/

  // Secciones Individuales
  {
    path: 'store',
    component: OnlineStoreLayout,
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
