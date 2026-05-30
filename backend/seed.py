from backend.app import create_app
from backend.extensions import db
from backend.models import User, Medicine, Prescription

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    admin = User(name="Admin User", email="admin@health.com", role="admin")
    admin.set_password("adminpass")
    doctor = User(name="Dr. Smith", email="doctor@health.com", role="doctor")
    doctor.set_password("doctorpass")
    pharmacist = User(name="Pharma User", email="pharmacist@health.com", role="pharmacist")
    pharmacist.set_password("pharmapass")
    patient = User(name="Patient One", email="patient@health.com", role="patient")
    patient.set_password("patientpass")

    db.session.add_all([admin, doctor, pharmacist, patient])
    db.session.commit()

    med1 = Medicine(name="Amoxicillin", description="Antibiotic for bacterial infection", stock=25, price=12.5)
    med2 = Medicine(name="Ibuprofen", description="Pain relief and inflammation control", stock=40, price=8.0)
    med3 = Medicine(name="Lisinopril", description="Blood pressure management", stock=18, price=15.0)

    db.session.add_all([med1, med2, med3])
    db.session.commit()

    prescription = Prescription(
        patient_name="Patient One",
        instructions="Take twice daily after meals.",
        doctor=doctor,
    )
    prescription.medicines.extend([med1, med2])
    db.session.add(prescription)
    db.session.commit()

    print("Database seeded with default users, medicines, and a prescription.")
