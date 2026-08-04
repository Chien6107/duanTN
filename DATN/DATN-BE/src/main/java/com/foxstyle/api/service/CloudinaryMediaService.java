package com.foxstyle.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryMediaService {
    private final Cloudinary cloudinary;
    @Value("${cloudinary.cloud-name}") private String cloudName;
    @Value("${cloudinary.api-key}") private String apiKey;
    @Value("${cloudinary.api-secret}") private String apiSecret;

    public UploadResult upload(MultipartFile file, String folder, String publicId, boolean video) throws IOException {
        validateConfiguration();
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", video ? "video" : "image", "folder", "foxstyle/" + folder,
                "public_id", publicId, "overwrite", false));
        return new UploadResult(String.valueOf(result.get("secure_url")),
                String.valueOf(result.get("public_id")), String.valueOf(result.get("resource_type")));
    }
    private void validateConfiguration() {
        if (cloudName.isBlank()) {
            throw new IllegalStateException("Missing Cloudinary configuration");
        }
        if (apiKey.isBlank()) {
            throw new IllegalStateException("Missing Cloudinary configuration");
        }
        if (apiSecret.isBlank()) {
            throw new IllegalStateException("Missing Cloudinary configuration");
        }
    }
    public record UploadResult(String url, String publicId, String resourceType) {}
}
