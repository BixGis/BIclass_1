# Fundamentos de Business Intelligence: datos, decisiones y ETL

Business Intelligence (BI) reúne prácticas, procesos y herramientas que convierten datos de una organización en información útil para comprender el desempeño y orientar decisiones. BI no consiste solo en crear gráficos: empieza con una pregunta de negocio y termina cuando se evalúa el resultado de una acción.

## Toma de decisiones basada en datos

Una decisión intuitiva se apoya principalmente en la experiencia, la percepción y el juicio de quien decide. La intuición puede ser valiosa cuando hay poco tiempo o información, pero también está expuesta a sesgos, recuerdos incompletos y a la selección de ejemplos que confirman una creencia.

Una decisión data-driven utiliza datos relevantes y análisis explícito para comprobar hipótesis, comparar alternativas y reducir la incertidumbre. No significa obedecer ciegamente a una métrica ni eliminar la experiencia: el contexto, la calidad de los datos y el criterio humano siguen siendo esenciales. Lo importante es que las razones y la evidencia que sostienen la decisión sean visibles y comprobables.

### Ciclo de vida de una decisión

1. **Identificar el problema.** Formular una pregunta concreta, delimitar el alcance y acordar qué resultado se quiere mejorar. Por ejemplo: «¿Por qué disminuyó la recompra de clientes en el último trimestre?».
2. **Recolectar datos.** Localizar fuentes apropiadas, definir el período de análisis y comprobar que los datos representen el problema. Pueden incluir pedidos, clientes, campañas y servicio posventa.
3. **Analizar.** Limpiar y explorar la información, comparar segmentos y períodos, y distinguir una correlación de una causa. Conviene documentar supuestos y limitaciones.
4. **Actuar.** Elegir una intervención basada en los hallazgos, asignar responsables y definir cuándo y cómo se ejecutará.
5. **Medir.** Comparar el resultado con una línea base o grupo de control, revisar los efectos y decidir si se mantiene, modifica o detiene la acción. El aprendizaje alimenta la siguiente pregunta.

Un buen análisis también puede concluir que la evidencia es insuficiente. Esa conclusión permite solicitar mejores datos antes de comprometer recursos.

## Proceso ETL: Extract, Transform, Load

ETL es una forma habitual de trasladar y preparar datos de sistemas operacionales para análisis. El flujo puede ejecutarse por lotes, por ejemplo cada noche, o con mayor frecuencia según la necesidad. Debe conservar trazabilidad, controles de calidad y reglas de negocio documentadas.

### 1. Extract — Extraer

Se leen datos desde las fuentes autorizadas sin perder su procedencia. Algunos ejemplos:

- **CRM:** clientes, oportunidades, actividades comerciales, campañas y fechas de contacto.
- **ERP:** pedidos, facturas, inventario, costos, productos y unidades organizativas.
- **Redes sociales:** interacciones, menciones, alcance y fechas de publicación, respetando las condiciones de acceso y uso de cada plataforma.
- **Tienda física y comercio electrónico:** tickets del punto de venta, pedidos web, devoluciones y datos de canal.

La extracción puede usar conectores, API, archivos o consultas. Antes de incorporarlos se identifican campos, formatos, claves, frecuencia de actualización y permisos. Cuando es posible se utiliza una carga incremental para obtener solo registros nuevos o modificados.

### 2. Transform — Transformar

Los datos se preparan para que distintas fuentes tengan significados y formatos compatibles. Las reglas deben ser reproducibles y quedar documentadas.

- **Limpieza:** detectar duplicados, corregir errores de formato, validar campos obligatorios y tratar valores ausentes según reglas explícitas.
- **Normalización:** convertir monedas, zonas horarias, unidades y formatos de fecha; unificar nombres de campos y códigos de productos.
- **Integración:** relacionar registros mediante claves fiables, resolver diferencias de identificadores y conservar el origen del dato.
- **Agregación y derivación:** calcular totales por día, canal o producto y crear medidas como ingresos netos, unidades o margen.
- **Validación:** contrastar conteos y totales con las fuentes, revisar rangos esperados y registrar excepciones para su análisis.

No toda diferencia debe «limpiarse» automáticamente. Por ejemplo, una devolución no es un error: es un evento de negocio que debe representarse de forma coherente.

### 3. Load — Cargar

Los datos transformados se escriben en el destino analítico, a menudo un **Data Warehouse** (almacén de datos). Se puede cargar una tabla completa o actualizar solo el período modificado. El diseño del destino debe facilitar consultas consistentes, controlar accesos y evitar que una recarga duplique transacciones.

Al finalizar, se comprueba que los registros cargados coincidan con lo esperado, se deja registro de la ejecución y se alerta sobre fallos. Los informes y dashboards consultan después estas estructuras analíticas en lugar de ejecutar cada vez una integración distinta de los sistemas de origen.

## Ejemplo práctico: unificar ventas de tienda y e-commerce

Una empresa quiere comparar ventas por canal y producto. La tienda física registra tickets con `fecha_ticket`, `sku`, `cantidad`, `precio` y `id_tienda`; el e-commerce guarda pedidos con `created_at`, `product_code`, `units`, `unit_price` y `order_status`.

1. **Extraer:** importar tickets cerrados desde el sistema de punto de venta y pedidos del ERP o e-commerce, incluyendo cancelaciones y devoluciones necesarias para calcular ventas netas.
2. **Transformar:** mapear `sku` y `product_code` a un identificador común del catálogo; convertir las marcas de tiempo a la zona horaria del negocio; convertir importes a una moneda de reporte; normalizar estados y tratar devoluciones con una regla acordada. Asignar a cada registro un canal (`Tienda` o `Online`) y validar los totales frente a los sistemas originales.
3. **Cargar:** guardar las transacciones normalizadas en una tabla de hechos de ventas del Data Warehouse, junto con claves de fecha, producto, tienda o canal y cliente cuando esté disponible.
4. **Analizar:** crear un reporte único de ingresos netos, unidades, devoluciones y ticket promedio, filtrable por período, producto y canal.

Así, la dirección puede comparar canales con la misma definición de venta. El modelo debe explicar cómo se tratan impuestos, descuentos, cancelaciones y ventas sin cliente identificado; de otro modo, dos reportes podrían mostrar cifras distintas aunque usen los mismos pedidos.
