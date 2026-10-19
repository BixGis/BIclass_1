# Fundamentos de Business Intelligence: análisis, modelos e indicadores

## Business Intelligence y Data Analytics

**Business Intelligence** organiza datos, definiciones e informes para describir y supervisar el negocio. Suele responder preguntas como «¿qué ocurrió?» y «¿dónde estamos frente al objetivo?». Incluye integración de datos, modelos, indicadores, reportes y dashboards recurrentes.

**Data Analytics** es el conjunto de métodos para explorar datos y generar conclusiones. Además de describir resultados, puede investigar por qué ocurrieron, estimar qué podría ocurrir y comparar acciones posibles. Incluye análisis estadístico, experimentación y modelos predictivos cuando son adecuados.

Las disciplinas se complementan: una plataforma de BI confiable ofrece datos coherentes para el análisis; el análisis detecta patrones o formula hipótesis; y esos aprendizajes pueden incorporarse a indicadores y reportes de BI. Ambas necesitan preguntas claras, datos de calidad y comunicación comprensible. La elección del método depende del problema, no de la novedad de una herramienta.

## Modelado dimensional

El modelado dimensional organiza datos para que sean fáciles de consultar y entender. Primero se define el **grano**, es decir, qué representa una fila. Por ejemplo, «una fila por producto vendido en una línea de pedido». Las medidas de negocio se almacenan en una tabla de hechos y el contexto descriptivo se organiza en dimensiones.

### Hechos y dimensiones: ejemplo de ventas

Una tabla `HechoVentas` podría tener una fila por línea de pedido y contener:

- **Claves:** `fecha_key`, `producto_key`, `cliente_key` y, si aplica, `tienda_key`.
- **Medidas:** `unidades`, `importe_bruto`, `descuento`, `importe_neto` y `costo`.

Las dimensiones describen esas claves:

- **DimTiempo:** fecha, día, mes, trimestre y año fiscal.
- **DimProducto:** nombre, marca, categoría y subcategoría.
- **DimCliente:** identificador, segmento y región, según las políticas de privacidad.

Con este modelo se puede responder, por ejemplo, cuánto ingreso neto generó cada categoría por trimestre y segmento de cliente. Medidas y grano deben documentarse; de otro modo, sumar valores repetidos o mezclar niveles de detalle puede producir resultados engañosos.

### Esquema estrella y copo de nieve

En un **esquema estrella**, la tabla de hechos se relaciona directamente con dimensiones generalmente desnormalizadas. La dimensión de producto puede contener tanto categoría como subcategoría. Sus consultas suelen ser sencillas y rápidas de entender, aunque algunos atributos se repitan.

En un **esquema copo de nieve**, las dimensiones se dividen en tablas relacionadas. Por ejemplo, `DimProducto` puede enlazar con `DimCategoria` y `DimCategoria` con `DimDepartamento`. Esto reduce cierta redundancia, pero añade relaciones y puede hacer más complejas las consultas.

No existe una opción universalmente mejor. La decisión depende de la gobernanza, el volumen, las herramientas y la facilidad de uso que se necesita. Para comenzar, una estrella con un grano bien definido suele ser una estructura didáctica y práctica.

## Ejemplos de KPIs para BI

Un **KPI** (indicador clave de desempeño) cuantifica un resultado importante para un objetivo. Cada KPI debe tener nombre, propósito, fórmula, unidad, período, fuente, responsable y reglas de inclusión. Un número sin una definición compartida no es un indicador fiable.

- **Margen bruto:** `(ingresos netos − costo de los bienes vendidos) / ingresos netos × 100`. Ayuda a evaluar la rentabilidad de ventas antes de otros gastos operativos. Debe aclararse qué costos e ingresos se incluyen.
- **Tasa de conversión:** `conversiones / interacciones elegibles × 100`, donde el denominador puede ser sesiones, prospectos u otra población definida. El contexto y la ventana temporal deben indicarse; dos equipos pueden obtener tasas distintas si usan denominadores diferentes.
- **Valor de vida del cliente (CLV):** estimación del valor económico de la relación con un cliente durante un horizonte definido. Una aproximación sencilla puede combinar margen medio por período, frecuencia y duración esperada, ajustada por retención y costos según el modelo. Debe explicitar supuestos y distinguir valor histórico de valor futuro estimado.
- **Cuota de mercado:** `ventas de la empresa / ventas totales del mercado definido × 100`. Es imprescindible especificar mercado, geografía, categoría, período y si la medición usa ingresos o unidades.

Los KPIs deben llevar a una conversación o decisión. Conviene acompañarlos con tendencias y segmentos relevantes, no presentar un valor aislado como explicación causal.

## Errores comunes en proyectos de BI

### Falta de calidad de datos

Duplicados, identificadores incompatibles, fechas mal formadas y definiciones contradictorias erosionan la confianza. Es útil asignar responsables de los datos, implementar validaciones, registrar el linaje y comunicar limitaciones antes de publicar un tablero.

### KPIs mal definidos

Cuando no se acuerdan fórmula, grano, población o período, distintos equipos terminan comparando cifras que tienen el mismo nombre pero no significan lo mismo. Mantener un glosario, documentar transformaciones y validar las métricas con sus responsables reduce esta ambigüedad.

### Resistencia al cambio organizacional

Un dashboard no cambia por sí solo una forma de trabajar. La falta de participación de los usuarios, capacitación o confianza en los datos puede llevar a que se mantengan hojas paralelas y decisiones anteriores. Involucrar a las áreas desde el inicio, probar con casos reales, explicar el propósito y ofrecer acompañamiento facilita la adopción.

Un proyecto de BI sostenible combina tecnología con gobernanza, comunicación y mejora continua. Publicar menos indicadores bien definidos suele ser más útil que saturar a las personas con métricas sin contexto.
