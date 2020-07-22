export default [
  {
    title: 'modulePart2',
    name: 'modulePart2',
    path: 'modulePart2',
    component: () => import('./modulePart2.vue'),
    children: [
      {
        title: 'part1',
        name: 'part1',
        path: 'part1',
        component: () => import('./part/part1.vue'),
      },
      {
        title: 'part2',
        name: 'part2',
        path: 'part2',
        component: () => import('./part/part2.vue'),
      },
      {
        title: 'part3',
        name: 'part3',
        path: 'part3',
        component: () => import('./part/part3.vue'),
      },

    ]
  }
]