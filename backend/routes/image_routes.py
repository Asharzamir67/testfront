from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from typing import List
from fastapi.responses import JSONResponse
from utils.dependencies import get_current_user
import base64
from services.inference import run_batch_inference
from services.image_utils import image_to_base64
from schemas.user_schema import ImageProcessRequest

router = APIRouter(
    prefix="/images",
    tags=["Images"]
)

@router.post("/process", summary="Upload 4 images for processing", 
             description="""
Sample request (multipart/form-data):

- images: 4 image files  
- model: string (model name)
- Header: Authorization: Bearer <JWT_TOKEN>
""")
async def process_images(
    images: List[UploadFile] = File(..., description="Upload exactly 4 images"),
    model: str = Form(..., description="Model name"),
    current_user=Depends(get_current_user)
):
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[{timestamp}] 🖼️  IMAGE PROCESSING REQUEST")
    print(f"  User ID: {current_user.id}")
    print(f"  Model: {model}")
    print(f"  Images received: {len(images)}")
    
    if len(images) != 4:
        print(f"  ❌ Error: Expected 4 images, got {len(images)}")
        raise HTTPException(status_code=400, detail="Exactly 4 images required")

     # Read all image bytes first (batch)
    contents = [await img.read() for img in images]

    # ---- BATCH YOLO INFERENCE ----
    results = run_batch_inference(contents)  # returns list of 4 results

    final_status = "ok"
    output_images = []
    defects_count = 0

    # Iterate through results one by one (results[i] is for images[i])
    for idx, result in enumerate(results):
        original_name = images[idx].filename

        # Render YOLO result with masks/boxes
        rendered = result.plot()
        rendered_base64 = image_to_base64(rendered)

        # Check for defects before adding to output
        has_defects = len(result.boxes) > 0 or (result.masks is not None and len(result.masks) > 0)
        if has_defects:
            defects_count += 1

        output_images.append({
            "filename": original_name,
            "predictions": result.to_json(),
            "visualized": rendered_base64
        })

        # --- Your decision logic: mark "notgood" if any defect is detected ---
        if has_defects:
            final_status = "notgood"

    print(f"  ✅ Processing complete - Status: {final_status}")
    print(f"  Defects detected in {defects_count} image(s)")
    
    return JSONResponse({
        "status": final_status,
        "model": model,  # Return the model name in response
        "images": output_images
    })
