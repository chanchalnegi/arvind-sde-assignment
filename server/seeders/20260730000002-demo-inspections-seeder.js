'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('inspections', [
      {
        date: '2026-07-28',
        machine_id: 'Loom-104 (Denim Line 1)',
        defect_type: 'Weave Defect',
        severity: 'Critical',
        status: 'Open',
        remarks: 'Warp yarn tension dropped causing broken ends on denim roll #D-409.',
        resolution_note: null,
        resolved_at: null,
        resolved_by: null,
        plant_location: 'Naroda Plant, Ahmedabad (Gujarat)',
        source: 'MANUAL',
        createdAt: now,
        updatedAt: now
      },
      {
        date: '2026-07-28',
        machine_id: 'Dyeing Range 03',
        defect_type: 'Shade Variation',
        severity: 'Major',
        status: 'Open',
        remarks: 'Indigo shade delta E > 1.8 between batch head and tail.',
        resolution_note: null,
        resolved_at: null,
        resolved_by: null,
        plant_location: 'Naroda Plant, Ahmedabad (Gujarat)',
        source: 'SAP_WEBHOOK',
        createdAt: now,
        updatedAt: now
      },
      {
        date: '2026-07-27',
        machine_id: 'Finishing Stenter 02',
        defect_type: 'Hole/Tear',
        severity: 'Critical',
        status: 'Resolved',
        remarks: 'Pin chain slip caught selvage near meter mark 420.',
        resolution_note: 'Re-aligned pin chain guide and trimmed damaged 3 meters of fabric. Machine recalibrated.',
        resolved_at: '2026-07-27 15:45:00',
        resolved_by: 'Rajesh Patel',
        plant_location: 'Khatraj Plant, Gujarat',
        source: 'MANUAL',
        createdAt: now,
        updatedAt: now
      },
      {
        date: '2026-07-26',
        machine_id: 'Spinning Frame SF-12',
        defect_type: 'Count Deviation',
        severity: 'Minor',
        status: 'Resolved',
        remarks: 'Ne 30s count shifted to 31.2s on spindle set B.',
        resolution_note: 'Adjusted draft gear ratio and tested 5 roving bobbins. Count returned to 30.1s.',
        resolved_at: '2026-07-26 11:20:00',
        resolved_by: 'Sanjay Kulkarni',
        plant_location: 'Nagpur Plant, Maharashtra',
        source: 'MANUAL',
        createdAt: now,
        updatedAt: now
      },
      {
        date: '2026-07-25',
        machine_id: 'Airjet Loom AL-08',
        defect_type: 'Weave Defect',
        severity: 'Major',
        status: 'Open',
        remarks: 'Weft insertion error caused repeated mispicks on cotton drill weave.',
        resolution_note: null,
        resolved_at: null,
        resolved_by: null,
        plant_location: 'Naroda Plant, Ahmedabad (Gujarat)',
        source: 'OFFLINE_SYNC',
        createdAt: now,
        updatedAt: now
      },
      {
        date: '2026-07-24',
        machine_id: 'Inspection Table IT-04',
        defect_type: 'Other',
        severity: 'Minor',
        status: 'Resolved',
        remarks: 'Oil spots detected along center fold line.',
        resolution_note: 'Cleaned machine guide rollers and replaced leaking oil seal on upper arm.',
        resolved_at: '2026-07-24 16:10:00',
        resolved_by: 'Rajesh Patel',
        plant_location: 'Khatraj Plant, Gujarat',
        source: 'MANUAL',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inspections', null, {});
  }
};
