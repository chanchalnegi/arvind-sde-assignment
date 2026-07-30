const express = require('express');
const router = express.Router();
const { Inspection, Op, sequelize } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const ALLOWED_DEFECT_TYPES = ['Weave Defect', 'Shade Variation', 'Hole/Tear', 'Count Deviation', 'Other'];
const ALLOWED_SEVERITIES = ['Critical', 'Major', 'Minor'];

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { severity, status, startDate, endDate, search, sortBy = 'date', sortOrder = 'desc' } = req.query;
    const where = {};

    if (severity && severity !== 'All') {
      where.severity = severity;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { machine_id: { [Op.like]: term } },
        { remarks: { [Op.like]: term } },
        { defect_type: { [Op.like]: term } },
        { plant_location: { [Op.like]: term } }
      ];
    }

    let order = [];
    const dir = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    if (sortBy === 'severity') {
      order = [
        [sequelize.literal(`CASE severity WHEN 'Critical' THEN 1 WHEN 'Major' THEN 2 WHEN 'Minor' THEN 3 ELSE 4 END`), dir],
        ['id', 'DESC']
      ];
    } else if (sortBy === 'machine_id') {
      order = [['machine_id', dir], ['id', 'DESC']];
    } else if (sortBy === 'status') {
      order = [['status', dir], ['id', 'DESC']];
    } else {
      order = [['date', dir], ['id', 'DESC']];
    }

    const inspections = await Inspection.findAll({
      where,
      order
    });

    res.json({
      count: inspections.length,
      inspections
    });
  } catch (error) {
    console.error('Error fetching inspections:', error);
    res.status(500).json({ error: 'Failed to retrieve quality inspections' });
  }
});

router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const rows = await Inspection.findAll({
      attributes: [
        'status',
        'severity',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status', 'severity'],
      raw: true
    });

    const summary = {
      open: { Critical: 0, Major: 0, Minor: 0, Total: 0 },
      resolved: { Critical: 0, Major: 0, Minor: 0, Total: 0 },
      totalCount: 0,
      openCount: 0,
      resolvedCount: 0
    };

    rows.forEach(row => {
      const statusKey = row.status === 'Resolved' ? 'resolved' : 'open';
      const severityKey = row.severity;
      const cnt = Number(row.count);

      if (summary[statusKey] && summary[statusKey][severityKey] !== undefined) {
        summary[statusKey][severityKey] = cnt;
        summary[statusKey].Total += cnt;
      }

      summary.totalCount += cnt;
      if (statusKey === 'open') summary.openCount += cnt;
      if (statusKey === 'resolved') summary.resolvedCount += cnt;
    });

    res.json(summary);
  } catch (error) {
    console.error('Error fetching inspection summary:', error);
    res.status(500).json({ error: 'Failed to retrieve inspection summary metrics' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, machine_id, defect_type, severity, remarks, plant_location, source = 'MANUAL' } = req.body;

    const errors = [];
    if (!date) errors.push('Date is required');
    if (!machine_id || !machine_id.trim()) errors.push('Machine / Line ID is required');
    if (!defect_type) errors.push('Defect type is required');
    else if (!ALLOWED_DEFECT_TYPES.includes(defect_type)) {
      errors.push(`Invalid defect type. Allowed: ${ALLOWED_DEFECT_TYPES.join(', ')}`);
    }

    if (!severity) errors.push('Severity level is required');
    else if (!ALLOWED_SEVERITIES.includes(severity)) {
      errors.push(`Invalid severity. Allowed: ${ALLOWED_SEVERITIES.join(', ')}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const plant = plant_location || (req.user && req.user.plant) || 'Naroda Plant, Gujarat';

    const newInspection = await Inspection.create({
      date,
      machine_id: machine_id.trim(),
      defect_type,
      severity,
      status: 'Open',
      remarks: remarks ? remarks.trim() : null,
      plant_location: plant,
      source
    });

    res.status(201).json({
      message: 'Inspection logged successfully',
      inspection: newInspection
    });
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(500).json({ error: 'Failed to log inspection record' });
  }
});

router.patch('/:id/resolve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_note } = req.body;

    if (!resolution_note || !resolution_note.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'A mandatory resolution note is required to mark an inspection as resolved.'
      });
    }

    const inspection = await Inspection.findByPk(id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection record not found' });
    }

    if (inspection.status === 'Resolved') {
      return res.status(400).json({ error: 'Inspection is already marked as Resolved' });
    }

    const resolvedBy = (req.user && req.user.name) || 'Shop-floor Supervisor';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    inspection.status = 'Resolved';
    inspection.resolution_note = resolution_note.trim();
    inspection.resolved_at = now;
    inspection.resolved_by = resolvedBy;
    await inspection.save();

    res.json({
      message: 'Inspection marked as Resolved successfully',
      inspection
    });
  } catch (error) {
    console.error('Error resolving inspection:', error);
    res.status(500).json({ error: 'Failed to resolve inspection' });
  }
});

router.get('/export', authenticateToken, async (req, res) => {
  try {
    const inspections = await Inspection.findAll({
      order: [['date', 'DESC'], ['id', 'DESC']]
    });

    let csv = 'ID,Date,Machine/Line ID,Defect Type,Severity,Status,Plant Location,Remarks,Resolution Note,Resolved At,Resolved By,Source\n';

    inspections.forEach(item => {
      const escape = (str) => `"${(str || '').replace(/"/g, '""')}"`;
      csv += `${item.id},${item.date},${escape(item.machine_id)},${escape(item.defect_type)},${item.severity},${item.status},${escape(item.plant_location)},${escape(item.remarks)},${escape(item.resolution_note)},${escape(item.resolved_at)},${escape(item.resolved_by)},${item.source}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="arvind_quality_inspections_${new Date().toISOString().slice(0,10)}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

module.exports = router;
