# Testing en Múltiples Dispositivos

## Herramientas de Testing Recomendadas

### 1. Chrome DevTools (Gratis)
- Abre DevTools con F12 o Cmd+Option+I
- Ve a **Device Toolbar** (Ctrl+Shift+M)
- Prueba con diferentes dispositivos predefinidos:
  - iPhone 14, 14 Pro, 14 Pro Max
  - iPhone 12, 13
  - Pixel 7, Pixel 5
  - iPad Pro, iPad Air
  - Galaxy S21, S22, S23

### 2. Firefox Developer Tools (Gratis)
- Abre DevTools con F12
- Ve a **Responsive Design Mode** (Ctrl+Shift+M)
- Selecciona dispositivos predefinidos

### 3. Safari (Mac)
- Abre DevTools con Cmd+Option+I
- Ve a **Develop → Enter Responsive Design Mode**
- Prueba con iPhone y iPad

### 4. BrowserStack (Pago)
- browserstack.com
- Prueba en dispositivos reales remotos
- Soporta iOS, Android, Windows, Mac

## Tamaños de Pantalla Clave para Testear

```
- Mobile: 375px (iPhone SE), 393px (Pixel 5), 428px (iPhone 14 Pro Max)
- Tablet: 768px (iPad), 820px (iPad Pro)
- Desktop: 1024px, 1366px, 1920px
- Ultra-wide: 2560px
```

## Checklist de Testing para Temas

### Aplicación Visual
- [ ] El tema se aplica inmediatamente al cargar
- [ ] El tema se aplica correctamente al cambiar en settings
- [ ] Los colores son consistentes en todas las páginas
- [ ] El tema persiste después de recargar la página

### Dispositivos Móviles
- [ ] iPhone (iOS 15+)
- [ ] Android (8+)
- [ ] Tablet (iPad, Samsung Tab)
- [ ] Pantalla pequeña (375px)

### Navegadores
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Samsung Internet

### Orientaciones
- [ ] Portrait (vertical)
- [ ] Landscape (horizontal)

### Contraste y Accesibilidad
- [ ] El texto es legible en todos los temas
- [ ] La proporción de contraste es 4.5:1 mínimo (WCAG AA)
- [ ] Los bordes neon glow son visibles en luz natural y oscura

## Verificar Compatibilidad CSS

Abre la consola (F12) y verifica:

```javascript
// Verificar que las variables CSS estén definidas
const style = getComputedStyle(document.documentElement);
console.log('Primary:', style.getPropertyValue('--color-primary'));
console.log('Background:', style.getPropertyValue('--color-background'));
console.log('Theme:', document.documentElement.getAttribute('data-theme'));
```

## Test de Rendimiento

- **Lighthouse (Chrome DevTools)**
  - Ve a Performance tab
  - Busca: "Theme Load Time" < 100ms
  - CLS (Cumulative Layout Shift) debe ser 0 (sin parpadeos)

## Reportar Problemas

Si encuentras un problema en un dispositivo específico:
1. Anota el dispositivo (iPhone 14 Pro, Galaxy S23, etc.)
2. Anota el navegador (Safari 16.1, Chrome 120, etc.)
3. Describe el problema (tema no se aplica, colores incorrectos, etc.)
4. Adjunta screenshot si es posible
5. Verifica la consola (F12 → Console) para errores
