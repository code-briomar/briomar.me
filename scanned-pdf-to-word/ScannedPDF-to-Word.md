# PDF to Word Converter

## User Guide

### Turn scanned documents into editable Word files — even if they're just images.

[Link to Live Demo or Upload Button]

---

### The Problem

Ever tried to edit a scanned PDF and realized you can't select or modify the text? That's because scanned PDFs are just images of documents, not actual text. Most converters fail with these files because they only work with PDFs that already contain selectable text.

`[Image: Screenshot of a non-selectable scanned PDF]`

### The Solution

This tool uses advanced image recognition technology (OCR - Optical Character Recognition) to read text directly from scanned PDF images and converts it into a fully editable Word document.

`[Image: Screenshot of the resulting editable Word document]`

### How It Works

1. **Upload** your scanned PDF file
2. **Wait** 30-90 seconds while we process it
3. **Download** your new, fully editable Word document

`[GIF: Animation showing upload → process → download flow]`

### Features

✅ Handles scanned PDFs that other converters can't  
✅ Preserves basic formatting and line breaks  
✅ Free to use for files up to 5 pages  
✅ No account or sign-up required  
✅ Files deleted immediately after processing

### Limitations

- **Maximum 5 pages** per document (free version)
- **Maximum 20MB** file size
- Only **.PDF** files accepted
- Processing takes **30-90 seconds** depending on file size

### Privacy & Security

Your privacy matters. Files are uploaded, converted, and then **immediately deleted** from our servers. We never store or review your documents.

---

## Technical Documentation

### For Developers: Implementation Guide

This section provides technical details for developers who want to understand or implement similar functionality.

**[View GitHub Repository](https://github.com/code-briomar/scannedpdf_to_word)**

### Overview

This tool converts scanned PDFs (containing images of text) into editable Word documents using OCR technology. Unlike standard PDF converters, it extracts text from image-based PDFs by processing each page through Tesseract OCR and outputting the results to a .docx file.

### Technology Stack

- **Language:** Java
- **OCR Engine:** Tesseract
- **Document Generation:** Apache POI (XWPFDocument)
- **PDF Processing:** Apache PDFBox
- **Framework:** Spring Boot

### Project Structure

```
scannedpdf_to_word/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org.scannedpdf_to_word/
│   │   │       └── ScannedPDFToWord.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
├── tessdata/
├── application.yml
├── Dockerfile
├── pom.xml
└── README.md
```

### Data Storage

No database is implemented. Extracted text is temporarily processed and dumped into a Word document, then immediately cleared from the server once a download link is generated.

---

## API Reference

### Base URL
```
http://your-domain.com/api
```

### Endpoints

#### 1. Health Check

**GET** `/health`

Check if the API is running and available.

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "scanned-pdf-to-word api is up. Make requests to /api/upload",
  "data": null
}
```

**Implementation:**
```java
@GetMapping("/health")
public ResponseEntity<Map<String,Object>> health() {
    Map<String,Object> response = new HashMap<>();
    response.put("status", "success");
    response.put("code", 200);
    response.put("message", "scanned-pdf-to-word api is up. Make requests to /api/upload");
    response.put("data", null);
    
    return ResponseEntity.status(HttpStatus.OK).body(response);
}
```

---

#### 2. Upload PDF

**POST** `/upload`

Upload a PDF file for processing. The file is converted to images and processed asynchronously using OCR.

**Request:**
- Content-Type: `multipart/form-data`
- Parameter: `pdfFile` (file)

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Processing started.",
  "data": {
    "fileID": "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
  }
}
```

**Implementation:**
```java
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Object> uploadPdf(@RequestParam("pdfFile") MultipartFile file) {
    try {
        // Generate unique file ID
        String fileID = UUID.randomUUID().toString();
        
        // Convert MultipartFile to File
        File pdfFile = convertMultiPartToFile(file);
        
        // Start asynchronous processing
        new Thread(() -> {
            try {
                convertPdfToImage(pdfFile);
                processImagesForOCR(fileID);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }).start();
        
        // Return immediate response
        Map<String,Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("code", 200);
        response.put("message", "Processing started.");
        
        Map<String,Object> data = new HashMap<>();
        data.put("fileID", fileID);
        response.put("data", data);
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
        
    } catch (Exception e) {
        e.printStackTrace();
        
        Map<String,Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "error");
        errorResponse.put("code", 500);
        errorResponse.put("message", "An error occurred. Please try again.");
        errorResponse.put("data", null);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
```

**Key Points:**
- File is processed asynchronously in a background thread
- Immediate response with `fileID` for tracking
- Errors are logged to `output.log` in production

---

#### 3. Check Processing Status

**GET** `/check-status`

Check if the uploaded PDF has been fully processed and is ready for download.

**Parameters:**
- `fileID` (required): The unique file identifier returned from `/upload`

**Response (Ready):**
```json
{
  "status": "success",
  "code": 200,
  "message": "file is ready for download",
  "data": {
    "download_url": "/download?fileID=41cfe18f-7297-4fa9-8e4c-bfce3637f1ae"
  }
}
```

**Response (Processing):**
```json
{
  "status": "success",
  "code": 200,
  "message": "file is still being processed. please wait"
}
```

**Implementation:**
```java
@GetMapping("/check-status")
public ResponseEntity<Object> checkFileStatus(@RequestParam("fileID") String fileID) {
    File outputFile = new File("output_" + fileID + ".docx");
    
    if (outputFile.exists()) {
        Map<String,Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("code", 200);
        response.put("message", "file is ready for download");
        
        Map<String,Object> data = new HashMap<>();
        data.put("download_url", "/download?fileID=" + fileID);
        response.put("data", data);
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    // Still processing
    Map<String,Object> response = new HashMap<>();
    response.put("status", "success");
    response.put("code", 200);
    response.put("message", "file is still being processed. please wait");
    
    return ResponseEntity.status(HttpStatus.OK).body(response);
}
```

---

#### 4. Download Converted File

**GET** `/download`

Download the processed Word document.

**Parameters:**
- `fileID` (required): The unique file identifier

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- File download with name: `output_<fileID>.docx`

**Error Response:**
```json
{
  "status": "error",
  "code": 404,
  "message": "file does not exist.",
  "data": null
}
```

**Implementation:**
```java
@GetMapping("/download")
public ResponseEntity<Object> downloadFile(@RequestParam("fileID") String fileID) throws IOException {
    File outputFile = new File("output_" + fileID + ".docx");
    
    if (!outputFile.exists()) {
        Map<String,Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "error");
        errorResponse.put("code", 404);
        errorResponse.put("message", "file does not exist.");
        errorResponse.put("data", null);
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    byte[] fileBytes = java.nio.file.Files.readAllBytes(outputFile.toPath());
    
    return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=" + outputFile.getName())
            .body(fileBytes);
}
```

---

## Core Utility Methods

### 1. Convert MultipartFile to File

Converts an uploaded `MultipartFile` into a temporary `File` object for processing.

```java
private File convertMultiPartToFile(MultipartFile file) throws IOException {
    File tempFile = File.createTempFile("temp", file.getOriginalFilename());
    file.transferTo(tempFile);
    return tempFile;
}
```

**Process:**
1. Creates a temporary file with prefix "temp" + random characters
2. Stores in system temporary directory (`java.io.tmpdir`)
3. Transfers uploaded file contents to temporary file
4. Returns file object for further processing

---

### 2. Process Images with OCR

Extracts text from images using Tesseract OCR and generates a Word document.

```java
private void processImagesForOCR(String fileID) {
    File uploadsDir = new File("uploads");
    File[] files = uploadsDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".jpg"));
    
    if (files != null && files.length > 0) {
        ITesseract tesseract = new Tesseract();
        tesseract.setDatapath(System.getProperty("user.dir") + File.separator + "tessdata");
        tesseract.setPageSegMode(1);  // PSM_AUTO for layout analysis
        tesseract.setOcrEngineMode(1); // LSTM OCR engine
        
        try (XWPFDocument document = new XWPFDocument()) {
            for (File imageFile : files) {
                String result = tesseract.doOCR(imageFile);
                
                if (!result.isEmpty()) {
                    String[] lines = result.split("\n");
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        
                        XWPFParagraph paragraph = document.createParagraph();
                        XWPFRun run = paragraph.createRun();
                        run.setText(line.trim());
                        run.setFontSize(12);
                        paragraph.setAlignment(ParagraphAlignment.LEFT);
                    }
                    System.out.println("Processed image: " + imageFile.getName());
                }
            }
            
            // Save document
            File outputFile = new File("output_" + fileID + ".docx");
            try (FileOutputStream out = new FileOutputStream(outputFile)) {
                document.write(out);
            }
            
            // Clean up images
            for (File imageFile : files) {
                if (imageFile.delete()) {
                    System.out.println("Deleted image: " + imageFile.getName());
                } else {
                    System.err.println("Failed to delete image: " + imageFile.getName());
                }
            }
            
        } catch (TesseractException | IOException e) {
            System.err.println("Error during OCR processing: " + e.getMessage());
            e.printStackTrace();
        }
    } else {
        System.out.println("No images found for OCR processing.");
    }
}
```

**Process:**
1. Finds all `.jpg` files in the `uploads` directory
2. Initializes Tesseract with language data and optimal settings
3. Processes each image through OCR
4. Extracts text line by line and adds to Word document
5. Saves document with unique `fileID`
6. Deletes processed images

---

### 3. Convert PDF to Images

Converts each page of a PDF into JPEG images for OCR processing.

```java
private void convertPdfToImage(File pdfFile) throws IOException {
    try (PDDocument document = PDDocument.load(pdfFile)) {
        PDFRenderer pdfRenderer = new PDFRenderer(document);
        
        for (int page = 0; page < document.getNumberOfPages(); page++) {
            BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
            
            File outputDir = new File("uploads");
            if (!outputDir.exists()) {
                outputDir.mkdirs();
            }
            
            File outputFile = new File(outputDir, "page_" + (page + 1) + ".jpg");
            ImageIO.write(image, "JPEG", outputFile);
            
            System.out.println("Converted page " + (page + 1) + " to image");
        }
    }
}
```

**Process:**
1. Loads PDF document
2. Renders each page at 300 DPI for optimal OCR accuracy
3. Saves each page as a JPEG image in the `uploads` directory
4. Names files sequentially: `page_1.jpg`, `page_2.jpg`, etc.

---

## Configuration

### Tesseract Setup

Place Tesseract language data files in the `tessdata/` directory at the project root. The application expects:

```
tessdata/
└── eng.traineddata  # English language data
```

### Application Properties

Configure in `application.properties` or `application.yml`:

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 20MB
```

---

## Deployment

### Docker Support

A `Dockerfile` is included for containerized deployment:

```dockerfile
FROM openjdk:17-jdk-slim
RUN apt-get update && apt-get install -y tesseract-ocr
COPY tessdata /app/tessdata
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Production Considerations

- All errors are logged to `output.log`
- Temporary files are stored in system temp directory
- Processed images are automatically deleted after conversion
- Output files should be cleaned up periodically (implement scheduled cleanup)

---

## Future Enhancements

- **Status tracking:** Create temporary marker files during processing to differentiate between processing and non-existent files
- **Multi-language support:** Add support for additional Tesseract language packs
- **Batch processing:** Handle multiple file uploads simultaneously
- **Premium tier:** Support for files larger than 5 pages
- **Format preservation:** Improve formatting retention (headers, tables, columns)

---

## License

[Add your license information here]

## Contributing

Contributions welcome! Please submit pull requests to the [GitHub repository](https://github.com/code-briomar/scannedpdf_to_word).