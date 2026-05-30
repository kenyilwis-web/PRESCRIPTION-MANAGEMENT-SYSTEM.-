from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db

prescription_medicine = db.Table(
    "prescription_medicine",
    db.Column("prescription_id", db.Integer, db.ForeignKey("prescription.id"), primary_key=True),
    db.Column("medicine_id", db.Integer, db.ForeignKey("medicine.id"), primary_key=True),
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(32), nullable=False)
    prescriptions = db.relationship(
        "Prescription",
        backref="doctor",
        lazy=True,
        foreign_keys="Prescription.doctor_id",
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
        }


class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=True)
    stock = db.Column(db.Integer, nullable=False, default=0)
    price = db.Column(db.Float, nullable=False, default=0.0)
    prescriptions = db.relationship(
        "Prescription",
        secondary=prescription_medicine,
        back_populates="medicines",
        lazy="subquery",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "stock": self.stock,
            "price": self.price,
        }


class Prescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(128), nullable=False)
    instructions = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    doctor_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    medicines = db.relationship(
        "Medicine",
        secondary=prescription_medicine,
        back_populates="prescriptions",
        lazy="subquery",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "patient_name": self.patient_name,
            "instructions": self.instructions,
            "created_at": self.created_at.isoformat(),
            "doctor": self.doctor.to_dict() if self.doctor else None,
            "medicines": [medicine.to_dict() for medicine in self.medicines],
        }
