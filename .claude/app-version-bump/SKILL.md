---

name: app-version-bump
description: Decidir si corresponde hacer bump de versión (NONE/PATCH/MINOR/MAJOR) sobre `expo.version` en `app.json` para una app React Native + Expo, analizando el diff entre la branch actual y su branch base. También clasifica si los cambios parecen tener impacto nativo para informar el proceso de release. Usá esta skill cada vez que el usuario mencione versionado, bump de versión, corte de release, prepare-release, antes de mergear a master, pregunte "qué versión le pongo", o pida revisar cambios para release. No la uses para modificar Android versionCode ni runtimeVersion: EAS los administra automáticamente.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# app-version-bump

Actuá como Release Engineer para una app React Native + Expo.

Analizá el diff de la branch actual contra su base y:

1. decidí si corresponde actualizar `expo.version` en `app.json`;
2. clasificá si los cambios parecen tener impacto sobre el runtime nativo.

La decisión de versión y el impacto nativo son dimensiones independientes.

## Contexto de versionado

La app usa tres conceptos distintos:

* `expo.version` — versión funcional/producto. **Esta la administramos nosotros.**
* `android.versionCode` — identificador incremental del binario Android. EAS lo administra automáticamente. **No tocar.**
* `runtimeVersion.policy: "fingerprint"` — compatibilidad binario↔OTA. **No tocar.**

La detección de impacto nativo de esta skill es únicamente informativa.

La decisión autoritativa de si un cambio puede distribuirse por OTA o requiere un nuevo binario debe realizarse en CI comparando Expo Fingerprint.

## Proceso

1. Detectá la branch actual:

   ```bash
   git branch --show-current
   ```

2. Detectá la branch base. Probá en este orden y usá la primera que funcione:

   * `git symbolic-ref refs/remotes/origin/HEAD` y quitale el prefijo `refs/remotes/origin/`
   * `master`
   * `main`

3. Confirmá que existen commits propios de la branch:

   ```bash
   git log <base>..HEAD --oneline
   ```

   Si no hay commits, decisión:

   ```text
   Version decision: NONE
   Native impact: NONE
   ```

4. Leé la versión actual desde `expo.version` en `app.json`.

5. Analizá el diff completo:

   ```bash
   git diff <base>...HEAD
   ```

   Si el diff es muy grande:

   * revisá primero `src/`, `app/` y componentes funcionales;
   * revisá `package.json`, `yarn.lock`, `app.json`, `eas.json` y configuración Expo;
   * usá `git diff <base>...HEAD --stat` para identificar el resto de archivos relevantes.

6. Clasificá independientemente:

   * cambio funcional: `NONE`, `PATCH`, `MINOR`, `MAJOR`;
   * impacto nativo: `NONE`, `NATIVE`, `UNKNOWN`.

7. Si la decisión funcional es distinta de `NONE`, actualizá únicamente `expo.version` en `app.json`.

8. Nunca modifiques configuración relacionada con `versionCode`, `runtimeVersion`, fingerprint o build number.

---

# Decisión de versión

## NONE — sin cambio funcional

Usar cuando los cambios sean exclusivamente internos y no modifiquen perceptiblemente el producto:

* refactors;
* reorganización de código;
* renames internos;
* arquitectura;
* limpieza o código muerto;
* deprecaciones internas;
* tooling;
* lint, format, typecheck, prettier, eslint;
* CI/CD;
* documentación;
* tests;
* scripts de desarrollo;
* configuración sin impacto funcional;
* cambios cuyo único objetivo sea regenerar un binario;
* upgrades técnicos que no cambian comportamiento visible.

No bumpear por el simple hecho de requerir un nuevo APK.

---

## PATCH — bug fix o ajuste menor

Usar cuando haya:

* bug fixes visibles para el usuario;
* correcciones de comportamiento existente;
* pequeños ajustes de UX/UI;
* correcciones de textos relevantes;
* mejoras menores de performance percibidas;
* pequeños cambios funcionales que no agregan una capacidad nueva.

Ejemplo:

```text
1.2.0 → 1.2.1
```

---

## MINOR — nueva funcionalidad

Usar cuando haya:

* una nueva feature;
* una nueva pantalla con capacidad funcional;
* un nuevo flujo completo;
* una nueva capacidad para el usuario;
* una mejora funcional relevante;
* cambios importantes de UX que amplían sustancialmente una funcionalidad existente.

Ejemplo:

```text
1.2.1 → 1.3.0
```

---

## MAJOR — breaking change

Usar únicamente para cambios excepcionales:

* incompatibilidades significativas;
* eliminación o reemplazo de funcionalidades centrales;
* redefinición importante del producto;
* breaking changes relevantes para usuarios o integraciones.

Usar este nivel de forma conservadora.

Ante la duda:

```text
MAJOR > MINOR > PATCH
```

pero nunca escalar preventivamente.

Ejemplo:

```text
1.3.0 → 2.0.0
```

---

# Clasificación de impacto nativo

Esta clasificación **no modifica la versión por sí misma**.

## Native impact: NONE

Usar cuando los cambios parecen compatibles con el binario actual y afectan solamente:

* TypeScript / JavaScript;
* componentes React;
* estilos;
* navegación JS;
* lógica de negocio JS;
* requests / API;
* validaciones;
* textos;
* assets que pueden distribuirse mediante Expo Updates;
* dependencias puramente JS;
* documentación, tests o tooling sin impacto runtime.

Ejemplo:

```text
Decision: MINOR
Native impact: NONE
```

Una nueva funcionalidad puede ser `MINOR` y seguir siendo distribuible por OTA.

---

## Native impact: NATIVE

Usar cuando el diff modifica o probablemente modifica el runtime nativo.

Ejemplos:

* agregar, eliminar o actualizar una dependencia con código nativo;
* cambios en Expo config plugins;
* cambios de permisos Android/iOS;
* cambios relevantes de `app.json` que afectan configuración nativa;
* cambios de package/bundle identifier;
* cambios en AndroidManifest o Info.plist;
* cambios en `android/` o `ios/`;
* código Kotlin, Java, Swift u Objective-C;
* cambios de Expo SDK;
* cambios de React Native;
* cambios de configuración nativa de una librería;
* assets/configuración que requieren regenerar el proyecto nativo;
* cambios que requieren `expo prebuild` o un nuevo development/release build.

Ejemplo:

```text
Decision: NONE
Native impact: NATIVE
```

Esto es válido: puede haber un cambio técnico que requiera nuevo APK sin justificar una nueva versión funcional.

---

## Native impact: UNKNOWN

Usar cuando no sea posible determinar con suficiente confianza si el cambio afecta el runtime nativo.

Casos típicos:

* dependencia nueva cuyo comportamiento nativo no sea evidente;
* upgrade ambiguo;
* config plugin indirecto;
* cambios complejos de configuración Expo;
* librerías desconocidas.

No asumir `NATIVE` ni `NONE` si falta evidencia.

El CI resolverá la compatibilidad real mediante Expo Fingerprint.

---

# Casos importantes

## PATCH + NONE

```text
Version:
1.0.0 → 1.0.1

Native impact:
NONE
```

Ejemplo: corrección visual o bug en lógica JS.

Probable distribución:

```text
OTA
```

---

## MINOR + NONE

```text
Version:
1.1.0 → 1.2.0

Native impact:
NONE
```

Ejemplo: nueva pantalla implementada completamente en React Native sin cambios nativos.

Probable distribución:

```text
OTA
```

---

## NONE + NATIVE

```text
Version:
1.2.0 → 1.2.0

Native impact:
NATIVE
```

Ejemplo: actualización técnica de una dependencia nativa sin cambios funcionales.

Probable distribución:

```text
nuevo binario
```

No hacer bump solo por requerir build.

---

## MINOR + NATIVE

```text
Version:
1.2.0 → 1.3.0

Native impact:
NATIVE
```

Ejemplo: nueva funcionalidad que incorpora una dependencia nativa.

Probable distribución:

```text
nuevo binario
```

---

# Reglas adicionales

* No bumpear por cada OTA.
* No bumpear porque exista un nuevo APK.
* No modificar `android.versionCode`.
* No agregar `android.versionCode` si no existe.
* No modificar `runtimeVersion`.
* No modificar la política `fingerprint`.
* No intentar calcular manualmente `runtimeVersion`.
* Una dependencia nueva no implica automáticamente un bump funcional.
* Una dependencia nueva sí debe analizarse para determinar posible impacto nativo.
* Diferenciar siempre impacto de producto de impacto técnico.
* Si varios cambios justifican distintos niveles de versión, aplicar el nivel funcional más alto.
* No hacer bumps preventivos.
* Si el impacto funcional no está claro, usar `NONE`.
* Si el impacto nativo no está claro, usar `UNKNOWN`.
* No modificar otros campos de `app.json`.
* Bumpear únicamente el segmento correspondiente.

Ejemplos:

```text
1.2.3 + PATCH = 1.2.4
1.2.3 + MINOR = 1.3.0
1.2.3 + MAJOR = 2.0.0
```

---

# Salida

Antes de modificar cualquier archivo, imprimí siempre:

```text
Current version: <x.y.z>
Decision: <NONE|PATCH|MINOR|MAJOR>
Next version: <x.y.z>
Native impact: <NONE|NATIVE|UNKNOWN>
Reason: <una línea con la razón principal>
```

Ejemplo sin cambios:

```text
Current version: 1.0.0
Decision: NONE
Next version: 1.0.0
Native impact: NONE
Reason: los cambios son únicamente tooling y CI, sin impacto funcional ni nativo.
```

Ejemplo OTA:

```text
Current version: 1.0.0
Decision: MINOR
Next version: 1.1.0
Native impact: NONE
Reason: se agregó un nuevo flujo de sesión de escucha implementado completamente en React Native.
```

Ejemplo nuevo binario sin bump funcional:

```text
Current version: 1.1.0
Decision: NONE
Next version: 1.1.0
Native impact: NATIVE
Reason: se actualizó una dependencia con código nativo sin modificar el comportamiento funcional de la app.
```

Ejemplo funcional + nativo:

```text
Current version: 1.1.0
Decision: MINOR
Next version: 1.2.0
Native impact: NATIVE
Reason: se agregó una nueva funcionalidad que incorpora una dependencia nativa.
```

---

# Modificación

Si `Decision != NONE`:

1. Mostrá primero el bloque de salida.
2. Actualizá únicamente `expo.version` en `app.json`.
3. No modifiques ningún otro campo.
4. Indicá:

   ```text
   Modified: app.json
   ```

Si `Decision == NONE`:

1. Mostrá el bloque de salida.
2. No modifiques `app.json`.
3. Indicá:

   ```text
   Version unchanged.
   ```

---

# Importante sobre deployment

`Native impact` es únicamente una evaluación preliminar para ayudar durante el desarrollo y el review.

**No utilizar esta clasificación como fuente autoritativa para decidir OTA vs nuevo binario.**

El pipeline de CI debe comparar Expo Fingerprint entre la versión base y la nueva versión:

```text
fingerprint igual
→ OTA compatible

fingerprint diferente
→ nuevo runtime
→ requiere nuevo binario
```

La skill decide semántica de producto.

CI decide compatibilidad técnica de release.
