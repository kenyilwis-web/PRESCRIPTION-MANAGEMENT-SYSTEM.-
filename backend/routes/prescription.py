from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models import Prescription, Medicine, User

prescription_bp = Blueprint("prescription", __name__)


@prescription_bp.route("/", methods=["GET"])
@jwt_required()
def get_prescriptions():
    prescriptions = [prescription.to_dict() for prescription in Prescription.query.order_by(Prescription.created_at.desc()).all()]
    return jsonify({"prescriptions": prescriptions})


@prescription_bp.route("/", methods=["POST"])
@jwt_required()
def add_prescription():
    data = request.get_json() or {}
    patient_name = data.get("patient_name")
    instructions = data.get("instructions")
    medicine_ids = data.get("medicine_ids", [])
    current_user_id = get_jwt_identity()
    doctor = User.query.get(current_user_id)

    if not patient_name:
        return jsonify({"message": "Patient name is required."}), 400

    prescription = Prescription(patient_name=patient_name, instructions=instructions, doctor=doctor)
    for medicine_id in medicine_ids:
        medicine = Medicine.query.get(medicine_id)
        if medicine:
            prescription.medicines.append(medicine)

    db.session.add(prescription)
    db.session.commit()
    return jsonify({"prescription": prescription.to_dict()}), 201


@prescription_bp.route("/<int:prescription_id>", methods=["PUT"])
@jwt_required()
def update_prescription(prescription_id):
    prescription = Prescription.query.get_or_404(prescription_id)
    data = request.get_json() or {}
    prescription.patient_name = data.get("patient_name", prescription.patient_name)
    prescription.instructions = data.get("instructions", prescription.instructions)
    medicine_ids = data.get("medicine_ids")

    if medicine_ids is not None:
        prescription.medicines = []
        for medicine_id in medicine_ids:
            medicine = Medicine.query.get(medicine_id)
            if medicine:
                prescription.medicines.append(medicine)

    db.session.commit()
    return jsonify({"prescription": prescription.to_dict()})


@prescription_bp.route("/<int:prescription_id>", methods=["DELETE"])
@jwt_required()
def delete_prescription(prescription_id):
    prescription = Prescription.query.get_or_404(prescription_id)
    db.session.delete(prescription)
    db.session.commit()
    return jsonify({"message": "Prescription deleted."})


@prescription_bp.route("/<int:prescription_id>/dispense", methods=["POST"])
@jwt_required()
def dispense_prescription(prescription_id):
    prescription = Prescription.query.get_or_404(prescription_id)
    for medicine in prescription.medicines:
        if medicine.stock > 0:
            medicine.stock -= 1
    db.session.commit()
    return jsonify({"message": "Prescription dispensed.", "prescription": prescription.to_dict()})
