<br>

<div>
  <a href="https://github.com/code-briomar/scannedpdf_to_word">
    <!-- <img src="../images/github-mark.png" width="30" height="30" alt="Image"> -->
    GitHub Repository
  </a>
</div>

> ### Converting a Scanned PDF to a Word Document using Java

# Table Of Contents

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
An example of a scannedPDF is linked below : #input
![[briane.pdf]]

An example of the output is linked below: #output![[output_1738774914610.docx]]

# API

Yes. This is how you interact with the OCR as a user, making requests to the endpoints I expose.
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

`@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	This annotation tells Spring boot 1. that this method handles POST requests sent to the `/upload`endpoint. 2. It expects the request to have a file attached as`multipart/form-data`
`public ResponseEntity<Object> uploadPdf(@RequestParam("pdfFile") MultipartFile file)
This method accepts a file from the request (`MultipartFile file`)
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
  `return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  The error response is sent back with **500 Internal Server Error** status.

### Flow of Execution

1. The user **uploads a PDF file**.
2. The file is converted to a **Java File**.
3. A **new thread** starts:
   - Converts the PDF into images.
   - Runs **OCR processing** on those images.
4. The API **immediately** responds with:
   - A **200 OK** status.
   - A **file ID** for tracking.
5. If an error occurs:
   - A **500 error response** is returned.

### Why Use Asynchronous Processing?

- Without it, the client **must wait** until processing completes (which could take several seconds or minutes).
- Asynchronous processing allows the API to **return a response instantly**, while the actual file processing runs in the background.

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

```
//TODO::Temporary File Created During Processing ( with fileID as the name)
//TODO::and deleted after processing. To help differentiate processing files and
//TODO::none existent files
```

- **Planned improvement:** The code does not currently check whether the file is actively being processed.
- One **solution** is to create a **temporary marker file** (e.g., `processing_12345.tmp`) and delete it after processing.

### Flow of Execution

1. The client sends a **GET request** to check the status of a file.
2. The method **constructs the expected output file name**.
3. If the file **exists**, the API responds with:
   - A **200 OK** status.
   - A **download link** for the file.
4. If the file **does not exist**, the API assumes it is **still processing** and returns:
   - A **200 OK** status.
   - A message instructing the client to wait.

### Why Use This Approach?

- **Simple and efficient:** Uses `File.exists()` to check if the output file is ready.
- **Provides real-time status updates** for users waiting for their files.
- **Improves user experience** by letting them check progress instead of repeatedly trying to download a non-existent file.

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

#### Potential Issues & Fixes

1. **Temporary File Cleanup**
   - The method creates **temporary files** but doesn’t delete them.
   - Consider using `tempFile.deleteOnExit();` to remove the file when the JVM exits.
2. **Handling Large Files** - If the uploaded file is large, storing it in memory temporarily could cause **OutOfMemoryError**. - Instead, use a **stream-based approach**.
   The fix : `tempFile.deleteOnExit(); // Ensure the file is deleted when the program exits`

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
        //tesseract.setConfigs(Arrays.asList("hocr")); // Generate hOCR output
        try (XWPFDocument document = new XWPFDocument()) {
            for (File imageFile : files) {
                String result = tesseract.doOCR(imageFile);

                if (result.isEmpty()) {
                    System.out.println("OCR returned no text for " + imageFile.getName());
                } else {
                    // Split the result into lines to analyze formatting
                    String[] lines = result.split("\n");
                    for (String line : lines) {
                        XWPFParagraph paragraph = document.createParagraph();
                        XWPFRun run = paragraph.createRun();

                        // Apply formatting based on simple heuristics
                        if (line.trim().isEmpty()) {
                            continue; // Skip empty lines
                        } else if (line.matches("(?i).*(\\b[A-Z]{2,}\\b).*")) {
                            //run.setBold(true); // Set bold for potential headings
                        }

                        // Add text to the run
                        run.setText(line.trim());
                        run.setFontSize(12); // Set a default font size
                        paragraph.setAlignment(ParagraphAlignment.LEFT); // Set alignment
                    }
                    System.out.println("Processed image: " + imageFile.getName());
                }
            }

            // Save the Word document
            File outputFile = new File("output_"+fileID+".docx");
            try (FileOutputStream out = new FileOutputStream(outputFile)) {
                document.write(out);
            }

            // Delete the images after processing
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

```java
File uploadsDir = new File("uploads");
File[] files = uploadsDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".jpg"));
```

This creates a `File` object for the uploads directory.
It then lists all the images inside `uploads` directory.

```java
ITesseract tesseract = new Tesseract();
tesseract.setDatapath(System.getProperty("user.dir") + File.separator + "tessdata");
tesseract.setPageSegMode(1); // PSM_AUTO for layout analysis
tesseract.setOcrEngineMode(1); // Set OCR mode to LSTM
```

Configure Tesseract by creating a new Tesseract OCR engine. Sets the path to `tessdata` which we put in the root of the app. ( tessdata contains the trained language files. )
`setPageSegMode(1)` ensures automatic page segmentation.
`setOcrEngineMode(1)` uses the LSTM neural network for high accuracy

```java
try (XWPFDocument document = new XWPFDocument()) {
    for (File imageFile : files) {
        String result = tesseract.doOCR(imageFile);
```

Created a word doc `XWPFDocument`
iterates through each `.jpg` file and extracts the text using `.doOCR(imageFile)`

```java
String[] lines = result.split("\n");
for (String line : lines) {
    XWPFParagraph paragraph = document.createParagraph();
    XWPFRun run = paragraph.createRun();

    if (line.trim().isEmpty()) {
        continue; // Skip empty lines
    } else if (line.matches("(?i).*(\\b[A-Z]{2,}\\b).*")) {
        // run.setBold(true); // Uncomment to bold potential headings
    }

    run.setText(line.trim());
    run.setFontSize(12);
    paragraph.setAlignment(ParagraphAlignment.LEFT);
}
System.out.println("Processed image: " + imageFile.getName());
```

Splits extracted text into lines
Creates paragraphs in the Word document:

- Skips **empty lines**.
- (Optional) Detects **headings** (all uppercase words).
- **Sets font size & alignment**.

```java
File outputFile = new File("output_" + fileID + ".docx");
try (FileOutputStream out = new FileOutputStream(outputFile)) {
    document.write(out);
}
```

Save the extracted text into a word document named `"output_<fileID>.docx"`.

```java
for (File imageFile : files) {
    if (imageFile.delete()) {
        System.out.println("Deleted image: " + imageFile.getName());
    } else {
        System.err.println("Failed to delete image: " + imageFile.getName());
    }
}
```

Delete the processed images.

## 3. `private void convertPDFToImage(...)`

### Description

takes a **PDF file** as input and converts its pages into **JPEG images**, storing them in a directory named `"uploads"`. This method uses the **Apache PDFBox** library to process the PDF.

### Code

```java
private  void convertPdfToImage(File pdfFile) throws IOException {
    PDDocument document = PDDocument.load(pdfFile);
    PDFRenderer pdfRenderer = new PDFRenderer(document);
    File uploadsDir = new File("uploads");

    // Create the directory if it doesn't exist
    if (!uploadsDir.exists()) {
        uploadsDir.mkdir();
    }

    int pagesToBeProcessed = Math.min(document.getNumberOfPages(),5); // Limit to 30 on a free tier of some sorts.


    for (int page = 0; page < pagesToBeProcessed; ++page) {
        BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300);
        String imagePath = "uploads/page-" + (page + 1) + ".jpg";
        ImageIO.write(bim, "jpg", new File(imagePath));
    }

    document.close();
}
```

```java
PDDocument document = PDDocument.load(pdfFile);
PDFRenderer pdfRenderer = new PDFRenderer(document);
```

This loads the pdf doc into the memory. Then creates a PDFRenderer to extract pages as images.

`int pagesToBeProcessed = Math.min(document.getNumberOfPages(), 5); // Limit to 5 pages` Limits the processing to a maximum of 5 pages, useful for tier based users, premium users could get a cap of about 80.

```java
for (int page = 0; page < pagesToBeProcessed; ++page) {
    BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300);
    String imagePath = "uploads/page-" + (page + 1) + ".jpg";
    ImageIO.write(bim, "jpg", new File(imagePath));
}
```

- **Loops through each page (up to 5 pages max)**.
- **Renders the page at 300 DPI** for high-quality images.
- **Saves the image in JPEG format** inside the "uploads" folder.

```java
document.close();
```

**Closes the PDF file** to free system resources.

## 4. `public ResponseEntity handleMaxSizeException`

## Description

handles cases where a user tries to **upload a file that exceeds the maximum allowed size**.  
It catches `MaxUploadSizeExceededException` and returns an **HTTP 413 (Payload Too Large) response**

## Code

```java
@ExceptionHandler(MaxUploadSizeExceededException.class)
public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
    System.err.println("File upload error: " + exc.getMessage());
    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
            .body("File size exceeds limit!");
}
```

`@ExceptionHandler(MaxUploadSizeExceededException.class)` Indicates that this method is an exception handler for **MaxUploadSizeExceededException** class and the catches the exception when the uploaded file exceeds the size limit.

```yml
%% application.yml %%
server:
  port: ${PORT:8080}

spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 20MB
      max-request-size: 20MB
```

The maximum size is defined in the `application.yml` file.
