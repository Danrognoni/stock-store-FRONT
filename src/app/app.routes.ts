import { Routes } from '@angular/router';

// Componentes Generales y de Navegación
import { HomeLayout } from './components/home-layout/home-layout';
import { CategoryLayout } from './components/category-layout/category-layout';
import { OnlineStoreLayout } from './components/online-store-layout/online-store-layout';

// Componentes de "Productos"
import { ProductLayout } from './components/product-layout/product-layout';
import { ProductListComponent } from './pages/product/product-list-component/product-list-component';
import { ProductForm } from './pages/product/product-form/product-form';
import { ProductDetail } from './pages/product/product-detail/product-detail';

// Componentes de "Proveedores"
import { SupplierLayout } from './components/supplier-layout/supplier-layout';
import { SupplierList } from './pages/supplier/supplier-list/supplier-list';
import { SupplierForm } from './pages/supplier/supplier-form/supplier-form';
import { SupplierDetail } from './pages/supplier/supplier-detail/supplier-detail';
import { SupplierOrderComponent } from './pages/supplier/supplier-order/supplier-order';

// Componentes de "Inventario"
import { InventoryItemLayout } from './components/inventory-item-layout/inventory-item-layout';
import { InventoryItemList } from './pages/inventory-item/inventory-item-list/inventory-item-list';
import { InventoryItemForm } from './pages/inventory-item/inventory-item-form/inventory-item-form';
import { InventoryItemDetail } from './pages/inventory-item/inventory-item-detail/inventory-item-detail';

// Componentes de "Categoria"
import { CategoryListComponent } from './pages/category/category-list-component/category-list-component';
import { CategoryFormComponent } from './pages/category/category-form-component/category-form-component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeLayout },

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

  // Seccion Categoria
  {
    path: 'categories',
    component: CategoryLayout,
    children: [
      { path: '', redirectTo: 'categoryListComponent', pathMatch: 'full' },
      { path: 'categoryListComponent', component: CategoryListComponent },
      { path: 'createCategory', component: CategoryFormComponent },
      { path: 'editCategory/:id', component: CategoryFormComponent }
    ]
  },

  // Secciones Individuales
  {
    path: 'categories',
    component: CategoryLayout
  },
  {
    path: 'store',
    component: OnlineStoreLayout
  },

  { path: '**', redirectTo: 'home' }
];
