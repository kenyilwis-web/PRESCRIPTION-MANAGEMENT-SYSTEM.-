from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from backend.extensions import db
from backend.models import Medicine

medicine_bp = Blueprint("medicine", __name__)


@medicine_bp.route("/", methods=["GET"])
def get_medicines():
    medicines = [medicine.to_dict() for medicine in Medicine.query.order_by(Medicine.name).all()]
    return jsonify({"medicines": medicines})


@medicine_bp.route("/", methods=["POST"])
@jwt_required()
def add_medicine():
    data = request.get_json() or {}
    name = data.get("name")
    description = data.get("description")
    stock = data.get("stock", 0)
    price = data.get("price", 0.0)

    if not name:
        return jsonify({"message": "Medicine name is required."}), 400

    medicine = Medicine(name=name, description=description, stock=stock, price=price)
    db.session.add(medicine)
    db.session.commit()
    return jsonify({"medicine": medicine.to_dict()}), 201


@medicine_bp.route("/<int:medicine_id>", methods=["PUT"])
@jwt_required()
def edit_medicine(medicine_id):
    medicine = Medicine.query.get_or_404(medicine_id)
    data = request.get_json() or {}
    medicine.name = data.get("name", medicine.name)
    medicine.description = data.get("description", medicine.description)
    medicine.stock = data.get("stock", medicine.stock)
    medicine.price = data.get("price", medicine.price)
    db.session.commit()
    return jsonify({"medicine": medicine.to_dict()})


@medicine_bp.route("/<int:medicine_id>", methods=["DELETE"])
@jwt_required()
def delete_medicine(medicine_id):
    medicine = Medicine.query.get_or_404(medicine_id)
    db.session.delete(medicine)
    db.session.commit()
    return jsonify({"message": "Medicine deleted."})
