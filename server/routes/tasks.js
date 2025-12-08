const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        start_date as "startDate",
        end_date as "endDate",
        product_type as "productType",
        density,
        process,
        pra_schedule as "praSchedule",
        is_main_process as "isMainProcess",
        is_npi as "isNPI",
        organization,
        stack_method as "stackMethod",
        number_of_stack as "numberOfStack",
        number_of_die as "numberOfDie",
        package_size as "packageSize",
        package_height as "packageHeight",
        vdd1,
        vdd2,
        vddq,
        speed,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM tasks
      ORDER BY start_date ASC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
      message: error.message
    });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT
        id,
        start_date as "startDate",
        end_date as "endDate",
        product_type as "productType",
        density,
        process,
        pra_schedule as "praSchedule",
        is_main_process as "isMainProcess",
        is_npi as "isNPI",
        organization,
        stack_method as "stackMethod",
        number_of_stack as "numberOfStack",
        number_of_die as "numberOfDie",
        package_size as "packageSize",
        package_height as "packageHeight",
        vdd1,
        vdd2,
        vddq,
        speed,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM tasks
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task',
      message: error.message
    });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      productType,
      density,
      process,
      praSchedule,
      isMainProcess,
      isNPI,
      organization,
      stackMethod,
      numberOfStack,
      numberOfDie,
      packageSize,
      packageHeight,
      vdd1,
      vdd2,
      vddq,
      speed
    } = req.body;

    const result = await db.query(`
      INSERT INTO tasks (
        start_date, end_date, product_type, density, process,
        pra_schedule, is_main_process, is_npi, organization,
        stack_method, number_of_stack, number_of_die,
        package_size, package_height, vdd1, vdd2, vddq, speed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING
        id,
        start_date as "startDate",
        end_date as "endDate",
        product_type as "productType",
        density,
        process,
        pra_schedule as "praSchedule",
        is_main_process as "isMainProcess",
        is_npi as "isNPI",
        organization,
        stack_method as "stackMethod",
        number_of_stack as "numberOfStack",
        number_of_die as "numberOfDie",
        package_size as "packageSize",
        package_height as "packageHeight",
        vdd1,
        vdd2,
        vddq,
        speed
    `, [
      startDate, endDate, productType, density, process,
      praSchedule, isMainProcess, isNPI, organization,
      stackMethod, numberOfStack, numberOfDie,
      packageSize, packageHeight, vdd1, vdd2, vddq, speed
    ]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
      message: error.message
    });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      startDate,
      endDate,
      productType,
      density,
      process,
      praSchedule,
      isMainProcess,
      isNPI,
      organization,
      stackMethod,
      numberOfStack,
      numberOfDie,
      packageSize,
      packageHeight,
      vdd1,
      vdd2,
      vddq,
      speed
    } = req.body;

    const result = await db.query(`
      UPDATE tasks SET
        start_date = $1,
        end_date = $2,
        product_type = $3,
        density = $4,
        process = $5,
        pra_schedule = $6,
        is_main_process = $7,
        is_npi = $8,
        organization = $9,
        stack_method = $10,
        number_of_stack = $11,
        number_of_die = $12,
        package_size = $13,
        package_height = $14,
        vdd1 = $15,
        vdd2 = $16,
        vddq = $17,
        speed = $18,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $19
      RETURNING
        id,
        start_date as "startDate",
        end_date as "endDate",
        product_type as "productType",
        density,
        process,
        pra_schedule as "praSchedule",
        is_main_process as "isMainProcess",
        is_npi as "isNPI",
        organization,
        stack_method as "stackMethod",
        number_of_stack as "numberOfStack",
        number_of_die as "numberOfDie",
        package_size as "packageSize",
        package_height as "packageHeight",
        vdd1,
        vdd2,
        vddq,
        speed
    `, [
      startDate, endDate, productType, density, process,
      praSchedule, isMainProcess, isNPI, organization,
      stackMethod, numberOfStack, numberOfDie,
      packageSize, packageHeight, vdd1, vdd2, vddq, speed,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task',
      message: error.message
    });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
      message: error.message
    });
  }
});

module.exports = router;
