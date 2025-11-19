# services/inference.py
from ultralytics import YOLO
from services.image_utils import bytes_to_image
from pathlib import Path

model_path = Path(__file__).resolve().parent.parent / "ai_model" / "yoloseg_bestwithoutNG.pt"
model = YOLO(str(model_path))
  # load once


def run_batch_inference(images_bytes_list: list):
    imgs = [bytes_to_image(b) for b in images_bytes_list]

    results = model.predict(
        source=imgs,
        conf=0.25,
        iou=0.5,
        imgsz=640,
        max_det=1,
        verbose=False
    )

    return results  # list of 4 results

