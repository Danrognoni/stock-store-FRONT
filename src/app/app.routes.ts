import { Routes } from '@angular/router';
import { HomeLayout } from './components/home-layout/home-layout';
import { CategoryLayout } from './components/category-layout/category-layout';
import { OnlineStoreLayout } from './components/online-store-layout/online-store-layout';

// Layouts (Wrappers)
import { ProductLayout } from './components/product-layout/product-layout';
import { SupplierLayout } from './components/supplier-layout/supplier-layout';
import { InventoryItemLayout } from './components/inventory-item-layout/inventory-item-layout';

// Pages
import { ProductListComponent } from './pages/product/product-list-component/product-list-component';
import { ProductForm } from './pages/product/product-form/product-form';
import { ProductDetail } from './pages/product/product-detail/product-detail';

import { SupplierList } from './pages/supplier/supplier-list/supplier-list';
import { SupplierForm } from './pages/supplier/supplier-form/supplier-form';
import { SupplierDetail } from './pages/supplier/supplier-detail/supplier-detail';
import { SupplierOrderComponent } from './pages/supplier/supplier-order/supplier-order';

import { InventoryItemList } from './pages/inventory-item/inventory-item-list/inventory-item-list';
import { InventoryItemForm } from './pages/inventory-item/inventory-item-form/inventory-item-form';
import { InventoryItemDetail } from './pages/inventory-item/inventory-item-detail/inventory-item-detail';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeLayout, title: 'Inicio' },

    // PRODUCTOS (Usa ProductLayout como wrapper)
    {
        path: 'products',
        component: ProductLayout,
        children: [
            { path: '', component: ProductListComponent, title: 'Lista de Productos' },
            { path: 'new', component: ProductForm, title: 'Nuevo Producto' },
            { path: 'edit/:id', component: ProductForm, title: 'Editar Producto' },
            { path: ':id', component: ProductDetail, title: 'Detalle de Producto' },
        ]
    },

    // PROVEEDORES (Usa SupplierLayout como wrapper)
    {
        path: 'suppliers',
        component: SupplierLayout,
        children: [
            { path: '', component: SupplierList, title: 'Lista de Proveedores' },
            { path: 'new', component: SupplierForm, title: 'Nuevo Proveedor' },
            { path: 'edit/:id', component: SupplierForm, title: 'Editar Proveedor' },
            { path: 'order/:id', component: SupplierOrderComponent, title: 'Orden de Compra' },
            { path: ':id', component: SupplierDetail, title: 'Detalle de Proveedor' },
        ]
    },

    // INVENTARIO (Usa InventoryItemLayout como wrapper)
    {
        path: 'inventory',
        component: InventoryItemLayout,
        children: [
            { path: '', component: InventoryItemList, title: 'Control de Inventario' },
            { path: 'new', component: InventoryItemForm, title: 'Nuevo Item' },
            { path: 'edit/:id', component: InventoryItemForm, title: 'Editar Item' },
            { path: ':id', component: InventoryItemDetail, title: 'Detalle de Item' },
        ]
    },

    // SECCIONES INDIVIDUALES (Sin hijos)
    { path: 'categories', component: CategoryLayout, title: 'Gestión de Categorías' },
    { path: 'store', component: OnlineStoreLayout, title: 'Tienda Online' },

    { path: '**', redirectTo: 'home' }
];
