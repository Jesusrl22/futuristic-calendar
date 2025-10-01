# Configuración de PayPal para FutureTask

## 📋 Resumen de Planes

### Suscripciones (con IVA incluido):
1. **Premium Mensual**: €2.49/mes (€2.06 + €0.43 IVA)
2. **Premium Anual**: €24.99/año (€20.65 + €4.34 IVA)
3. **Pro Mensual**: €4.99/mes (€4.12 + €0.87 IVA)
4. **Pro Anual**: €49.99/año (€41.31 + €8.68 IVA)

### Pagos Únicos - Créditos IA (con IVA incluido):
1. **Starter**: €2.99 (€2.47 + €0.52 IVA) - 100 créditos
2. **Popular**: €9.99 (€8.26 + €1.73 IVA) - 500 créditos
3. **Professional**: €17.99 (€14.87 + €3.12 IVA) - 1000 créditos
4. **Enterprise**: €39.99 (€33.05 + €6.94 IVA) - 2500 créditos

> **Nota**: Todos los precios incluyen IVA del 21% (España)

## 1. Crear Cuenta de PayPal Developer

1. Ve a [PayPal Developer](https://developer.paypal.com/)
2. Inicia sesión o crea una cuenta
3. Ve a "Dashboard" > "Apps & Credentials"

## 2. Crear una App de PayPal

1. Click en "Create App"
2. Nombre de la app: "FutureTask"
3. Tipo: "Merchant"
4. Click en "Create App"
5. Copia el **Client ID** y **Secret**

## 3. Crear los Planes de Suscripción

### 3.1. Ir a la sección de Productos

1. En el Dashboard, ve a "Products & Pricing" o accede directamente:
   - Sandbox: https://www.sandbox.paypal.com/billing/plans
   - Production: https://www.paypal.com/billing/plans

### 3.2. Crear Plan Premium Mensual

1. Click en "Create Plan"
2. Configura:
   - **Product name**: Premium Mensual
   - **Product type**: Service
   - **Product category**: Software
   - **Billing cycle**: Monthly
   - **Price**: €2.49 EUR (precio con IVA incluido)
   - **Tax**: Ya incluido en el precio
   - **Trial period**: None (o 7 días gratis si quieres)
3. Click "Save" y copia el **Plan ID**

### 3.3. Crear Plan Premium Anual

1. Click en "Create Plan"
2. Configura:
   - **Product name**: Premium Anual
   - **Product type**: Service
   - **Product category**: Software
   - **Billing cycle**: Yearly
   - **Price**: €24.99 EUR (precio con IVA incluido)
   - **Tax**: Ya incluido en el precio
   - **Trial period**: None
3. Click "Save" y copia el **Plan ID**

### 3.4. Crear Plan Pro Mensual

1. Click en "Create Plan"
2. Configura:
   - **Product name**: Pro Mensual
   - **Product type**: Service
   - **Product category**: Software
   - **Billing cycle**: Monthly
   - **Price**: €4.99 EUR (precio con IVA incluido)
   - **Tax**: Ya incluido en el precio
   - **Trial period**: None
3. Click "Save" y copia el **Plan ID**

### 3.5. Crear Plan Pro Anual

1. Click en "Create Plan"
2. Configura:
   - **Product name**: Pro Anual
   - **Product type**: Service
   - **Product category**: Software
   - **Billing cycle**: Yearly
   - **Price**: €49.99 EUR (precio con IVA incluido)
   - **Tax**: Ya incluido en el precio
   - **Trial period**: None
3. Click "Save" y copia el **Plan ID**

## 4. Pagos Únicos (Créditos IA)

Los pagos únicos para créditos **NO necesitan planes en PayPal**. Se crean como órdenes directas mediante código:

### Cómo funciona:

1. El usuario selecciona un pack de créditos
2. La API crea una orden de PayPal con:
   - **Precio base** (sin IVA)
   - **IVA (21%)** desglosado
   - **Precio final** (con IVA)
3. PayPal procesa el pago
4. Los créditos se añaden automáticamente a la cuenta del usuario

### Ejemplo de desglose:
\`\`\`
Starter Pack:
- Base: €2.47
- IVA (21%): €0.52
- Total: €2.99
\`\`\`

## 5. Configurar Webhooks (Opcional pero Recomendado)

1. Ve a "Webhooks" en el Dashboard
2. Click en "Add Webhook"
3. URL: `https://tu-dominio.com/api/paypal/webhook`
4. Eventos a suscribir:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
5. Copia el **Webhook ID**

## 6. Variables de Entorno

Añade estas variables a tu archivo `.env.local`:

\`\`\`bash
# PayPal Configuration
PAYPAL_CLIENT_ID=tu_client_id_aqui
PAYPAL_CLIENT_SECRET=tu_secret_aqui
PAYPAL_WEBHOOK_ID=tu_webhook_id_aqui

# PayPal Plan IDs (solo para suscripciones)
NEXT_PUBLIC_PAYPAL_PREMIUM_MONTHLY_PLAN_ID=P-xxx-premium-monthly
NEXT_PUBLIC_PAYPAL_PREMIUM_YEARLY_PLAN_ID=P-xxx-premium-yearly
NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID=P-xxx-pro-monthly
NEXT_PUBLIC_PAYPAL_PRO_YEARLY_PLAN_ID=P-xxx-pro-yearly

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 7. Testing en Sandbox

1. Usa las credenciales de Sandbox para testing
2. PayPal proporciona cuentas de prueba automáticamente
3. Puedes crear cuentas adicionales en "Sandbox" > "Accounts"
4. Los pagos en sandbox no son reales

## 8. Pasar a Producción

1. Cambia `NODE_ENV` a `production`
2. Usa las credenciales de producción (Live)
3. Crea los mismos planes en la cuenta de producción
4. Actualiza las variables de entorno con los IDs de producción
5. Configura webhooks en producción

## 9. Importante sobre IVA

### Para Suscripciones:
- PayPal **NO** calcula IVA automáticamente
- Debes incluir el IVA en el precio del plan
- Ejemplo: Premium €2.49 (ya incluye €0.43 de IVA)

### Para Pagos Únicos:
- El IVA se **desglosa** en la orden
- Se muestra al usuario el desglose completo:
  - Precio base
  - IVA (21%)
  - Total
- PayPal procesa el total pero conserva el desglose

### Facturación:
- Debes emitir facturas con el IVA desglosado
- Guarda los registros de transacciones
- Declara el IVA en tus impuestos

## 10. Verificación

Para verificar que todo funciona:

1. Ve a `/app` en tu aplicación
2. **Para suscripciones**:
   - Click en el badge de tu plan (FREE)
   - Selecciona un plan de pago
   - Verifica que el precio mostrado incluya "IVA incluido"
   - Procede con el pago de prueba

3. **Para créditos**:
   - Ve a la sección de créditos IA
   - Selecciona un pack
   - Verifica que se muestre el desglose:
     - Base: €X.XX
     - IVA (21%): €X.XX
     - Total: €X.XX
   - Procede con el pago de prueba

## 11. Troubleshooting

### Error: "Tax amount is not valid"
- Asegúrate de que el IVA está correctamente calculado
- Verifica que base + IVA = total
- Redondea a 2 decimales

### Error: "Plan not found"
- Verifica que los Plan IDs en `.env.local` son correctos
- Asegúrate de usar los IDs de sandbox para desarrollo
- Usa los IDs de producción solo en producción

### Pagos únicos no funcionan
- Verifica que `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET` están configurados
- Revisa los logs del servidor para ver errores de PayPal
- Asegúrate de que el desglose de IVA suma correctamente
