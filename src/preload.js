document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('keydown', (event) => {
    if (document.activeElement.tagName === 'INPUT') {
      return
    }
    if (event.key === 'Escape') {
      document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock
      document.exitPointerLock()
    }
  })
}, false)
