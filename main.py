from fastapi import FastAPI, UploadFile, File, HTTPException
import cv2
import numpy as np
import face_recognition
import requests
import os
from datetime import datetime
from supabaseconfig import supabase,SUPABASE_URL
import mimetypes
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Global variables for known encodings
images = []
classNames = []
encodingListKnown = []
origins = [
    "http://10.0.2.2:8081",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





def load_known_faces():
    """Load all images and compute encodings."""
    global images, classNames, encodingListKnown
    images.clear()
    classNames.clear()
    try:
        response = supabase.table("Uploadimages").select("*").execute()
        data = response.data
        for item in data:
            file_name = item["images"]
            images.append(file_name)
            classNames.append(item["name"])
        encodingListKnown = findEncodings(images)
    except Exception as e:
        print(f"Error loading known faces: {str(e)}")

def findEncodings(images):
    encodeList = []
    for img_url in images:
        try:
            response = requests.get(img_url)
            if response.status_code == 200:
                img_array = np.frombuffer(response.content, np.uint8)
                img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                encodes = face_recognition.face_encodings(img)
                if encodes:
                    encodeList.append(encodes[0])
        except Exception as e:
            print(f"Error encoding image {img_url}: {str(e)}")
    return encodeList

@app.delete("/delete/{filename}")
async def delete(filename: str):
    try:
        file_check = supabase.table("Uploadimages").select("*").eq("name", filename).execute()
        if not file_check.data:
            raise HTTPException(status_code=404, detail=f"File '{filename}' not found")

        response = supabase.table("Uploadimages").delete().eq("name", filename).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Database deletion failed.")

        response1 = supabase.storage.from_("imagebucket").remove([filename])
        if not response1:
            raise HTTPException(status_code=500, detail="Storage deletion failed.")

        return {
            "message": "File deleted successfully",
            "filename": filename,
            "database_response": response,
            "storage_response": response1,
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    try:
        if not file or file.filename == "":
            raise HTTPException(status_code=400, detail="No file uploaded.")

        contents = await file.read()
        content_type = mimetypes.guess_type(file.filename)[0] or "application/octet-stream"

        if content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Unsupported file type.")

        response = supabase.storage.from_("imagebucket").upload(
            file.filename,
            contents,
            {"content-type": content_type}
        )

        image_url = f"{SUPABASE_URL}/storage/v1/object/public/imagebucket/{file.filename}"

        db_response = supabase.table("Uploadimages").insert({"images": image_url, "name": file.filename}).execute()
        if not db_response.data:
            raise HTTPException(status_code=500, detail="Database insertion failed.")

        return {"message": "File uploaded successfully", "filename": file.filename, "url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    try:
        load_known_faces()
        global encodingListKnown

        if not encodingListKnown:
            raise HTTPException(status_code=400, detail="No known encodings available. Upload images first.")

        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        smallFrame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgbSmallFrame = cv2.cvtColor(smallFrame, cv2.COLOR_BGR2RGB)

        faceLocations = face_recognition.face_locations(rgbSmallFrame)
        encodeCurrent = face_recognition.face_encodings(rgbSmallFrame, faceLocations)

        results = []
        for encodeFace, faceLoc in zip(encodeCurrent, faceLocations):
            matches = face_recognition.compare_faces(encodingListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodingListKnown, encodeFace)

            if len(faceDis) > 0:
                matchIndex = np.argmin(faceDis)
                if matches[matchIndex]:
                    name = classNames[matchIndex].upper()
                    name = os.path.splitext(name)[0]
                    results.append({"name": name, "location": faceLoc})
                    new_row = {"name": name, "time": datetime.now().strftime('%H:%M:%S')}
                    supabase.table("Attendance").insert(new_row).execute()

        encodingListKnown = []

        return {"recognized_faces": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance")
def get_attendance():
    try:
        AttendanceResponce = supabase.table("Attendance").select("*").execute()
        return {"attendance": AttendanceResponce.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/presentedImages")
async def get_presentedImages():
    try:
        presentImages = supabase.table("Uploadimages").select("*").execute()
        return {"presentedImages": presentImages.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def home():
    return {"message": "Hello virat"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# If you deploy later to Vercel or AWS Lambda
handler = Mangum(app)


