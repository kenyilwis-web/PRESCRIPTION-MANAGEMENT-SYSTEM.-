from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from backend.models import User, Prescription, Medicine
from backend.extensions import db

user_bp = Blueprint("user", __name__)


def role_required(*allowed_roles):
    def wrapper(fn):
        def decorator(*args, **kwargs):
            jwt_data = get_jwt()
            role = jwt_data.get("role")
            if role not in allowed_roles:
                return jsonify({"message": "Forbidden"}), 403
            return fn(*args, **kwargs)

        decorator.__name__ = fn.__name__
        return decorator

    return wrapper


@user_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    total_users = User.query.count()
    total_prescriptions = Prescription.query.count()
    total_medicines = Medicine.query.count()
    return jsonify(
        {
            "total_users": total_users,
            "total_prescriptions": total_prescriptions,
            "total_medicines": total_medicines,
        }
    )


@user_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_users():
    users = [user.to_dict() for user in User.query.all()]
    return jsonify({"users": users})
