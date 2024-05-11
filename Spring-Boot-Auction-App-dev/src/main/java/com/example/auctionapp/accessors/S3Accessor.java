package com.example.auctionapp.accessors;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.auctionapp.config.S3Config;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.UUID;

@Component
public class S3Accessor {
    @Autowired
    private S3Config s3Config;

    @Autowired
    private AmazonS3 amazonS3;

    private final String TEMP_STORAGE_DIRECTORY = "/tmp/images";
    private final String S3_STORAGE_URL_FORMAT = "https://{0}.s3.amazonaws.com/{1}";

    public String putS3Object(@NonNull final MultipartFile requestFile,
                              @NonNull final String directoryName) throws IOException {
        // Correct any backslashes to forward slashes
        String correctedDirectoryName = directoryName.replace("\\", "/");

        final Path completeDirectory = Paths.get(TEMP_STORAGE_DIRECTORY, correctedDirectoryName);
        checkIfDirectoryExistsElseCreate(completeDirectory.toString());

        String originalFileName = requestFile.getOriginalFilename();
        if (originalFileName == null) {
            throw new IllegalArgumentException("File must have a name");
        }

        if (!originalFileName.endsWith(".jpg") && !originalFileName.endsWith(".jpeg")) {
            originalFileName += ".jpg"; // Ensure proper extension
        }
        final Path filePath = Paths.get(completeDirectory.toString(), originalFileName);
        final File file = multipartFileToFile(requestFile, filePath);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(requestFile.getContentType());

        // Generate the correct S3 key with forward slashes
        String s3Key = correctedDirectoryName + "/" + originalFileName + '-' + UUID.randomUUID();

        amazonS3.putObject(s3Config.getBucketName(), s3Key, file);

        return constructS3UploadedUrl(s3Key);
    }


    private File multipartFileToFile(final MultipartFile multipart, final Path filePath) throws IOException {
        final File file = filePath.toFile();
        if (!file.exists()) {
            file.createNewFile(); // Create a new file if it doesn't exist
        }
        multipart.transferTo(filePath); // Transfer MultipartFile content to the new file
        return file;
    }

    private void checkIfDirectoryExistsElseCreate(final String directory) {
        final File dir = new File(directory);
        if (!dir.exists()) {
            dir.mkdirs(); // Create directory if it doesn't exist
        }
    }

    private String constructS3UploadedUrl(final String key) {
        String bucketName = s3Config.getBucketName();
        return MessageFormat.format(S3_STORAGE_URL_FORMAT, bucketName, key);
    }
}
