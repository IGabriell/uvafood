import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { Planner } from './pages/Planner';
import { MapPage } from './pages/Map';
import { Tracking } from './pages/Tracking';
import { Restaurant } from './pages/Restaurant';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
const protectedPage = (page: ReactNode) => <ProtectedRoute>{page}</ProtectedRoute>;
export const router = createBrowserRouter([{ path: '/', element: <Layout />, children: [
  { index: true, element: <Home /> }, { path: 'cardapio', element: <Home /> }, { path: 'combos', element: <Home /> }, { path: 'bebidas', element: <Home /> },
  { path: 'login', element: <Login /> }, { path: 'restaurante/uvafood', element: <Restaurant /> }, { path: 'rastrear', element: protectedPage(<Tracking />) }, { path: 'carrinho', element: protectedPage(<Cart />) }, { path: 'perfil', element: protectedPage(<Planner />) }, { path: 'favoritos', element: protectedPage(<Planner mode="favorites" />) }, { path: 'pedidos', element: protectedPage(<Planner mode="orders" />) }, { path: 'mapa', element: <MapPage /> }, { path: '*', element: <Navigate to="/" replace /> },
]}]);
