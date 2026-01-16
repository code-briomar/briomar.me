# PDF to Word Converter

**Turn scanned documents into editable Word files — even if they're just images.**

[Link to Live Demo or an Upload Button]

---

## The Problem
Ever tried to edit a scanned PDF and realized you can't? That's because it's just a picture of text, not actual text. Most converters fail here because they only work with PDFs that already contain selectable text.

`[Image: Screenshot of a non-selectable scanned PDF]`

## The Solution
This tool reads the text directly from the images in your scanned PDFs using smart image recognition (a process called OCR) and creates a fully editable Word document from it.

`[Image: Screenshot of the resulting editable Word document]`

## How It Works
1.  **Upload** your scanned PDF file.
2.  **Wait** for a short while (usually 30-60 seconds) while we process it.
3.  **Download** your new, fully editable Word document.

`[GIF: A short animation showing the upload -> process -> download flow]`

## Features
✅ Handles scanned PDFs that other converters can't.
✅ Preserves basic formatting and line breaks.
✅ Free to use for files up to 5 pages.
✅ No account or sign-up required.
✅ Your files are deleted immediately after processing for your privacy.

## Limits
-   **Max 5 pages** per document (for the free version).
-   **Max 20MB** file size.
-   Only **.PDF** files are accepted.
-   Processing typically takes **30-90 seconds**, depending on the file size.

## Privacy
Your privacy is our priority. Your files are uploaded, converted, and then **immediately deleted** from our servers. We do not store or review your documents.

---

<details>
<summary><strong>For Developers: Technical Details</strong></summary>

<br>

> ### Converting a Scanned PDF to a Word Document using Java

*This is the original technical documentation for developers interested in the implementation.*

<div>
  <a href="https://github.com/code-briomar/scannedpdf_to_word">
    GitHub Repository
  </a>
</div>

# Table Of Contents
- Introduction
- File Structure
- Data
- API
- Utility Methods

# Introduction

Many tools online provide a way of converting PDFs to Word Documents to enable users to edit those documents. Microsoft Word has such an implementation as well, where you can drag and drop your PDF document into a MS Word window and you are prompted if you wish to convert it to an editable document. After a little bit of experimenting with such functionality, I realized scanned pdfs ( those containing images of texts rather than just text ) do not fully become editable, the scanned sections are transferred as images to the word document and hence are still useless to the user.
This tool's purpose is to take those scanned pdfs, pass them through an OCR, and dump the recovered text into a word document. Simple as that for the **free tier**.

# File Structure

- scannedpdf_to_word (root)
  - src
    - main
      - java
        - org.scannedpdf_to_word
          - ScannedPDFToWord.java
      - resources
        - application.properties
    - test
      - java
  - tessdata
  - application.yml
  - Dockerfile
  - pom.xml
  - README.md

# Data

**No Database System is Implemented**. The only data to be processed is the extracted text from the scannedPDFs which are dumped into a word document and exported to a user. **It's cleared from the server, once a download link is generated**.

# API

This is how you interact with the OCR as a user, making requests to the endpoints I expose.
The endpoints are :

- GET /health - For users to check on the health of the API and whether it's available.
- POST /upload - Users make requests to this endpoint with a scannedPDF file which fires some background workers to start processing the file. The user is also alerted when this occurs.
- GET /check-status - Users ping this endpoint constantly to check whether the file has been fully processed or not.
- GET /download - This endpoint is attached the fileID which makes up the download link of the completed processing.

## 1. GET `/health`

### Description

Checks if the scanned PDF to Word API is up.

### Response

```json
{
  "status": "success",
  "code": 200,
  "message": "scanned-pdf-to-word api is up. Make requests to /api/upload",
  "data": null
}
```

### Code

```java
@GetMapping("/health")
public ResponseEntity health(){
    Map<String,Object> response = new HashMap<>();
    response.put("status","success");
    response.put("code",200);
    response.put("message","scanned-pdf-to-word api is up. Make requests to /api/upload");
    response.put("data",null);

    return ResponseEntity.status(HttpStatus.OK).body(response);
}
```

`@GetMapping("/health")` annotation maps the method to an HTTP GET request on the `/health` route.
`public ResponseEntity<Map<String,Object>> health()` defines a method called `health` which returns an HTTP response with a JSON body `<Map<String,Object>>`
`ResponseEntity` allows the method to return a structured response with a status code e.g 200
`Map<String, Object> response = new HashMap<>();` creates a hashmap to store the response in key value pairs, which follows a standard structure, `status`,`code`, `message`, `data`
`ResponseEntity.status(HttpStatus.OK).body(response)` sets the HTTP response status to 200.
`.body(response)` sends the response JSON to the client.

## 2. POST `/upload`

### Description

The `/upload` endpoint allows users to upload a **PDF file** that will be **converted into images** and **processed using OCR (Optical Character Recognition)**. The processing runs asynchronously in the background, and the API immediately responds with a `fileID` for tracking.

### Successful Response

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

### Code

```java

@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Object> uploadPdf(@RequestParam("pdfFile") MultipartFile file) {
    try {
        String fileID = UUID.randomUUID().toString();
        File pdfFile = convertMultiPartToFile(file);

        new Thread(() -> {
            try {
                convertPdfToImage(pdfFile);
                processImagesForOCR(fileID);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }).start();


        // Immediate Response
        Map<String,Object> response = new HashMap<>();
        response.put("status","success");
        response.put("code",200);
        response.put("message","Processing started.");

        // When Data Exists
        Map<String,Object> data = new HashMap<>();
        data.put("fileID",fileID);

        response.put("data", data);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    } catch (Exception e) {
        e.printStackTrace();

        // Error response
        Map<String,Object> errorResponse = new HashMap<>();
        errorResponse.put("status","error");
        errorResponse.put("code",500);
        errorResponse.put("message","an error occurred. please try again");
        errorResponse.put("data",null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
```

`@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)` This annotation tells Spring boot 1. that this method handles POST requests sent to the `/upload`endpoint. 2. It expects the request to have a file attached as`multipart/form-data`
`public ResponseEntity<Object> uploadPdf(@RequestParam("pdfFile") MultipartFile file)` This method accepts a file from the request (`MultipartFile file`)
Returns a `ResponseEntity` which represents an HTTP response.
`String fileID = UUID.randomUUID().toString();` generates a unique file id that helps keep track of the file during processing.
`File pdfFile = convertMultiPartToFile(file);` the multipart file is not directly usable as a standard Java `File` , it's converted to one before processing. This is a **CRUCIAL** step.

```java
new Thread(() -> {
    try {
        convertPdfToImage(pdfFile);
        processImagesForOCR(fileID);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}).start();
```

This starts a new thread to process the file `asynchronously` so that the API can return a response **immediately** without waiting on this process which is heavy based on the file size.

- The thread:
  1. Converts the **PDF into images** using `convertPdfToImage(pdfFile)`.
  2. Processes those images using OCR with `processImagesForOCR(fileID)`.
- If an **exception occurs**, it throws a `RuntimeException`.
  `e.printStackTrace();` Errors are simply printed to the console. In the production Linux server #linux_server all the printed out errors are dumped into an `output.log` file.
  `return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);`
  The error response is sent back with **500 Internal Server Error** status.

## 3. GET `/check-status`

### Description

to check whether their uploaded PDF has been processed into a Word document (`.docx`). It helps determine if the file is ready for download or still being processed.

### Successful Response

```json
{
  "code": 200,
  "data": {
    "download_url": "/download?fileID=41cfe18f-7297-4fa9-8e4c-bfce3637f1ae"
  },
  "message": "file is ready for download",
  "status": "success"
}
```

### Pending Response

```json
{
  "code": 200,
  "message": "file is still being processed. please wait",
  "status": "success"
}
```

### Code

```java
@GetMapping("/check-status")
public ResponseEntity<Object> checkFileStatus(@RequestParam("fileID") String fileID){
    File outputFile = new File("output_" + fileID + ".docx");


    if(outputFile.exists()){
        Map<String,Object> response = new HashMap<>();
        response.put("status","success");
        response.put("code",200);
        response.put("message","file is ready for download");
        //data exists
        Map<String,Object> data = new HashMap<>();
        data.put("download_url","/download?fileID="+fileID);
        response.put("data",data);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //TODO::Temporary File Created During Processing ( with fileID as the name)
    //TODO::and deleted after processing. To help differentiate processing files and
    //TODO::none existent files
        //Processing
        Map<String,Object> response = new HashMap<>();
        response.put("status","success");
        response.put("code",200);
        response.put("message","file is still being processed. please wait");

        return ResponseEntity.status(HttpStatus.OK).body(response);
}
```

`File outputFile = new File("output_" + fileID + ".docx");` it constructs the name of the output .docx file using the fileID so that it's searchable. It also assumes the output file is stored in the root.
`if(outputFile.exists()){` it checks if the file exists, meaning it's ready to be downloaded.
A download URL is constructed and sent in the data array. Looks something like `/download?fileID=12345`

## 4. GET `/download`

### Description

allows users to **download** a processed Word document (`.docx`) using a unique `fileID`

### Successful Response

The .docx file

### Code

```java
@GetMapping("/download")
public ResponseEntity<Object> downloadFile(@RequestParam("fileID") String fileID) throws IOException {
    File outputFile = new File("output_" + fileID + ".docx");

    if (!outputFile.exists()) {
        Map<String,Object> errorResponse = new HashMap<>();
        errorResponse.put("status","error");
        errorResponse.put("code",200);
        errorResponse.put("message","file does not exist.");
        errorResponse.put("data","null");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    byte[] fileBytes = java.nio.file.Files.readAllBytes(outputFile.toPath());

    return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=" +outputFile.getName())
            .body(fileBytes);
}
```

`byte[] fileBytes = Files.readAllBytes(outputFile.toPath());` Read the file's contents into a byte array.

```java
return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + outputFile.getName())
        .body(fileBytes);
```

Send the file as a downloadable response.
`Content-Disposition: attachment; filename=output_<fileID>.docx` this tells the browser to download the file instead of displaying it.

# Utility Methods

These are the backbone methods running in the background to make sure the file is processed well.

## 1. `private void convertMultipartFile(...)`

### Description

converts a `MultipartFile` (an uploaded file) into a **temporary `File` object** stored on the server.

### Code

```java
private File convertMultiPartToFile(MultipartFile file) throws IOException {
    File tempFile = File.createTempFile("temp", file.getOriginalFilename());
    file.transferTo(tempFile);
    return tempFile;
}
```

`File tempFile = File.createTempFile("temp", file.getOriginalFilename());` creates a temporary file with the prefix `temp` but the OS will add random characters after to avoid conflicts. It is then stored in a temporary directory, `java.io.tmpdir`
`file.transferTo(tempFile);` This transfers the contents of the uploaded file to the temporary file.
`return tempFile;` return the temporary file to be processed further.

## 2. `private void processImagesForOCR(String fileID)`

## Description

This method processes images using **Tesseract OCR**, extracts text, and saves it to a **Word document (`.docx`)**. After processing, it deletes the images.

## Code

```java
private void processImagesForOCR(String fileID) {
    File uploadsDir = new File("uploads");
    File[] files = uploadsDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".jpg"));

    if (files != null && files.length > 0) {
        ITesseract tesseract = new Tesseract();
        // Set the correct path to the tessdata folder
        tesseract.setDatapath(System.getProperty("user.dir") + File.separator + "tessdata");
        tesseract.setPageSegMode(1); // PSM_AUTO for layout analysis
        tesseract.setOcrEngineMode(1); // Set OCR mode to LSTM
        try (XWPFDocument document = new XWPFDocument()) {
            for (File imageFile : files) {
                String result = tesseract.doOCR(imageFile);

                if (result.isEmpty()) {
                    System.out.println("OCR returned no text for " + imageFile.getName());
                } else {
                    String[] lines = result.split("\n");
                    for (String line : lines) {
                        XWPFParagraph paragraph = document.createParagraph();
                        XWPFRun run = paragraph.createRun();

                        if (line.trim().isEmpty()) {
                            continue; // Skip empty lines
                        }

                        run.setText(line.trim());
                        run.setFontSize(12);
                        paragraph.setAlignment(ParagraphAlignment.LEFT);
                    }
                    System.out.println("Processed image: " + imageFile.getName());
                }
            }

            File outputFile = new File("output_"+fileID+".docx");
            try (FileOutputStream out = new FileOutputStream(outputFile)) {
                document.write(out);
            }

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

## 3. `private void convertPDFToImage(...)`

### Description

takes a **PDF file** as input and converts its pages into **JPEG images**, storing them in a directory named `