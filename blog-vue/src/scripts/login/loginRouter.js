export function routeUser(userType, router) {
  switch (userType) {
    case 'editor':
      router.push({ name: 'editor' })
      break
    case 'writer':
      router.push({ name: 'writer' })
      break
    default:
  }
}
