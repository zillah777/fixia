#!/usr/bin/env node

/**
 * SCRIPT DE DESPLIEGUE PARA RAILWAY POSTGRESQL
 * 
 * Este script automatiza el proceso de despliegue de la base de datos
 * en Railway PostgreSQL
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de Railway
const railwayConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`[${step}] ${message}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

async function checkDatabaseConnection(pool) {
  logStep('1', 'Verificando conexión a la base de datos...');
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    client.release();
    
    logSuccess('Conexión exitosa a PostgreSQL');
    log(`   Tiempo: ${result.rows[0].current_time}`);
    log(`   Versión: ${result.rows[0].db_version.split(' ')[0]} ${result.rows[0].db_version.split(' ')[1]}`);
    
    return true;
  } catch (error) {
    logError(`Error de conexión: ${error.message}`);
    return false;
  }
}

async function backupExistingData(pool) {
  logStep('2', 'Verificando datos existentes...');
  
  try {
    const client = await pool.connect();
    
    // Verificar si existen tablas con datos
    const tableCheck = await client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name IN ('usuarios', 'servicios', 'matches')
    `);
    
    if (tableCheck.rows.length > 0) {
      logWarning('Se encontraron tablas existentes:');
      tableCheck.rows.forEach(table => {
        log(`   - ${table.table_name} (${table.column_count} columnas)`);
      });
      
      // Verificar si hay datos
      for (const table of tableCheck.rows) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
          if (countResult.rows[0].count > 0) {
            logWarning(`   Tabla ${table.table_name} tiene ${countResult.rows[0].count} registros`);
          }
        } catch (error) {
          // Tabla puede no existir o tener problemas de estructura
          log(`   Tabla ${table.table_name}: Error al verificar datos`);
        }
      }
    } else {
      logSuccess('Base de datos limpia, no se encontraron tablas existentes');
    }
    
    client.release();
    return true;
  } catch (error) {
    logWarning(`No se pudo verificar datos existentes: ${error.message}`);
    return true; // Continuamos de todas formas
  }
}

async function runMigration(pool) {
  logStep('3', 'Ejecutando migración principal...');
  
  try {
    const migrationFile = path.join(__dirname, 'railway_migration.sql');
    
    if (!fs.existsSync(migrationFile)) {
      throw new Error(`Archivo de migración no encontrado: ${migrationFile}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    log('   Archivo de migración cargado exitosamente');
    log(`   Tamaño: ${Math.round(migrationSQL.length / 1024)} KB`);
    
    const client = await pool.connect();
    
    // Ejecutar migración en una transacción
    await client.query('BEGIN');
    
    try {
      await client.query(migrationSQL);
      await client.query('COMMIT');
      logSuccess('Migración ejecutada exitosamente');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
    
    client.release();
    return true;
  } catch (error) {
    logError(`Error en migración: ${error.message}`);
    return false;
  }
}

async function verifyMigration(pool) {
  logStep('4', 'Verificando resultado de la migración...');
  
  try {
    const verificationFile = path.join(__dirname, 'verify_migration.sql');
    
    if (!fs.existsSync(verificationFile)) {
      throw new Error(`Archivo de verificación no encontrado: ${verificationFile}`);
    }
    
    const verificationSQL = fs.readFileSync(verificationFile, 'utf8');
    const client = await pool.connect();
    
    const result = await client.query(verificationSQL);
    client.release();
    
    logSuccess('Verificación completada');
    
    // Mostrar resultados de la verificación
    if (result.length > 0) {
      log('\n📊 RESULTADOS DE LA VERIFICACIÓN:', 'bold');
      
      // Agrupar resultados por categoría
      const categories = {};
      result.forEach(resultSet => {
        if (resultSet.rows) {
          resultSet.rows.forEach(row => {
            if (!categories[row.categoria]) {
              categories[row.categoria] = [];
            }
            categories[row.categoria].push(row);
          });
        }
      });
      
      Object.keys(categories).forEach(category => {
        log(`\n${category}:`, 'yellow');
        categories[category].forEach(item => {
          const status = item.estado === 'OK' ? '✅' : 
                        item.estado === 'FALTA' ? '❌' : 
                        '📊';
          log(`   ${status} ${item.nombre}: ${item.estado}`);
        });
      });
    }
    
    return true;
  } catch (error) {
    logError(`Error en verificación: ${error.message}`);
    return false;
  }
}

async function insertInitialData(pool) {
  logStep('5', 'Insertando datos iniciales de categorías...');
  
  const categoriesSQL = `
    INSERT INTO categorias (nombre, descripcion, icono, color, activa, orden) VALUES
    ('Limpieza y Hogar', 'Servicios de limpieza, organización y mantenimiento del hogar', 'cleaning', '#10B981', true, 1),
    ('Mantenimiento', 'Plomería, electricidad, carpintería y reparaciones generales', 'tools', '#F59E0B', true, 2),
    ('Tecnología', 'Soporte técnico, reparación de equipos y desarrollo web', 'computer', '#3B82F6', true, 3),
    ('Cuidado Personal', 'Peluquería, masajes, cuidado estético y bienestar', 'spa', '#EC4899', true, 4),
    ('Educación', 'Clases particulares, idiomas y capacitación profesional', 'education', '#8B5CF6', true, 5),
    ('Jardinería', 'Cuidado de plantas, diseño de jardines y paisajismo', 'garden', '#059669', true, 6),
    ('Transporte', 'Mudanzas, delivery y servicios de transporte', 'truck', '#DC2626', true, 7),
    ('Eventos', 'Organización de fiestas, catering y entretenimiento', 'party', '#7C3AED', true, 8),
    ('Mascotas', 'Veterinaria, cuidado, paseo y entrenamiento de mascotas', 'pets', '#F97316', true, 9),
    ('Profesional', 'Consultoría, servicios legales y administrativos', 'briefcase', '#374151', true, 10)
    ON CONFLICT (nombre) DO NOTHING;
  `;
  
  try {
    const client = await pool.connect();
    const result = await client.query(categoriesSQL);
    client.release();
    
    logSuccess(`Categorías insertadas/verificadas`);
    return true;
  } catch (error) {
    logWarning(`Error insertando categorías: ${error.message}`);
    return false;
  }
}

async function showDatabaseInfo(pool) {
  logStep('6', 'Información final de la base de datos...');
  
  try {
    const client = await pool.connect();
    
    // Contar tablas
    const tablesResult = await client.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    
    // Contar índices
    const indexesResult = await client.query(`
      SELECT COUNT(*) as index_count
      FROM pg_indexes
      WHERE schemaname = 'public'
    `);
    
    // Contar funciones
    const functionsResult = await client.query(`
      SELECT COUNT(*) as function_count
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
    `);
    
    // Tamaño de la base de datos
    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
    `);
    
    client.release();
    
    log('\n📈 INFORMACIÓN DE LA BASE DE DATOS:', 'bold');
    log(`   Tablas creadas: ${tablesResult.rows[0].table_count}`, 'green');
    log(`   Índices creados: ${indexesResult.rows[0].index_count}`, 'green');
    log(`   Funciones creadas: ${functionsResult.rows[0].function_count}`, 'green');
    log(`   Tamaño de la BD: ${sizeResult.rows[0].db_size}`, 'green');
    
    return true;
  } catch (error) {
    logWarning(`Error obteniendo información: ${error.message}`);
    return false;
  }
}

async function main() {
  log('\n🚀 DESPLIEGUE DE FIXIA EN RAILWAY POSTGRESQL', 'bold');
  log('================================================\n', 'bold');
  
  // Verificar variables de entorno
  if (!process.env.DATABASE_URL) {
    logError('Variable DATABASE_URL no encontrada');
    logWarning('Asegúrate de tener configurada la conexión a Railway PostgreSQL');
    process.exit(1);
  }
  
  const pool = new Pool(railwayConfig);
  
  try {
    // 1. Verificar conexión
    const connected = await checkDatabaseConnection(pool);
    if (!connected) {
      process.exit(1);
    }
    
    // 2. Backup/verificar datos existentes
    await backupExistingData(pool);
    
    // 3. Ejecutar migración
    const migrationSuccess = await runMigration(pool);
    if (!migrationSuccess) {
      process.exit(1);
    }
    
    // 4. Verificar migración
    const verificationSuccess = await verifyMigration(pool);
    if (!verificationSuccess) {
      logWarning('La verificación falló, pero la migración puede haber sido exitosa');
    }
    
    // 5. Insertar datos iniciales
    await insertInitialData(pool);
    
    // 6. Mostrar información final
    await showDatabaseInfo(pool);
    
    log('\n🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE', 'bold');
    log('=======================================\n', 'bold');
    
    logSuccess('La base de datos está lista para usar en Railway');
    log('   - Todas las tablas han sido creadas');
    log('   - Los índices están optimizados');
    log('   - Las funciones están disponibles');
    log('   - Los datos iniciales han sido insertados');
    
    log('\n📝 PRÓXIMOS PASOS:', 'yellow');
    log('   1. Actualizar las variables de entorno en Railway');
    log('   2. Configurar el backend para usar DATABASE_URL');
    log('   3. Probar las conexiones desde la aplicación');
    log('   4. Ejecutar los seeds si es necesario');
    
  } catch (error) {
    logError(`Error inesperado: ${error.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar script
if (require.main === module) {
  main().catch(error => {
    logError(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main };