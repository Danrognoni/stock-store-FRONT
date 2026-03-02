import { Router, Routes } from '@angular/router';

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

// Componentes de "Categoria"
import { CategoryListComponent } from './pages/category/category-list-component/category-list-component';
import { CategoryFormComponent } from './pages/category/category-form-component/category-form-component';

// Componente "Carrito"
import { Cart } from './pages/cart/cart';
import { HomeLayout } from './components/navbar/home-layout/home-layout';
import { ProductLayout } from './components/navbar/stock-manager/product-layout/product-layout';
import { SupplierLayout } from './components/navbar/stock-manager/supplier-layout/supplier-layout';
import { InventoryItemLayout } from './components/navbar/stock-manager/inventory-item-layout/inventory-item-layout';
import { OnlineStoreLayoutComponent as OnlineStoreLayout } from './components/navbar/online-store/online-store-layout/online-store-layout';
import { AuthenticationLayout } from './components/navbar/authentication/authentication-layout/authentication-layout';
import { LoginComponent } from './pages/login/login-component/login-component';
import { RegisterComponent } from './pages/register/register-component/register-component';
import { AuthGuard } from './guard/auth-guard/auth-guard';
import { roleGuard } from './guard/role-guard';
import { StoreCatalogComponent } from './pages/online-store/catalog/catalog';
import { ForgotPassword } from './pages/user/forgot-password/forgot-password';
import { UserDetail } from './pages/user/user-detail/user-detail';
import { WishlistComponent } from './pages/online-store/wishlist/wishlist';
import { OrderListComponent } from './pages/online-store/order-list/order-list';
import { UserList } from './pages/admin/user-list/user-list';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { SupplierOrderListComponent } from './pages/supplier/supplier-order-list/supplier-order-list';
import { UserUpdate } from './pages/user/user-update/user-update';
import { inject } from '@angular/core';
import { AuthenticationService } from './services/authentication-service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },

  {
    path: "auth",
    component: AuthenticationLayout,
    canActivate: [(route, state) => {
      const authService = inject(AuthenticationService);
      const router = inject(Router);
      if (authService.currentUser()) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    }],
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      {
        path: "forgot-password", component: ForgotPassword
      }

    ]
  },
  {
    path: "home",
    component: HomeLayout,
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['ADMIN', 'EMPLOYEE'] },
    children: [
      {
        path: 'profile',
        component: UserDetail,
        data: { roles: ['ADMIN', 'EMPLOYEE'] }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'supplier-orders', component: SupplierOrderListComponent },
      {
        path: 'user/update/:id',
        component: UserUpdate,
        canActivate: [AuthGuard, roleGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },
  // Sección Productos
  {
    path: 'products',
    component: ProductLayout,
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['EMPLOYEE', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ProductListComponent },
      { path: 'create', component: ProductForm },
      { path: 'edit/:id', component: ProductForm },
      { path: 'detail/:id', component: ProductDetail },
      { path: 'category/create', component: CategoryFormComponent },
      { path: 'category/list', component: CategoryListComponent },
      { path: 'category/edit/:id', component: CategoryFormComponent }
    ]
  },

  // Sección Proveedores
  {
    path: 'suppliers',
    component: SupplierLayout,
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['EMPLOYEE', 'ADMIN'] },
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
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['EMPLOYEE', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: InventoryItemList },
      { path: 'create', component: InventoryItemForm },
      { path: 'edit/:id', component: InventoryItemForm },
    ]
  },
  {
    path: 'admin',
    component: HomeLayout,
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        component: UserList,
        canActivate: [AuthGuard, roleGuard],
        data: { roles: ['ADMIN'] }
      }
    ]
  },
  {
    path: 'online-store',
    component: OnlineStoreLayout,
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['USER', 'EMPLOYEE', 'ADMIN'] },
    children: [
      {
        path: '',
        component: StoreCatalogComponent
      },
      {
        path: 'product/:id',
        component: ProductDetail
      },
      {
        path: 'cart',
        component: Cart,
        canActivate: [roleGuard],
        data: { roles: ['USER'] }
      },
      {
        path: 'profile',
        component: UserDetail,
        data: { roles: ['USER', 'EMPLOYEE', 'ADMIN'] }
      },
      { path: 'wishlist', component: WishlistComponent, canActivate: [roleGuard], data: { roles: ['USER'] } },
      { path: 'order', component: OrderListComponent, canActivate: [roleGuard], data: { roles: ['USER'] } },
      { path: 'category/list', component: CategoryListComponent },
    ]
  }
];
