import { createRouter, createWebHashHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'

const routesAuth = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/AuthIndex.vue'),
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/views/auth/login/AuthLogin.vue'),
        meta: { logout: true },
        props: route => ({
          index: () => router.push(route.query.next || '/home'),
          buzon: () => router.push(route.query.next && (route.query.next !== '/index')
            ? route.query.next : { name: 'buzon' }),
          unauthorized: () => router.push({ name: 'auth-unauthorized' }),
        })
      },
      {
        path: 'unauthorized',
        name: 'auth-unauthorized',
        component: () => import('@/views/auth/unauthorized/AuthUnauthorized.vue'),
        meta: { requiresAuth: true, buzon: true }
      },
      {
        path: 'impersonate',
        name: 'auth-impersonate',
        component: () => import('@/views/auth/impersonate/AuthImpersonate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'logout',
        name: 'auth-logout',
        component: () => import('@/views/auth/logout/AuthLogout.vue'),
        meta: { logout: true }
      },
      {
        path: 'expired',
        name: 'auth-expired',
        component: () => import('@/views/auth/expired/AuthExpired.vue'),
        meta: { logout: true },
        beforeEnter: (to, from) => replaceQuery(to, 'next', from ? from.fullPath : '/'),
        props: route => ({ next: route.query.next })
      }
    ]
  }
]

const routesDespachador = [
  {
    path: '/despachador',
    name: 'despachador',
    redirect: { name: 'despachador-areas' },
    component: () => import('@/views/despachador/DespachadorIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'areas',
        name: 'despachador-areas',
        component: () => import('@/views/despachador/areas/DespachadorAreas.vue'),
        props: ({ query }) => ({
          territorio_id: query.territorio ? parseInt(query.territorio) : null
        })
      },
      {
        path: 'areas/:id',
        name: 'despachador-area',
        redirect: { name: 'despachador-area-area' },
        component: () => import('@/views/despachador/area/DespachadorAreaIndex.vue'),
        props: route => ({
          area_id: parseInt(route.params.id),
        }),
        children: [
          {
            path: '',
            name: 'despachador-area-area',
            component: () => import('@/views/despachador/area/DespachadorArea.vue'),
          },
          {
            path: 'sms',
            name: 'despachador-area-sms',
            component: () => import('@/views/despachador/area/sms/AreaSms.vue'),
            props: () => ({
              back: () => router.push({ name: 'despachador-area' }),
            })
          },
          {
            path: 'ra/ordenes',
            name: 'despachador-area-ra-ordenes',
            component: () => import('@/views/despachador/area/ra/ordenes/RaOrdenes.vue'),
            meta: { area: { option: 'RA Órdenes de Servicio' } }
          },
          {
            path: 'ra/reportes/asignaciones',
            name: 'despachador-area-ra-asignaciones',
            component: () => import('@/views/despachador/area/ra/reportes/asignaciones/RaAsignaciones.vue'),
            meta: { area: { option: 'RA Asignaciones' } }
          },
          {
            path: 'ra/reportes/manual',
            name: 'despachador-area-ra-manual',
            component: () => import('@/views/despachador/area/ra/reportes/manual/RaManual.vue'),
            meta: { area: { option: 'RA Despacho manual' } }
          },
          {
            path: 'tp/reportes/asignaciones',
            name: 'despachador-area-tp-asignaciones',
            component: () => import('@/views/despachador/area/tp/reportes/asignaciones/TpAsignaciones.vue'),
            meta: { area: { option: 'TP Asignaciones' } }
          },
          {
            path: 'tp/reportes/manual',
            name: 'despachador-area-tp-manual',
            component: () => import('@/views/despachador/area/tp/reportes/manual/TpManual.vue'),
            meta: { area: { option: 'TP Despacho manual' } }
          },
        ]
      }
    ]
  }
]

const routesBuzon = [
  {
    path: '/buzon',
    name: 'buzon',
    redirect: { name: 'buzon-home' },
    component: () => import('@/views/buzon/BuzonIndex.vue'),
    meta: { requiresAuth: true, buzon: true },
    children: [
      {
        path: '',
        name: 'buzon-home',
        component: () => import('@/views/buzon/home/BuzonHome.vue'),
      },
      {
        path: 'ra/reportes',
        name: 'buzon-ra-reportes',
        component: () => import('@/views/buzon/ra/reportes/RaReportes.vue'),
        props: () => ({
          cerrar: folio => router.push({ name: 'buzon-ra-reporte-cierre', params: { folio } }),
        }),
        children: [
          {
            path: ':folio/cierre',
            name: 'buzon-ra-reporte-cierre',
            component: () => import('@/views/buzon/ra/reportes/cierre/ReporteCierre.vue'),
            props: route => ({
              folio: parseInt(route.params.folio),
              back: () => router.push({ name: 'buzon-ra-reportes' })
            }),
          }
        ]
      },
      {
        path: 'tp/reportes',
        name: 'buzon-tp-reportes',
        component: () => import('@/views/buzon/tp/reportes/reportes/TpReportes.vue'),
        props: () => ({
          operar: id => router.push({ name: 'buzon-tp-reporte', params: { id } }),
        }),
        children: [
          {
            path: ':id',
            name: 'buzon-tp-reporte',
            component: () => import('@/views/buzon/tp/reportes/reporte/TpReporte.vue'),
            props: route => ({
              id: parseInt(route.params.id),
              back: () => router.push({ name: 'buzon-tp-reportes' }),
              // actualizar: () => router.push({ name: 'buzon-tp-reporte-actualizar' }),
              // cerrar: () => router.push({ name: 'buzon-tp-reporte-cerrar' }),
            }),
          },
          // {
          //   path: ':numero_telefonico/actualizar',
          //   name: 'buzon-tp-reporte-actualizar',
          //   component: () => import('@/views/buzon/tp/reportes/actualizar/ReporteActualizar.vue'),
          //   props: route => ({
          //     numero_telefonico: parseInt(route.params.numero_telefonico),
          //     back: () => router.push({ name: 'buzon-tp-reportes' })
          //   }),
          // },
          // {
          //   path: ':numero_telefonico/cerrar',
          //   name: 'buzon-tp-reporte-cerrar',
          //   component: () => import('@/views/buzon/tp/reportes/cerrar/ReporteCerrar.vue'),
          //   props: route => ({
          //     numero_telefonico: parseInt(route.params.numero_telefonico),
          //     back: () => router.push({ name: 'buzon-tp-reportes' })
          //   }),
          // }
        ]
      }
    ]
  }
]

const routesDashboard = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: { name: 'dashboard-home' },
    component: () => import('@/views/dashboard/DashboardIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('@/views/dashboard/home/DashboardHome.vue')
      },
      {
        path: 'tables',
        name: 'dashboard-tables',
        component: () => import('@/views/dashboard/tables/DashboardTables.vue')
      },
      {
        path: 'scripts',
        name: 'dashboard-scripts',
        component: () => import('@/views/dashboard/scripts/DashboardScripts.vue'),
        beforeEnter: to => replaceQuery(to, 'periodo', 1),
        props: route => ({ periodo: route.query.periodo })
      },
      {
        path: 'sms',
        name: 'dashboard-sms',
        component: () => import('@/views/dashboard/sms/DashboardSms.vue'),
        beforeEnter: to => replaceQuery(to, 'periodo', 1),
        props: route => ({ periodo: route.query.periodo })
      }
    ]
  }
]

const routesAdmin = [
  {
    path: '/admin',
    name: 'admin',
    redirect: { name: 'admin-home' },
    component: () => import('@/views/admin/AdminIndex.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-home',
        component: () => import('@/views/admin/home/AdminHome.vue')
      },
      {
        path: 'users',
        name: 'admin-users-index',
        component: () => import('@/views/admin/user/AdminUsersIndex.vue'),
        children: [
          {
            path: '',
            name: 'admin-users',
            component: () => import('@/views/admin/user/users/AdminUsers.vue'),
            props: route => ({
              grid: route.name === 'admin-users',
              newItem: () => router.push({ name: 'admin-users-new', params: {} }),
              linkItem: id => router.push({ name: 'admin-user-details', params: { id } }),
            }),
            children: [
              {
                path: ':id',
                name: 'admin-user',
                component: () => import('@/views/admin/user/user/AdminUser.vue'),
                props: route => ({ id: parseInt(route.params.id) }),
                children: [
                  {
                    path: '',
                    name: 'admin-user-details',
                    component: () => import('@/views/admin/user/user/details/UserDetails.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'admin-users' }),
                    }),
                    children: [
                      {
                        path: 'del',
                        name: 'admin-user-del',
                        component: () => import('@/views/admin/user/user/del/UserDel.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-users' }),
                          cancel: () => router.push({ name: 'admin-user-details' }),
                          block: () => router.push({ name: 'admin-user-block' }),
                        })
                      },
                      {
                        path: 'block',
                        name: 'admin-user-block',
                        component: () => import('@/views/admin/user/user/block/UserBlock.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-user-details' }),
                        })
                      },
                    ]
                  },
                  {
                    path: 'edit',
                    name: 'admin-user-edit',
                    component: () => import('@/views/admin/user/user/edit/UserEditForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-user-details' }),
                    })
                  },
                  {
                    path: 'areas',
                    name: 'admin-user-areas',
                    component: () => import('@/views/admin/user/user/areas/UserAreasForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-user-details' }),
                    })
                  },
                  {
                    path: 'grupos',
                    name: 'admin-user-grupos',
                    component: () => import('@/views/admin/user/user/grupos/UserGruposForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-user-details' }),
                    })
                  },
                  {
                    path: 'meta',
                    name: 'admin-user-meta',
                    component: () => import('@/views/admin/user/user/meta/UserMeta.vue'),
                    props: () => ({ back: () => router.push({ name: 'admin-user-details' }), })
                  }
                ]
              }
            ]
          },
          {
            path: 'new',
            name: 'admin-users-new',
            component: () => import('@/views/admin/user/new/UserNewWizard.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-users' }),
            }),
          },
        ]
      },
      {
        path: 'zonas',
        name: 'admin-zonas-index',
        component: () => import('@/views/admin/zona/AdminZonasIndex.vue'),
        children: [
          {
            path: '',
            name: 'admin-zonas',
            component: () => import('@/views/admin/zona/zonas/AdminZonas.vue'),
            props: route => ({
              grid: route.name === 'admin-zonas',
              newItem: () => router.push({ name: 'admin-zonas-new', params: {} }),
              linkItem: id => router.push({ name: 'admin-zona-details', params: { id } }),
            }),
            children: [
              {
                path: ':id',
                name: 'admin-zona',
                component: () => import('@/views/admin/zona/zona/AdminZona.vue'),
                props: route => ({ id: parseInt(route.params.id) }),
                children: [
                  {
                    path: '',
                    name: 'admin-zona-details',
                    component: () => import('@/views/admin/zona/zona/details/ZonaDetails.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'admin-zonas' }),
                    }),
                    children: [
                      {
                        path: 'del',
                        name: 'admin-zona-del',
                        component: () => import('@/views/admin/zona/zona/del/ZonaDel.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-zonas' }),
                          cancel: () => router.push({ name: 'admin-zona-details' }),
                        })
                      }
                    ]
                  },
                  {
                    path: 'edit',
                    name: 'admin-zona-edit',
                    component: () => import('@/views/admin/zona/zona/edit/ZonaEditForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-zona-details' }),
                    })
                  },
                  {
                    path: 'meta',
                    name: 'admin-zona-meta',
                    component: () => import('@/views/admin/zona/zona/meta/ZonaMeta.vue'),
                    props: () => ({ back: () => router.push({ name: 'admin-zona-details' }), })
                  }
                ]
              }
            ]
          },
          {
            path: 'new',
            name: 'admin-zonas-new',
            component: () => import('@/views/admin/zona/new/ZonaNewForm.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-zonas' }),
            }),
          }
        ]
      },
      {
        path: 'destinatarios',
        name: 'admin-destinatarios-index',
        component: () => import('@/views/admin/destinatario/AdminDestinatariosIndex.vue'),
        children: [
          {
            path: '',
            name: 'admin-destinatarios',
            component: () => import('@/views/admin/destinatario/destinatarios/AdminDestinatarios.vue'),
            props: route => ({
              grid: route.name === 'admin-destinatarios',
              newItem: () => router.push({ name: 'admin-destinatarios-new', params: {} }),
              linkItem: id => router.push({ name: 'admin-destinatario-details', params: { id } }),
            }),
            children: [
              {
                path: ':id',
                name: 'admin-destinatario',
                component: () => import('@/views/admin/destinatario/destinatario/AdminDestinatario.vue'),
                props: route => ({ id: parseInt(route.params.id) }),
                children: [
                  {
                    path: '',
                    name: 'admin-destinatario-details',
                    component: () => import('@/views/admin/destinatario/destinatario/details/DestinatarioDetails.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'admin-destinatarios' }),
                    }),
                    children: [
                      {
                        path: 'del',
                        name: 'admin-destinatario-del',
                        component: () => import('@/views/admin/destinatario/destinatario/del/DestinatarioDel.vue'),
                        props: () => ({
                          back: () => router.push({ name: 'admin-destinatarios' }),
                          cancel: () => router.push({ name: 'admin-destinatario-details' }),
                        })
                      }
                    ]
                  },
                  {
                    path: 'edit',
                    name: 'admin-destinatario-edit',
                    component: () => import('@/views/admin/destinatario/destinatario/edit/DestinatarioEditForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-destinatario-details' }),
                    })
                  },
                  {
                    path: 'areas',
                    name: 'admin-destinatario-areas',
                    component: () => import('@/views/admin/destinatario/destinatario/areas/DestinatarioAreasForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-destinatario-details' }),
                    })
                  },
                  {
                    path: 'smsgrupos',
                    name: 'admin-destinatario-smsgrupos',
                    component: () => import('@/views/admin/destinatario/destinatario/smsgrupos/DestinatarioSmsgruposForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-destinatario-details' }),
                    })
                  },
                  {
                    path: 'grupos',
                    name: 'admin-destinatario-grupos',
                    component: () => import('@/views/admin/destinatario/destinatario/grupos/DestinatarioGruposForm.vue'),
                    props: route => ({
                      id: parseInt(route.params.id),
                      back: () => router.push({ name: 'admin-destinatario-details' }),
                    })
                  },
                  {
                    path: 'meta',
                    name: 'admin-destinatario-meta',
                    component: () => import('@/views/admin/destinatario/destinatario/meta/DestinatarioMeta.vue'),
                    props: () => ({ back: () => router.push({ name: 'admin-destinatario-details' }), })
                  }
                ]
              }
            ]
          },
          {
            path: 'new',
            name: 'admin-destinatarios-new',
            component: () => import('@/views/admin/destinatario/new/DestinatarioNewWizard.vue'),
            props: () => ({
              back: () => router.push({ name: 'admin-destinatarios' }),
            }),
          }
        ]
      }
    ]
  }
]

const routesApp = [
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/app/AppIndex.vue'),
    meta: { requiresAuth: true }
  },
]

// const routesInfo = [
//   {
//     path: '/info',
//     name: 'info',
//     component: () => import('@/views/app/AppInfo.vue'),
//     beforeEnter: (to, from) => replaceQuery(to, 'back', from ? from.fullPath : '/'),
//     props: route => ({
//       back: () => router.push(route.query.back),
//     })
//   },
// ]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...routesAuth,
    ...routesDespachador,
    ...routesBuzon,
    ...routesDashboard,
    ...routesAdmin,
    ...routesApp,
    // ...routesInfo,
    {
      path: '/home',
      name: 'home',
      alias: ['/'],
      redirect: '/index' // landing page
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

router.afterEach((to) => {
  const auth = useAuthStore()
  if (to.matched.some((record) => record.meta.logout)) auth.auth && auth.logout()
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (auth.auth === null) // browser navigation (initial state)
      await auth.getAuthUser()
    if (auth.auth) {
      // check if login is the required one
      if (to.matched.some(record => record.meta.buzon)) {
        if (!auth.authUser.destinatario) return { name: 'auth-login' }
      } else {
        if (!auth.authUser.username) return { name: 'auth-login' }
      }
    }
    else return { name: 'auth-login', query: { next: to.fullPath } }
  }
})

const replaceQuery = (to, query, value) => {
  if (!to.query[query]) return { path: to.path, query: { ...to.query, [query]: value } }
}