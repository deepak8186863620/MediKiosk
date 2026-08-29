import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import os

def train():
    print("Loading dataset...")
    # NOTE: You must download "Training.csv" from the Kaggle dataset and place it in the backend folder.
    # https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning
    dataset_path = "Training.csv"
    
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found. Please download it from Kaggle and place it here.")
        # Create a tiny dummy dataset just to show it works if file is missing
        print("Creating a dummy model for now...")
        dummy_symptoms = ["itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering"]
        df = pd.DataFrame({
            "itching": [1, 0, 0, 0, 1],
            "skin_rash": [1, 0, 0, 0, 1],
            "nodal_skin_eruptions": [1, 0, 0, 0, 0],
            "continuous_sneezing": [0, 1, 1, 0, 0],
            "shivering": [0, 1, 0, 1, 0],
            "prognosis": ["Fungal infection", "Allergy", "Allergy", "Cold", "Fungal infection"]
        })
    else:
        df = pd.read_csv(dataset_path)

    # The last column is usually 'prognosis' (the label). We also drop the 'Unnamed: 133' column if it exists.
    if 'Unnamed: 133' in df.columns:
        df = df.drop(columns=['Unnamed: 133'])

    X = df.drop(columns=['prognosis'])
    y = df['prognosis']

    symptom_features = list(X.columns)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)

    print("Evaluating Model...")
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc:.4f}")
    
    if len(df) > 10: # Only print full report if it's the real dataset
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))

    print("\nSaving model and feature list...")
    joblib.dump(model, "disease_model.joblib")
    with open("symptoms_vocab.json", "w") as f:
        json.dump(symptom_features, f)

    print("Done! Model saved as 'disease_model.joblib' and vocab as 'symptoms_vocab.json'")
    print(f"Number of symptoms tracked: {len(symptom_features)}")

if __name__ == "__main__":
    train()
