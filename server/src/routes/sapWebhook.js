const express = require('express');
const router = express.Router();
const { Inspection } = require('../db');

router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || !payload.notificationHeader || !payload.defectDetails) {
      return res.status(400).json({
        error: 'Invalid SAP Webhook Payload Structure',
        expectedStructure: {
          notificationHeader: {
            sapNotificationId: 'QM-XXXX',
            plantName: 'Plant Name',
            workCenter: 'Machine / Line ID'
          },
          defectDetails: {
            category: 'Weave Defect | Shade Variation | Hole/Tear | Count Deviation | Other',
            severityLevel: 'HIGH | MEDIUM | LOW or Critical | Major | Minor',
            description: 'Defect details text'
          }
        }
      });
    }

    const { notificationHeader, defectDetails } = payload;

    const dateStr = notificationHeader.timestamp
      ? new Date(notificationHeader.timestamp).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    const machineId = notificationHeader.workCenter || `SAP-Line-${notificationHeader.plantId || '01'}`;

    const validCategories = ['Weave Defect', 'Shade Variation', 'Hole/Tear', 'Count Deviation', 'Other'];
    let defectType = validCategories.includes(defectDetails.category)
      ? defectDetails.category
      : 'Other';

    let severity = 'Major';
    const sLevel = String(defectDetails.severityLevel || '').toUpperCase();
    if (sLevel === 'HIGH' || sLevel === 'CRITICAL') severity = 'Critical';
    else if (sLevel === 'MEDIUM' || sLevel === 'MAJOR') severity = 'Major';
    else if (sLevel === 'LOW' || sLevel === 'MINOR') severity = 'Minor';

    const plantLocation = notificationHeader.plantName || 'Naroda Plant, Gujarat';
    const remarks = `[SAP QM Notification #${notificationHeader.sapNotificationId || 'AUTO'}] ${defectDetails.description || ''}`;

    const newInspection = await Inspection.create({
      date: dateStr,
      machine_id: machineId,
      defect_type: defectType,
      severity,
      status: 'Open',
      remarks,
      plant_location: plantLocation,
      source: 'SAP_WEBHOOK'
    });

    return res.status(201).json({
      success: true,
      message: 'SAP Quality Notification auto-created inspection record successfully',
      sapNotificationId: notificationHeader.sapNotificationId,
      inspection: newInspection
    });
  } catch (error) {
    console.error('SAP Webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error processing SAP Webhook' });
  }
});

module.exports = router;
